<?php

namespace App\Http\Middleware;

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
        if (!$request->session()->has('game_id')) {
            return Redirect::route('welcome');
        }

        $game = Game::where('id', $request->session()->get('game_id'))->first();
        if (!$game) {
            return Redirect::route('welcome');
        }

        if ($game->status == Game::STATUS_ENDED) {
            $request->session()->flash('message', 'Dit spel is afgelopen!');
            return Redirect::route('welcome');
        }

        return $next($request);
    }
}
