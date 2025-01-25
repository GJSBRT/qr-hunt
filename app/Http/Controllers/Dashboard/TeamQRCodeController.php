<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\TeamQRCode;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;

class TeamQRCodeController extends Controller
{
    public function index(Request $request, int $id, int $teamId) {
        $user = $request->user();
        $game = Game::where('user_id', $user->id)->where('id', $id)->firstOrFail();
        $team = $game->teams()->where('id', $teamId)->firstOrFail();

        $size = $request->get('size', 50);
        if (!in_array($size, [15, 25, 50, 100])) {
            $size = 50;
        }

        $teamQRCodes = $team->team_qr_codes()->with(['power', 'quartet', 'qr_code', 'transferred_from_team', 'team_player']);

        if ($request->query('search', null) != null) {
            $teamQRCodes = $teamQRCodes->search($request->input('search', ''));
        }

        $teamQRCodesQuery = QueryBuilder::for($teamQRCodes)->defaultSort('-created_at')->allowedSorts((new TeamQRCode)->sortable);

        return Inertia::render('Dashboard/Games/View/Teams/QRCodes', [
            'game'          => $game,
            'team'          => $team,
            'teamQRCodes'   => $teamQRCodesQuery->paginate($size),
        ]);
    }
}
