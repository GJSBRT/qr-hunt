<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\QRCode;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Spatie\QueryBuilder\QueryBuilder;

class QRCodeController extends Controller
{
    public function index(Request $request, int $id): Response
    {
        $user = $request->user();
        $game = Game::where('user_id', $user->id)->where('id', $id)->firstOrFail();

        $size = $request->get('size', 50);
        if (!in_array($size, [15, 25, 50, 100])) {
            $size = 50;
        }

        $qrCodes = $game->qr_codes()->with(['quartet', 'power']);

        if ($request->query('search', null) != null) {
            $qrCodes = $qrCodes->search($request->input('search', ''));
        }

        $qrCodeQuery = QueryBuilder::for($qrCodes)->defaultSort('-created_at')->allowedSorts((new QRCode)->sortable);

        return Inertia::render('Dashboard/Games/View/QRCodes', [
            'game'      => $game,
            'qrCodes'   => $qrCodeQuery->paginate($size),
        ]);
    }

    public function create(Request $request, int $id) {
        $user = $request->user();
        $game = Game::where('user_id', $user->id)->where('id', $id)->firstOrFail();

        $body = $request->validate([
            'power_id'      => 'nullable|numeric|exists:power,id',
            'description'   => 'nullable|string|min:1|max:255',
            'max_scans'     => 'nullable|numeric|min:1|max:255',
        ]);

        $qrCode = QRCode::create([
            ...$body,
            'uuid'      => Str::uuid(),
            'game_id'   => $game->id,
        ]);

        return Redirect::route('dashboard.games.qr-codes.index', $game->id);
    }

    public function view(Request $request, int $id, string $qrCodeUuid): Response {
        $user = $request->user();
        $game = Game::where('user_id', $user->id)->where('id', $id)->firstOrFail();

        $qrCode = $game->qr_codes()->where('uuid', $qrCodeUuid)->firstOrFail();

        return Inertia::render('Dashboard/Games/View/QRCodes/View', [
            'game'      => $game,
            'qrCode'    => $qrCode,
            'image'     => base64_encode($qrCode->generateImage()),
        ]);
    }

    public function delete(Request $request, int $id, string $qrCodeUuid) {
        $user = $request->user();
        $game = Game::where('user_id', $user->id)->where('id', $id)->firstOrFail();

        $qrCode = $game->qr_codes()->where('uuid', $qrCodeUuid)->firstOrFail();
        $qrCode->delete();

        return Redirect::route('dashboard.games.qr-codes.index', $game->id);
    }

    public function update(Request $request, int $id, string $qrCodeUuid) {
        $body = $request->validate([
            'power_id'      => 'nullable|numeric|exists:power,id',
            'description'   => 'nullable|string|min:1|max:255',
            'max_scans'     => 'nullable|numeric|min:1|max:255',
        ]);

        $user = $request->user();
        $game = Game::where('user_id', $user->id)->where('id', $id)->firstOrFail();

        $qrCode = $game->qr_codes()->where('uuid', $qrCodeUuid)->firstOrFail();
        $qrCode->fill($body);
        $qrCode->save();

        return Redirect::route('dashboard.games.qr-codes.view', [
            'id'            => $game->id,
            'qrCodeUuid'    => $qrCode->uuid
        ]);
    }
}
