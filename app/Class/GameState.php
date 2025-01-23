<?php

namespace App\Class;

use Illuminate\Http\Request;
use App\Exceptions\InvalidGameState;
use App\Exceptions\InvalidTeamPlayer;
use App\Models\Game;
use App\Models\Power;
use App\Models\Team;
use App\Models\TeamPlayer;
use Carbon\Carbon;

class GameState {
    const SESSION_KEY_GAME_ID           = "game_id";
    const SESSION_KEY_TEAM_PLAYER_ID    = "team_player";

    private bool $initialized = false;
    public Request $request;
    public Game $game;
    public ?TeamPlayer $teamPlayer = null; 

    public function __construct(Request $request) {
        $this->request = $request;
    }

    /**
     * Get a game state from a request
     * 
     * @throws \App\Exceptions\InvalidGameState
     */
    public function getGameStateFromSession() {
        $gameId = $this->request->session()->get(self::SESSION_KEY_GAME_ID);
        if (!$gameId) {
            self::clearGameStateFromRequest($this->request);
            throw new InvalidGameState("No game id for request");
        }

        $this->game = Game::where("id", $gameId)->with(['game_map_area_points'])->first();
        if (!$this->game) {
            self::clearGameStateFromRequest($this->request);
            throw new InvalidGameState("No game for request");
        }

        $this->initialized = true;

        $teamPlayerId = $this->request->session()->get(self::SESSION_KEY_TEAM_PLAYER_ID);
        if (!$teamPlayerId) {
            return;
        }

        $this->teamPlayer = TeamPlayer::where("id", $teamPlayerId)->first();
        if (!$this->teamPlayer) {
            return;
        }
    }

    /**
     * Create a new game state from a request
     */
    public function createNewGameStateFromSession(Game $game) {
        $this->game = $game;
        $this->request->session()->put(GameState::SESSION_KEY_GAME_ID, $game->id);

        $this->initialized = true;
    }

    public function toArray(): array {
        $team = $this->teamPlayer ? $this->teamPlayer->team()->first() : null;
        $teamQrCodes = $team ? $team->team_qr_codes()->with(['qr_code', 'power', 'quartet', 'team_player', 'transferred_from_team'])->get() : null;

        $quartets = [];
        if ($teamQrCodes) {
            foreach($teamQrCodes as $teamQrCode) {
                if (!$teamQrCode->quartet) continue;

                if (!isset($quartets[$teamQrCode->quartet->category])) {
                    $quartets[$teamQrCode->quartet->category] = [
                        'color' => QuartetSettings::CATEGORIES_AND_COLORS[$teamQrCode->quartet->category],
                        'label' => QuartetSettings::CATEGORIES_AND_LABELS[$teamQrCode->quartet->category],
                        'cards' => [$teamQrCode->quartet->value]
                    ];
                } else {
                    $quartets[$teamQrCode->quartet->category]['cards'] = [...$quartets[$teamQrCode->quartet->category]['cards'], $teamQrCode->quartet->value];
                    sort($quartets[$teamQrCode->quartet->category]['cards']);
                }
            }
        }

        $array = [
            'game'                      => $this->game,
            'team'                      => $team,
            'teamPlayer'                => $this->teamPlayer,
            'teams'                     => $this->game->teams()->get(),
            'teamQrCodes'               => $teamQrCodes,
            'quartets'                  => $quartets,
            'scanFreeze'                => $team ? $team->team_scan_freezes()->where('starts_at', '<', Carbon::now())->where('ends_at', '>', Carbon::now())->get() : null,
            'powerAppliedTeamQRCodes'   => $team ? $team->power_applied_team_qr_codes()->where('power_completed_at', null)->with(['power'])->get() : null,
        ];

        return $array;
    }

    /**
     * Get a game state from a request
     * 
     * @throws \App\Exceptions\InvalidTeamPlayer
     */
    public function setTeamPlayer(TeamPlayer $teamPlayer) {
        $team = $teamPlayer->team()->first();
        if ($team->game_id != $this->game->id) {
            throw new InvalidTeamPlayer();
        }

        $this->request->session()->put(GameState::SESSION_KEY_TEAM_PLAYER_ID, $teamPlayer->id);
        $this->teamPlayer = $teamPlayer;
    }

    static public function clearGameStateFromRequest(Request $request): void {
        $request->session()->forget(self::SESSION_KEY_GAME_ID);
        $request->session()->forget(self::SESSION_KEY_TEAM_PLAYER_ID);
    }

    static public function getScores(Game $game): array {
        $teamScores = [];

        foreach($game->teams()->get() as $team) {
            $teamQrCodes = $team->team_qr_codes()->with(['power'])->get();

            $wildCards = 0;
            foreach ($teamQrCodes as $teamQrCode) {
                if ($teamQrCode->type == Power::TYPE_WILDCARD) {
                    $wildCards++;
                }
            }

            $originalWildcardAmount = $wildCards;

            $cardCount = 0;
            $categoryCount = [];
            foreach($teamQrCodes as $teamQrCode) {
                $qrCode = $teamQrCode->qr_code()->first();
                if (!$qrCode) continue;

                $quartet = $qrCode->quartet()->first();
                if (!$quartet) continue;

                $cardCount++;

                if (isset($categoryCount[$quartet->category])) {
                    $categoryCount[$quartet->category]++;
                } else {
                    $categoryCount[$quartet->category] = 1;
                }
            }

            $completedSets = 0;
            foreach($categoryCount as $k => $count) {
                if (($game->quartet_values - $count) <= $wildCards) {
                    $cardsNeeded = $game->quartet_values - $count;

                    $categoryCount[$k] += $cardsNeeded;
                    $wildCards -= $cardsNeeded;
                }

                if ($categoryCount[$k] == $game->quartet_values) {
                    $completedSets++;
                }
            }

            $points = 0;
            foreach($categoryCount as $count) {
                if ($count == $game->quartet_values) {
                    $points += $count + 2;
                } else {
                    $points += $count;
                }
            }

            $teamScores[] = [
                'name'      => $team->name,
                'points'    => $points,
                'wildcards' => $originalWildcardAmount,
                'cards'     => $cardCount,
                'sets'      => $completedSets
            ];
        }

        usort($teamScores, function($a, $b) {
            return $b['points'] <=> $a['points'];
        });

        return $teamScores;
    }
}
