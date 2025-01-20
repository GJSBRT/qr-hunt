<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Team;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Spatie\QueryBuilder\QueryBuilder;

class TeamController extends Controller
{
    public function index(Request $request, int $id): Response
    {
        $user = $request->user();
        $game = Game::where('user_id', $user->id)->where('id', $id)->firstOrFail();

        $size = $request->get('size', 50);
        if (!in_array($size, [15, 25, 50, 100])) {
            $size = 50;
        }

        $teams = $game->teams();

        if ($request->query('search', null) != null) {
            $teams = $teams->search($request->input('search', ''));
        }

        $teamsQuery = QueryBuilder::for($teams)->defaultSort('-created_at')->allowedSorts((new Team)->sortable);

        return Inertia::render('Dashboard/Games/View/Teams', [
            'game'  => $game,
            'teams' => $teamsQuery->paginate($size),
        ]);
    }

    public function view(Request $request, int $id, int $teamId): Response {
        $user = $request->user();
        $game = Game::where('user_id', $user->id)->where('id', $id)->firstOrFail();

        $team = $game->teams()->where('id', $teamId)->firstOrFail();

        return Inertia::render('Dashboard/Games/View/Teams/View', [
            'game'                  => $game,
            'team'                  => $team,
            'teamPointsModifiers'   => $team->team_points_modifiers()->get()
        ]);
    }

    public function delete(Request $request, int $id, int $teamId) {
        $user = $request->user();
        $game = Game::where('user_id', $user->id)->where('id', $id)->firstOrFail();

        $team = $game->teams()->where('id', $teamId)->firstOrFail();
        $team->delete();

        return Redirect::route('dashboard.games.teams.index', $game->id);
    }
}
