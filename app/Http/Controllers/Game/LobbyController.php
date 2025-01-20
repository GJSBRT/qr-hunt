<?php

namespace App\Http\Controllers\Game;

use App\Class\GameState;
use App\Events\LobbyUpdatedEvent;
use App\Exceptions\InvalidGameState;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;
use App\Models\Game;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class LobbyController extends Controller
{
    public function index(Request $request)
    {
        $gameState = new GameState($request);

        try {
            $gameState->getGameStateFromSession();
        } catch (InvalidGameState $e) {
            return Redirect::route('welcome');
        }

        return Inertia::render('Game/Lobby', [
            'gameState' => $gameState->toArray(),
            'teamPlayers' => $gameState->game->team_players()->with(['team'])->get()
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

        if ($game->status == Game::STATUS_DRAFT) {
            throw ValidationException::withMessages([
                'code' => 'Dit spel kan nog niet gespeeld worden.'
            ]);
        }

        GameState::clearGameStateFromRequest($request);

        $gameState = new GameState($request);
        $gameState->createNewGameStateFromSession($game);

        return Redirect::route('game.lobby.index', $game->id);
    }
}
