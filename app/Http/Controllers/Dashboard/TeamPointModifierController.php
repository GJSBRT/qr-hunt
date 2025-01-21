<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\TeamPointsModifier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class TeamPointModifierController extends Controller
{
    public function create(Request $request, int $id, int $teamId) {
        $user = $request->user();
        $game = Game::where('user_id', $user->id)->where('id', $id)->firstOrFail();
        $team = $game->teams()->where('id', $teamId)->firstOrFail();

        $body = $request->validate([
            'type'      => 'required|string|in:add,remove',
            'amount'    => 'required|numeric|min:1',
        ]);

        TeamPointsModifier::create([
            ...$body,
            'team_id' => $team->id,
        ]);

        return Redirect::route('dashboard.games.teams.view', [
            'id'        => $game->id,
            'teamId'    => $team->id,
        ]);
    }

    public function update(Request $request, int $id, int $teamId, int $modifierId) {
        $body = $request->validate([
            'type'      => 'required|string|in:add,remove',
            'amount'    => 'required|numeric|min:1',
        ]);

        $user = $request->user();
        $game = Game::where('user_id', $user->id)->where('id', $id)->firstOrFail();
        $team = $game->teams()->where('id', $teamId)->firstOrFail();

        $teamPointModifier = $team->team_points_modifiers()->where('id', $modifierId)->firstOrFail();
        $teamPointModifier->fill($body);
        $teamPointModifier->save();

        return Redirect::route('dashboard.games.teams.view', [
            'id'        => $game->id,
            'teamId'    => $team->id,
        ]);
    }

    public function delete(Request $request, int $id, int $teamId, int $modifierId) {
        $user = $request->user();
        $game = Game::where('user_id', $user->id)->where('id', $id)->firstOrFail();
        $team = $game->teams()->where('id', $teamId)->firstOrFail();

        $teamPointModifier = $team->team_points_modifiers()->where('id', $modifierId)->firstOrFail();
        $teamPointModifier->delete();

        return Redirect::route('dashboard.games.teams.view', [
            'id'        => $game->id,
            'teamId'    => $team->id,
        ]);
    }
}
