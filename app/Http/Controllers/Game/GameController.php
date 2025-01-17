<?php

namespace App\Http\Controllers\Game;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;
use App\Models\Game;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class GameController extends Controller
{
    public function index(Request $request)
    {
        $game = Game::where('id', $request->session()->get('game_id'));

        return Inertia::render('Game', [
            'game' => $game
        ]);
    }

    public function join(Request $request)
    {
        $body = $request->validate([
            'code' => 'required|string'
        ]);

        $game = Game::where('code', $body['code'])->first();

        if (!$game) {
            throw ValidationException::withMessages([
                'code' => 'Ongeldige spel code'
            ]);
        }

        $request->session()->put('game_id', $game->id);

        return Redirect::route('game.index');
    }
}
