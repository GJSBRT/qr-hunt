<?php

namespace App\Http\Controllers\GameMaster;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class GameModeController extends Controller
{
    public function action(Request $request, int $id, string $action)
    {
        $user = $request->user();
        $game = $user->games()->where('id', $id)->with([
            'teams' => ['team_players']
        ])->firstOrFail();

        $gameMode = $game->getGameMode();

        $gameAction = $gameMode->gameMasterActions[$action];
        $result = $gameAction->doUsingRequest($request);

        return response()->json($result);
    }
}
