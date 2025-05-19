<?php

namespace App\Http\Controllers\Game;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use App\Class\GameState;
use App\Exceptions\InvalidGameState;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class GameController extends Controller
{
    public function index(Request $request)
    {
        $gameState = new GameState($request);

        try {
            $gameState->getGameStateFromSession();
        } catch (InvalidGameState $e) {
            return Redirect::route('welcome');
        }

        return Inertia::render('Game', [
            'gameState' => $gameState->toArray()
        ]);
    }
}
