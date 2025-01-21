<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Power;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Spatie\QueryBuilder\QueryBuilder;

class PowerController extends Controller
{
    public function index(Request $request, int $id): Response
    {
        $user = $request->user();
        $game = Game::where('user_id', $user->id)->where('id', $id)->firstOrFail();

        $size = $request->get('size', 50);
        if (!in_array($size, [15, 25, 50, 100])) {
            $size = 50;
        }

        $powers = $game->powers();

        if ($request->query('search', null) != null) {
            $powers = $powers->search($request->input('search', ''));
        }

        $powersQuery = QueryBuilder::for($powers)->defaultSort('-created_at')->allowedSorts((new Power)->sortable);

        return Inertia::render('Dashboard/Games/View/Powers', [
            'game'          => $game,
            'powers'        => $powersQuery->paginate($size),
            'powerTypes'    => Power::TYPES_AND_LABELS,
        ]);
    }

    public function create(Request $request, int $id) {
        $user = $request->user();
        $game = Game::where('user_id', $user->id)->where('id', $id)->firstOrFail();

        $body = $request->validate([
            'power_up'              => 'required|boolean',
            'related_to_other_team' => 'required|boolean',
            'description'           => 'nullable|string|min:1|max:255',
            'type'                  => 'required|string|in:message,wildcard,qr_location_hint,scan_freeze,return_to_start,give_qr_to_another_team',
            'extra_fields'          => 'nullable|array',
        ]);

        $power = Power::create([
            ...$body,
            'game_id'   => $game->id,
        ]);

        return Redirect::route('dashboard.games.powers.view', [
            'id'        => $game->id,
            'powerId'   => $power->id
        ]);
    }

    public function view(Request $request, int $id, int $powerId): Response {
        $user = $request->user();
        $game = Game::where('user_id', $user->id)->where('id', $id)->firstOrFail();

        $power = $game->powers()->where('id', $powerId)->firstOrFail();

        return Inertia::render('Dashboard/Games/View/Powers/View', [
            'game'  => $game,
            'power' => $power,
            'types' => Power::TYPES_AND_LABELS,
        ]);
    }

    public function delete(Request $request, int $id, int $powerId) {
        $user = $request->user();
        $game = Game::where('user_id', $user->id)->where('id', $id)->firstOrFail();

        $power = $game->powers()->where('id', $powerId)->firstOrFail();
        $power->delete();

        return Redirect::route('dashboard.games.powers.index', $game->id);
    }

    public function update(Request $request, int $id, int $powerId) {
        $body = $request->validate([
            'power_up'              => 'required|boolean',
            'related_to_other_team' => 'required|boolean',
            'description'           => 'nullable|string|min:1|max:255',
            'type'                  => 'required|string|in:message',
            'extra_fields'          => 'required|string|array',
        ]);

        $user = $request->user();
        $game = Game::where('user_id', $user->id)->where('id', $id)->firstOrFail();

        $power = $game->powers()->where('id', $powerId)->firstOrFail();
        $power->fill($body);
        $power->save();

        return Redirect::route('dashboard.games.powers.view', [
            'id'        => $game->id,
            'powerId'   => $power->id
        ]);
    }
}
