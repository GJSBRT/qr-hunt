<?php

namespace App\Broadcasting;

use App\Class\GameState;
use App\Exceptions\InvalidGameState;
use App\Models\Game;
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
        if ($user && $user->id > 0) {   
            $game = Game::where('id', $gameId)->where('user_id', $user->id)->first();
            if (!$game) return false;
        } else {
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
        }

        return true;
    }
}
