<?php

namespace App\Http\Controllers\GameMaster;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class TeamPlayerController extends Controller
{
    public function delete(Request $request, int $id, int $teamId, int $playerId) {
        $user = $request->user();

        $game = $user->games()->where('id', $id)->firstOrFail();
        $team = $game->teams()->where('id', $teamId)->firstOrFail();
        $player = $team->team_players()->where('id', $playerId)->firstOrFail();

        $player->delete();

        return Redirect::back();
    }
}
