<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\GameMapAreaPoint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class MapAreaPointController extends Controller
{
    public function create(Request $request, int $id) {
        $user = $request->user();
        $game = Game::where('user_id', $user->id)->where('id', $id)->firstOrFail();

        $body = $request->validate([
            'lat' => 'required|decimal:2,100',
            'lng' => 'required|decimal:2,100',
        ]);

        GameMapAreaPoint::create([
            ...$body,
            'game_id' => $game->id,
        ]);

        return Redirect::route('dashboard.games.view', $game->id);
    }

    public function delete(Request $request, int $id, int $pointId) {
        $user = $request->user();
        $game = Game::where('user_id', $user->id)->where('id', $id)->firstOrFail();

        $gameMapAreaPoint = $game->game_map_area_points()->where('id', $pointId)->firstOrFail();
        $gameMapAreaPoint->delete();

        return Redirect::route('dashboard.games.view', $game->id);
    }
}
