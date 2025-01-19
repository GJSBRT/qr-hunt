<?php

namespace App\Broadcasting;

use App\Class\GameState;
use App\Exceptions\InvalidGameState;
use App\Models\User;
use Illuminate\Http\Request;

class TeamChannel
{
    /**
     * Create a new channel instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Authenticate the user's access to the channel.
     */
    public function join(User $user, int $teamId): array|bool
    {
        $gameState = new GameState(request());

        try {
            $gameState->getGameStateFromSession();
        } catch (InvalidGameState $e) {
            return false;
        }

        if (!$gameState->teamPlayer) {
            return false;
        }

        if ($gameState->teamPlayer->team_id != $teamId) {
            return false;
        }

        return true;
    }
}
