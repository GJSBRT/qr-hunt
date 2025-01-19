<?php

namespace App\Http\Controllers\Game;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use App\Class\GameState;
use App\Exceptions\InvalidGameState;
use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\TeamPlayer;
use Illuminate\Validation\ValidationException;

class TeamController extends Controller
{
    public function create(Request $request)
    {
        $body = $request->validate([
            'team_name' => 'required|string|min:1|max:255',
        ]);

        $gameState = new GameState($request);

        try {
            $gameState->getGameStateFromSession();
        } catch (InvalidGameState $e) {
            return Redirect::route('welcome');
        }

        if (Team::where('game_id', $gameState->game->id)->where('name', $body['team_name'])->count() > 0) {
            throw ValidationException::withMessages([
                'team_name' => 'Team naam is al ingebruik'
            ]);
        }

        $team = Team::create([
            'game_id'   => $gameState->game->id,
            'name'      => $body['team_name'],
        ]);

        if ($gameState->teamPlayer) {
            // Delete teams without any players
            $previousTeam = Team::where('id', $gameState->teamPlayer->team_id)->first();

            $gameState->teamPlayer->team_id = $team->id;
            $gameState->teamPlayer->save();

            if ($previousTeam && $previousTeam->team_players()->count() == 0) {
                $previousTeam->delete();
            }
        } else {
            $body2 = $request->validate([
                'player_name' => 'required|string|min:1|max:255',
            ]);

            $count = TeamPlayer::where('team_id', $team->id)->where('name', $body2['player_name'])->count();
            if ($count > 0) {
                $body2['player_name'] .= $count++;
            }

            $teamPlayer = TeamPlayer::create([
                'team_id'   => $team->id,
                'name'      => $body2['player_name'],
            ]);
        }

        $gameState->setTeamPlayer($teamPlayer ?? $gameState->teamPlayer);

        return Redirect::route('game.lobby.index');
    }

    public function switch(Request $request)
    {
        $body = $request->validate([
            'team_id' => 'required|numeric|exists:team,id',
        ]);

        $gameState = new GameState($request);

        try {
            $gameState->getGameStateFromSession();
        } catch (InvalidGameState $e) {
            return Redirect::route('welcome');
        }

        if ($gameState->teamPlayer) {
            // Delete teams without any players
            $previousTeam = Team::where('id', $gameState->teamPlayer->team_id)->first();

            $gameState->teamPlayer->team_id = $body['team_id'];
            $gameState->teamPlayer->save();

            if ($previousTeam && $previousTeam->team_players()->count() == 0) {
                $previousTeam->delete();
            }
        } else {
            $body2 = $request->validate([
                'player_name' => 'required|string|min:1|max:255',
            ]);

            if (TeamPlayer::where('team_id', $body['team_id'])->where('name', $body2['player_name'])->count() > 0) {
                throw ValidationException::withMessages([
                    'team_name' => 'Team naam is al ingebruik'
                ]);
            }

            $teamPlayer = TeamPlayer::create([
                'team_id'   => $body['team_id'],
                'name'      => $body2['player_name'],
            ]);
        }

        $gameState->setTeamPlayer($teamPlayer ?? $gameState->teamPlayer);

        return Redirect::route('game.lobby.index');
    }
}
