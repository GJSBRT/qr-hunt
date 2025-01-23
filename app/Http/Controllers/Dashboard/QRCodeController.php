<?php

namespace App\Http\Controllers\Dashboard;

use App\Class\QuartetSettings;
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

    public function print(Request $request, int $id): Response
    {
        $user = $request->user();
        $game = Game::where('user_id', $user->id)->where('id', $id)->firstOrFail();


        $qrCodes = $game->qr_codes()->with(['quartet', 'power'])->get();
        $images = [];
        foreach($qrCodes as $qrCode) {
            $label = $qrCode->description;

            if ($qrCode->quartet) {
                $label = $qrCode->quartet->category_label . ' - ' . $qrCode->quartet->value;
            }

            if ($qrCode->power) {
                $label = $qrCode->power->description ?? $qrCode->power->type;
            }

            if ($label == null || $label == '') {
                $label = $qrCode->uuid;
            }

            $images[] = [
                'image' => base64_encode($qrCode->generateImage()),
                'label' => $label,
            ];
        }

        return Inertia::render('Dashboard/Games/View/QRCodes/Print', [
            'game'      => $game,
            'images'    => $images,
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

        $qrCode = $game->qr_codes()->where('uuid', $qrCodeUuid)->with(['quartet', 'power'])->firstOrFail();

        $quartetCategories = [];
        foreach(QuartetSettings::CATEGORIES_AND_LABELS as $category => $label) {
            $quartetCategories[$category] = [
                'label' => $label,
                'color' => QuartetSettings::CATEGORIES_AND_COLORS[$category]
            ];
        }

        return Inertia::render('Dashboard/Games/View/QRCodes/View', [
            'game'              => $game,
            'qrCode'            => $qrCode,
            'image'             => base64_encode($qrCode->generateImage()),
            'quartetCategories' => $quartetCategories,
            'powers'            => $game->powers()->get()
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
