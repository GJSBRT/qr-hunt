<?php

namespace App\Http\Middleware;

use App\Class\GameState;
use App\Exceptions\InvalidGameState;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Game;

class GameSession
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $gameState = new GameState($request);

        try {
            $gameState->getGameStateFromSession();
        } catch (InvalidGameState $e) {
            return Redirect::route('welcome');
        }

        if ($request->route()->parameter('game_id') != null && $request->route()->parameter('game_id') != $request->session()->get('game_id')) {
            $request->session()->forget('game_id');
            return Redirect::route('welcome');
        }

        if ($gameState->game->status == Game::STATUS_ENDED) {
            $request->session()->flash('message', 'Dit spel is afgelopen!');
            $request->session()->forget('game_id');
            return Redirect::route('welcome');
        }

        return $next($request);
    }
}
