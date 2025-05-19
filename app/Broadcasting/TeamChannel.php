<?php

namespace App\Broadcasting;

use App\Class\GameState;
use App\Exceptions\InvalidGameState;
use App\Models\Team;
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
        if ($user && $user->id > 0) {
            $team = Team::where('id', $teamId)->first();
            if (!$team) return false;

            $game = $team->game()->where('user_id', $user->id)->first();
            if (!$game) return false;
        } else {
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
        }

        return true;
    }
}
