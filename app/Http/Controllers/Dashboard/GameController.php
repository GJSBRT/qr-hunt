<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;

class GameController extends Controller
{
    public function index(Request $request): Response
    {
        $size = $request->get('size', 50);
        if (!in_array($size, [15, 25, 50, 100])) {
            $size = 50;
        }

        $games = Game::where('id', '!=', null);

        if ($request->query('search', null) != null) {
            $games = $games->search($request->input('search', ''));
        }

        $gamesQuery = QueryBuilder::for($games)->defaultSort('-id')->allowedSorts((new Game)->sortable);

        return Inertia::render('Dashboard/Games', [
            'games' => $gamesQuery->paginate($size),
        ]);
    }
}
