<?php

namespace App\Http\Controllers\GameMaster;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class TeamController extends Controller
{
    public function delete(Request $request, int $id, int $teamId) {
        $user = $request->user();
        
        $game = $user->games()->where('id', $id)->firstOrFail();
        $team = $game->teams()->where('id', $teamId)->firstOrFail();

        $team->delete();

        return Redirect::back();
    }
}
