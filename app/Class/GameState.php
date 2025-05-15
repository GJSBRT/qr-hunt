<?php

namespace App\Class;

use App\Class\GameModes\Territory\Territory;
use Illuminate\Http\Request;
use App\Exceptions\InvalidGameState;
use App\Exceptions\InvalidTeamPlayer;
use App\Models\Game;
use App\Models\Team;
use App\Models\TeamPlayer;

class GameState {
    const SESSION_KEY_GAME_ID           = "game_id";
    const SESSION_KEY_TEAM_PLAYER_ID    = "team_player";

    public Request $request;
    public Game $game;
    public ?GameMode $gameMode = null;
    public ?TeamPlayer $teamPlayer = null;
    public ?Team $team = null;

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
            throw new InvalidGameState("No game id for request.");
        }

        $this->game = Game::where("id", $gameId)->first();
        if (!$this->game) {
            self::clearGameStateFromRequest($this->request);
            throw new InvalidGameState("No game for request.");
        }

        switch ($this->game->game_mode) {
            case Territory::GAME_MODE_TYPE:
                $this->gameMode = new Territory($this->game->territory()->first());
                break;
        }

        if (!$this->gameMode) {
            throw new InvalidGameState("Game contains configuration error.");
        }

        $teamPlayerId = $this->request->session()->get(self::SESSION_KEY_TEAM_PLAYER_ID);
        if (!$teamPlayerId) {
            return;
        }

        $this->teamPlayer = TeamPlayer::where("id", $teamPlayerId)->first();
        if (!$this->teamPlayer) {
            return;
        }

        $this->team = $this->teamPlayer ? $this->teamPlayer->team()->first() : null;
    }

    /**
     * Create a new game state from a request
     */
    public function createNewGameStateFromSession(Game $game) {
        $this->game = $game;
        $this->request->session()->put(GameState::SESSION_KEY_GAME_ID, $game->id);
    }

    public function toArray(): array {

        $array = [
            'game'       => $this->game,
            'gameMode'   => $this->gameMode->toArray(),
            'teams'      => $this->game->teams()->get(),
            'teamPlayer' => $this->teamPlayer,
            'teamData'   => $this->team ? $this->gameMode->getTeamData($this->team) : null,
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
            $teamScores[] = [
                'name'      => $team->name,
                'points'    => 0,
            ];
        }

        usort($teamScores, function($a, $b) {
            return $b['points'] <=> $a['points'];
        });

        return $teamScores;
    }
}
