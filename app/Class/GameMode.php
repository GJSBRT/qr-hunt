<?php

namespace App\Class;

use App\Exceptions\GameModeException;
use App\Models\Game;
use App\Models\Team;

class GameMode {
    /** Let the game end when the time is up. */
    const END_TYPE_DURATION = 'duration'; 
    /** Ends the game when there is a winner. */
    const END_TYPE_WINNER = 'winner';

    protected Game $game;
    protected string $gameMode = '';
    protected string $gameDescriptionHtml = '';
    protected ?GameMap $gameMap = null;
    /** @var GameAction[] */
    public array $gameActions = [];
    /** @var GameMasterAction[] */
    public array $gameMasterActions = [];

    /**
     * Return game mode data, this contains generic data required for the game and should be thought of as public knowledge.
     */
    public function toArray(): array {
        return [
            'gameMode' => $this->gameMode,
            'gameMap' => $this->gameMap ? $this->gameMap->toArray() : null,
            'gameDescriptionHtml' => $this->gameDescriptionHtml,
        ];
    }

    /**
     * Returns data used for the game master.
     */
    public function toGameMasterArray(): array {
        return [];
    }

    /**
     * Return team game state data. Private to each team.
     */
    public function getTeamData(Team $team): array {
        if (!$this->game) {
            throw new GameModeException("Game mode is missing game");
        }

        return [
            'team' => $team,
            'gamePowers' => [],
        ];
    }

    /**
     * Return a team when there is a winner
     */
    public function getWinner(): Team|null {
        return null;
    }

    /**
     * Return a team when there is a winner
     * @return \App\Class\TeamScore[]|null
     */
    public function getResults(): array|null {
        return null;
    }
}
