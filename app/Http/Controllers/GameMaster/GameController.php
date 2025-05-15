<?php

namespace App\Http\Controllers\GameMaster;

use App\Class\GameState;
use App\Events\TeamWonEvent;
use App\Http\Controllers\Controller;
use App\Models\Game;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Spatie\QueryBuilder\QueryBuilder;

class GameController extends Controller
{
    public function index(Request $request): Response {
        $user = $request->user();

        $size = $request->get('size', 50);
        if (!in_array($size, [15, 25, 50, 100])) {
            $size = 50;
        }

        $games = $user->games();

        if ($request->query('search', null) != null) {
            $games = $games->search($request->input('search', ''));
        }

        $gamesQuery = QueryBuilder::for($games)->defaultSort('-id')->allowedSorts((new Game)->sortable);

        return Inertia::render('GameMaster', [
            'games' => $gamesQuery->paginate($size),
        ]);
    }

    public function create(Request $request) {
        $user = $request->user();

        $body = $request->validate([
            'name'                  => 'required|string|min:2|max:255',
            'code'                  => 'required|string|min:2|max:255|unique:game,code',
            'play_duration'         => 'nullable|numeric|min:60|max:21600', // max 6 hours
            'cooldown_duration'     => 'nullable|numeric|min:5|max:3600', // max 1 hour
            'show_results'          => 'required|boolean',
        ]);

        $game = Game::create([
            ...$body,
            'status'    => Game::STATUS_DRAFT,
            'user_id'   => $user->id,
        ]);

        return Redirect::route('dashboard.games.view', $game->id);
    }

    public function view(Request $request, int $id): Response {
        $user = $request->user();
        $game = $user->games()->where('id', $id)->with([
            'teams' => ['team_players']
        ])->firstOrFail();

        $gameMode = $game->getGameMode();

        return Inertia::render('GameMaster/Game/View', [
            'game' => $game,
            'gameMode' => $gameMode->toArray(),
            'results' => $gameMode->getResults(),
            ...$gameMode->toGameMasterArray(),
        ]);
    }

    public function update(Request $request, int $id) {
        $body = $request->validate([
            'name'                  => 'required|string|min:2|max:255',
            'code'                  => 'required|string|min:2|max:255',
            'play_duration'         => 'nullable|numeric|min:60|max:21600', // max 6 hours
            'cooldown_duration'     => 'nullable|numeric|min:5|max:3600', // max 1 hour
            'show_results'          => 'required|boolean',
            'status'                => 'required|string|in:draft,not_started,starting,started,ended',
        ]);

        $user = $request->user();
        $game = $user->games()->where('id', $id)->firstOrFail();

        $game->fill($body);
        $game->save();

        switch ($body['status']) {
            case Game::STATUS_DRAFT:
                // Reset game if set to draft
                $game->teams()->delete();
                break;
            case Game::STATUS_ENDED:
                $game->ended_at = Carbon::now();
                $game->save();

                if (count($game->getResults()) > 0) {
                    TeamWonEvent::dispatch($game, $game->getResults()[0]['team']);
                }

                break;
        }

        return Redirect::route('dashboard.games.view', $id);
    }
}
