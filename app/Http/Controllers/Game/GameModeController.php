<?php

namespace App\Http\Controllers\Game;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use App\Class\GameState;
use App\Exceptions\InvalidGameState;
use App\Http\Controllers\Controller;
use Illuminate\Validation\ValidationException;

class GameModeController extends Controller
{
    public function action(Request $request, string $action)
    {
        $gameState = new GameState($request);

        try {
            $gameState->getGameStateFromSession();
        } catch (InvalidGameState $e) {
            return Redirect::route('welcome');
        }

        if (!isset($gameState->gameMode->gameActions[$action])) {
            throw ValidationException::withMessages([
                'action' => 'Action does not exist in game mode'
            ]);
        }

        $gameAction = $gameState->gameMode->gameActions[$action];
        $result = $gameAction->doUsingRequest($request, $gameState);

        return response()->json($result);
    }
}
