<?php

namespace App\Broadcasting;

use App\Class\GameState;
use App\Exceptions\InvalidGameState;
use App\Models\User;
use Illuminate\Http\Request;

class GameChannel
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
    public function join(User $user, int $gameId): array|bool
    {
        $gameState = new GameState(request());

        try {
            $gameState->getGameStateFromSession();
        } catch (InvalidGameState $e) {
            return false;
        }

        if (!$gameState->game) {
            return false;
        }

        if ($gameState->game->id != $gameId) {
            return false;
        }

        return true;
    }
}
