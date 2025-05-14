<?php

namespace App\Class;

use App\Exceptions\GameModeException;
use App\Models\Game;
use App\Models\Team;

class GameMode {
    protected Game $game;
    protected string $gameMode = '';
    protected string $gameDescriptionHtml = '';
    protected ?GameMap $gameMap = null; 
    /** @var GameAction[] */
    public array $gameActions = [];

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
     * Return team game state data. Private to each team.
     */
    public function getTeamData(Team $team): array {
        if (!$this->game) {
            throw new GameModeException("Game mode is missing game");
        }

        return [
            'team' => $team,
            'gamePowers' => $this->game->powers()->where('owner_team_id', $team->id)->get(),
        ];
    }
}
