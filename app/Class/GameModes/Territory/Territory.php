<?php

namespace App\Class\GameModes\Territory;

use App\Class\GameAction;
use App\Class\GameMap;
use App\Class\GameMapArea;
use App\Class\GameMasterAction;
use App\Class\GeoLocation;
use App\Class\GameMode;
use App\Class\GameModes\Territory\Events\AreaClaimedEvent;
use App\Class\GameModes\Territory\Events\KothClaimedEvent;
use App\Class\GameModes\Territory\Events\MissionAnswerIncorrectEvent;
use App\Class\GameModes\Territory\Events\TeamTaggedEvent;
use App\Class\GameState;
use App\Class\TeamScore;
use App\Exceptions\GameModeException;
use App\Models\Team;
use App\Class\GameModes\Territory\Models\Territory as ModelsTerritory;
use App\Class\GameModes\Territory\Models\TerritoryArea;
use App\Class\GameModes\Territory\Models\TerritoryKoth;
use App\Class\GameModes\Territory\Models\TerritoryKothClaim;
use App\Class\GameModes\Territory\Models\TerritoryMission;
use App\Class\GameModes\Territory\Models\TerritoryMissionAnswer;
use App\Class\GameModes\Territory\Models\TerritoryTag;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class Territory extends GameMode
{
    const GAME_MODE_TYPE = 'territory';
    const GAME_MODE_LABEL = 'Territory';

    const GAME_MAP_AREA_TYPE_CHALLENGE = 'challenge';
    const GAME_MAP_AREA_TYPE_KOTH = 'koth';

    private ModelsTerritory $territory;
    private ?TerritoryTag $currentTag = null;

    /**
     * The available end types for this game mode.
     * @var string[]
     */
    const GAME_END_TYPES = [
        GameMode::END_TYPE_DURATION,
    ];

    public function __construct(
        ModelsTerritory $t,
    ) {
        $this->gameMode = self::GAME_MODE_TYPE;
        $this->gameDescriptionHtml = <<<HTML
            <h2>Uitleg</h2>
            <ul>
                <li>
                    Iedereen wordt in teams verdeeld en een gebied ook. Het doel is om als team zo veel mogelijke delen geclaimed te hebben binnen de tijd. Om een gebied te claimen moet je een korte opdracht doen binnen het gebied. Geclaimde gebieden kunnen opnieuw geclaimed worden door een ander team.
                </li>

                <li>
                    Er zijn meerdere "king of the hill" punten. Dit zijn ronde circles. Voor elke 5 minuten dat je dit punt geclaimed hebt krijg je een punt. Je hoeft voor deze punten geen opdracht te doen.
                </li>

                <li>
                    Wanneer een team een punt claimt krijgt iedereen hier bericht van.
                </li>

                <li>
                    Er is telkens ook een team een tikker. Het tikker team mag geen punten claimen. Het tikker team krijgt de locaties te zien van alle spelers. Om punten weer te mogen claimen moet je als tikker eerst een ander team tikken en het stokje overdragen.
                </li>

                <li>
                    Als team mag je niet splitsen.
                </li>
            </ul>
        HTML;

        $this->territory = ModelsTerritory::where('id', $t->id)->with([
            'territory_areas',
            'territory_koths',
        ])->first();
        if (!$this->territory) {
            throw new GameModeException("Could not get territory from database.");
        }

        $this->game = $this->territory->game()->first();
        if (!$this->game) {
            throw new GameModeException("Could not get game from database.");
        }

        // Set location marker
        $startLocationMarker = null;
        if ($this->territory->start_lat && $this->territory->start_lng) {
            $startLocationMarker = new GeoLocation($this->territory->start_lng, $this->territory->start_lat);
        }

        // Set map areas
        $areas = [];
        foreach ($this->territory->territory_areas as $territoryArea) {
            $geoLocations = [];
            foreach ($territoryArea->territory_area_points()->get() as $point) {
                $geoLocations[] = new GeoLocation($point->lng, $point->lat);
            }

            $claimedByTeam = $territoryArea->claim_team()->first();

            $areas[] = new GameMapArea(
                id: 'territory:' . $territoryArea->id,
                name: $territoryArea->name,
                geoLocations: $geoLocations,
                opacity: 0.2,
                displayName: true,
                gameType: self::GAME_MAP_AREA_TYPE_CHALLENGE,
                color: $claimedByTeam ? $this->stringToColor($claimedByTeam->name) :'gray',
                metadata: [
                    'claimed_by_team' => $claimedByTeam,
                    'mission' => $territoryArea->territory_mission()->with(['multiple_choices'])->first(),
                ]
            );
        }

        foreach ($this->territory->territory_koths as $idx => $territoryKoth) {
            $claimedByTeam = $territoryKoth->claims()->orderBy('claimed_at', 'desc')->with('claim_team')->first();

            $areas[] = new GameMapArea(
                id: 'koth:' . $territoryKoth->id,
                name: 'Koth #' . $idx + 1, // TODO: add in db
                geoLocations: [(new GeoLocation($territoryKoth->lng, $territoryKoth->lat))],
                radius: 20,
                type: 'circle',
                color: $claimedByTeam ? $this->stringToColor($claimedByTeam->claim_team->name) : 'gray',
                opacity: 0.2,
                gameType: self::GAME_MAP_AREA_TYPE_KOTH,
                metadata: [
                    'claimed_by_team' => $claimedByTeam,
                ]
            );
        }

        $this->currentTag = $this->territory->territory_tags()->orderBy('created_at', 'desc')->first();

        $this->gameMap = new GameMap(
            showPlayerLocation: true,
            shareLocationDataToServer: true,
            startLocationMarker: $startLocationMarker,
            areas: $areas,
            teamIdsWhichCanViewOthersLocations: $this->currentTag ? [$this->currentTag->team_id] : [],
        );

        $this->gameMasterActions = [
            "review_mission_answer" => new GameMasterAction("review_mission_answer", function (int $mission_answer_id, bool $correct) {
                $missionAnswer = $this->territory->territory_mission_answers()->where('territory_mission_answer.id', $mission_answer_id)->firstOrFail();
                $missionAnswer->marked_correct = $correct;
                $missionAnswer->save();

                $team = $missionAnswer->team()->first();

                if (!$correct) {
                    MissionAnswerIncorrectEvent::dispatch($team, $this->gameMap->getAreaById('territory:' . $missionAnswer->territory_area_id));
                    return [];
                }

                $territoryArea = $missionAnswer->territory_area()->first();

                $territoryArea->claim_team_id = $team->id;
                $territoryArea->save();

                AreaClaimedEvent::dispatch($this->game, $team, $this->gameMap->getAreaById('territory:' . $territoryArea->id));

                return [];
            }),
            "delete_mission" => new GameMasterAction("delete_mission", function (int $mission_id) {
                $missionAnswer = $this->territory->territory_missions()->where('id', $mission_id)->firstOrFail();
                $missionAnswer->delete();
                return [];
            }),
            "create_mission" => new GameMasterAction("delete_mission", function (string $title, string $description, string $answer_type) {
                TerritoryMission::create([
                    'territory_id' => $this->territory->id,
                    'title' => $title,
                    'description' => $description,
                    'answer_type' => $answer_type,
                ]);
                return [];
            }),
        ];

        $this->gameActions = [
            "claim_koth" => new GameAction("claim_koth", function (GameState $gameState, string $areaId) {
                $dbKoth = TerritoryKoth::where('id', str_replace('koth:', '', $areaId))->first();
                if (!$dbKoth) {
                    throw ValidationException::withMessages([
                        'areaId' => 'Area does not exist.'
                    ]);
                }

                if ($this->currentTag && $this->currentTag->team_id == $gameState->team->id) {
                    throw ValidationException::withMessages([
                        'tagged' => 'You may not claim while tagged'
                    ]);
                }

                $lastClaim = $dbKoth->claims()->orderBy('claimed_at', 'desc')->first();
                if ($lastClaim) {
                    throw ValidationException::withMessages([
                        'areaId' => 'You already have claimed this koth area.'
                    ]);
                }

                TerritoryKothClaim::create([
                    'territory_koth_id' => $dbKoth->id,
                    'claim_team_id' => $gameState->teamPlayer->team_id,
                    'claimed_at' => Carbon::now(),
                ]);

                KothClaimedEvent::dispatch($this->game, $gameState->team, $dbKoth);

                return [];
            }),
            "claim_area" => new GameAction("claim_area", function (GameState $gameState, string $areaId, int|null $multiple_choice_id, string|null $open_answer, string|null $photo) {
                $dbArea = TerritoryArea::where('id', str_replace('territory:', '', $areaId))->first();
                if (!$dbArea) {
                    throw ValidationException::withMessages([
                        'areaId' => 'Area does not exist.'
                    ]);
                }

                if ($dbArea->team_id == $gameState->team->id) {
                    throw ValidationException::withMessages([
                        'areaId' => 'You already have claimed this area.'
                    ]);
                }

                if ($this->currentTag && $this->currentTag->team_id == $gameState->team->id) {
                    throw ValidationException::withMessages([
                        'tagged' => 'You may not claim while tagged'
                    ]);
                }

                if ($dbArea->mission_id == null) {
                    $dbArea->claim_team_id = $gameState->team->id;
                    $dbArea->save();

                    AreaClaimedEvent::dispatch($this->game, $gameState->team, $this->gameMap->getAreaById($areaId));
                    return [];
                }

                if ($multiple_choice_id === null && $open_answer === null && $photo === null) {
                    throw ValidationException::withMessages([
                        'missing_answers' => 'Missing answer'
                    ]);
                }

                $mission = $dbArea->territory_mission()->first();

                // Check if team just entered a wrong answer
                $lastAnswer = $mission->answers()->where('territory_area_id', $dbArea->id)->where('team_id', $gameState->team->id)->orderBy('created_at', 'desc')->first();
                if ($lastAnswer && $lastAnswer->marked_correct === false && $dbArea->mission_id === $lastAnswer->territory_mission_id) {
                    throw ValidationException::withMessages([
                        'just_failed' => 'Je hebt hier zojuist een fout antwoord ingedient. Ga eerst door naar een ander gebied.'
                    ]);
                }

                $awaitingAnswers = $mission->answers()->where('territory_area_id', $dbArea->id)->where('team_id', $gameState->team->id)->where('marked_correct', null)->count();
                if ($awaitingAnswers > 0) {
                    throw ValidationException::withMessages([
                        'awaiting_answers' => 'Je hebt al een antwoord ingedient. Deze wordt zsm door de spel leiders beoordeeld.'
                    ]);
                }

                $correct = null;
                if ($mission->answer_type == TerritoryMission::ANSWER_TYPE_MULTIPLE_CHOICE) {
                    $multipleChoiceAnswer = $mission->multiple_choices()->where('id', $multiple_choice_id)->first();
                    if (!$multipleChoiceAnswer) {
                        throw ValidationException::withMessages([
                            'multiple_choice_id' => 'Multiple choice answer given does not exist'
                        ]);
                    }

                    $correct = $multipleChoiceAnswer->correct;
                }

                TerritoryMissionAnswer::create([
                    'territory_mission_id' => $mission->id,
                    'team_id' => $gameState->team->id,
                    'multiple_choice_id' => $multiple_choice_id,
                    'photo' => $photo,
                    'open_answer' => $open_answer,
                    'marked_correct' => $correct,
                    'territory_area_id' => $dbArea->id,
                ]);

                if ($correct === true) {
                    $dbArea->claim_team_id = $gameState->team->id;
                    $dbArea->save();
                    AreaClaimedEvent::dispatch($this->game, $gameState->team, $this->gameMap->getAreaById($areaId));

                    return [
                        'correct' => $correct
                    ];
                }

                // TODO: notify game masters of answer needing review

                return [
                    'correct' => $correct
                ];
            }),
            "tag_team" => new GameAction("tag_team", function (GameState $gameState, int $team_id) {
                if ($gameState->teamPlayer->team_id == $team_id) {
                    throw ValidationException::withMessages([
                        'team_id' => 'You cannot tag your own team'
                    ]);
                }

                $previousTag = $this->territory->territory_tags()->orderBy('created_at', 'desc')->first();
                if ($previousTag->team_id != $gameState->teamPlayer->team_id) {
                    throw ValidationException::withMessages([
                        'team_id' => 'You are not it'
                    ]);
                }

                $tag = TerritoryTag::create([
                    'territory_id' => $this->territory->id,
                    'team_id' => $team_id,
                ]);

                TeamTaggedEvent::dispatch($this->game, $gameState->team, $tag->team()->first());

                return [];
            }),
        ];
    }

    public function getTeamData(Team $team): array
    {
        return [
            ...parent::getTeamData($team),
            'isTagged' => $this->currentTag ? $this->currentTag->team_id === $team->id : false,
        ];
    }

    public function toGameMasterArray(): array {
        return [
            'missionAnswersToReview' => $this->territory->territory_mission_answers()->where('marked_correct', null)->with(['territory_mission', 'team'])->get(),
            'missions' => $this->territory->territory_missions()->with(['multiple_choices'])->get(),
        ];
    }

    public function onGameStart() {
        $teams = $this->game->teams()->get();
        $newTaggedTeam = $teams[rand(0, count($teams) - 1)];

        $tag = TerritoryTag::create([
            'territory_id' => $this->territory->id,
            'team_id' => $newTaggedTeam->id,
        ]);

        TeamTaggedEvent::dispatch($this->game, null, $tag->team()->first());
    }

    public function getResults(): array|null {
        $totalPointsPerTeam = [];

        foreach ($this->territory->territory_koths() as $koth) {
            $kothClaims = $koth->claims()->orderBy('territory_koth_id')->orderBy('claimed_at')->get()->groupBy('territory_koth_id');

            foreach ($kothClaims as $kothClaim) {
                for ($i = 0; $i < $kothClaim->count(); $i++) {
                    $current = $kothClaim[$i];
                    $next = $kothClaim[$i + 1] ?? null;

                    $start = Carbon::parse($current->claimed_at);
                    $end = $next ? Carbon::parse($next->claimed_at) : ($this->game->ended_at ?? now());

                    $durationMinutes = $end->diffInMinutes($start);
                    $points = floor($durationMinutes / 5);

                    $teamId = $current->claim_team_id;

                    if (!isset($totalPointsPerTeam[$teamId])) {
                        $totalPointsPerTeam[$teamId] = 0;
                    }

                    $totalPointsPerTeam[$teamId] += $points;
                }
            }
        }

        $results = [];
        foreach ($this->game->teams()->get() as $team) {
            $score = 0;

            // Points per claimed area.
            $areasClaimed = $this->territory->territory_areas()->where('claim_team_id', $team->id)->count();
            $score += $areasClaimed * $this->territory->points_per_claimed_area;

            // Points for koth.
            if (isset($totalPointsPerTeam[$team->id])) {
                $score += $totalPointsPerTeam[$team->id];
            }

            $results[$score] = new TeamScore($team, $score);
        }

        krsort($results);

        return array_values($results);
    }

    private function stringToColor(string $str): string {
        $str = $str . $str;

        $hash = 0;
        for ($i = 0; $i < strlen($str); $i++) {
            $hash = ord($str[$i]) + (($hash << 5) - $hash);
        }

        $color = '#';
        for ($i = 0; $i < 3; $i++) {
            $value = ($hash >> ($i * 8)) & 0xFF;
            $color .= str_pad(dechex($value), 2, '0', STR_PAD_LEFT);
        }

        return $color;
    }
}
