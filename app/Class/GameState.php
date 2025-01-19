<?php

namespace App\Class;

use Illuminate\Http\Request;
use App\Exceptions\InvalidGameState;
use App\Exceptions\InvalidTeamPlayer;
use App\Models\Game;
use App\Models\Team;
use App\Models\TeamPlayer;

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

        $this->game = Game::where("id", $gameId)->first();
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
        $teamQrCodes = $team ? $team->team_qr_codes()->with(['qr_code', 'power', 'quartet', 'team_player'])->get() : null;

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
            'game'          => $this->game,
            'team'          => $team,
            'teamPlayer'    => $this->teamPlayer,
            'teams'         => $this->game->teams()->get(),
            'teamQrCodes'   => $teamQrCodes,
            'quartets'      => $quartets,
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
}
