<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Quartet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;

class QRCodeQuartetController extends Controller
{
    public function create(Request $request, int $id, string $qrCodeUuid) {
        $user = $request->user();
        $game = Game::where('user_id', $user->id)->where('id', $id)->firstOrFail();
        $qrCode = $game->qr_codes()->where('uuid', $qrCodeUuid)->firstOrFail();

        $body = $request->validate([
            'category'  => 'required|string|min:1',
            'value'     => 'required|numeric|min:1',
        ]);

        if ($game->quartets()->groupBy('category')->count() >= $game->quartet_categories) {
            throw ValidationException::withMessages([
                'category' => 'Het spel heeft al genoeg categories. Pas dit limiet aan in de spel instellingen.'
            ]);
        }

        if ($game->quartets()->where('category', $body['category'])->count() >= $game->quartet_values) {
            throw ValidationException::withMessages([
                'category' => 'Deze category heeft al alle kwartet kaarten die nodig zijn. Pas dit limiet aan in de spel instellingen.'
            ]);
        }

        if ($game->quartets()->where('category', $body['category'])->where('value', $body['value'])->count() > 0) {
            throw ValidationException::withMessages([
                'value' => 'Dit kwartet kaartje voor deze categorie bestaat al.'
            ]);
        }

        Quartet::create([
            ...$body,
            'qr_code_uuid' => $qrCode->uuid,
        ]);

        return Redirect::route('dashboard.games.qr-codes.view', [
            'id'            => $game->id,
            'qrCodeUuid'    => $qrCode->uuid,
        ]);
    }

    public function delete(Request $request, int $id, string $qrCodeUuid, int $quartetId) {
        $user = $request->user();
        $game = Game::where('user_id', $user->id)->where('id', $id)->firstOrFail();
        $qrCode = $game->qr_codes()->where('uuid', $qrCodeUuid)->firstOrFail();

        $quartet = $qrCode->quartet()->where('id', $quartetId)->firstOrFail();
        $quartet->delete();

        return Redirect::route('dashboard.games.qr-codes.view', [
            'id'            => $game->id,
            'qrCodeUuid'    => $qrCode->uuid,
        ]);
    }

    public function update(Request $request, int $id, string $qrCodeUuid, int $quartetId) {
        $body = $request->validate([
            'category'  => 'required|string|min:1',
            'value'     => 'required|numeric|min:1',
        ]);

        $user = $request->user();
        $game = Game::where('user_id', $user->id)->where('id', $id)->firstOrFail();
        $qrCode = $game->qr_codes()->where('uuid', $qrCodeUuid)->firstOrFail();

        $quartet = $qrCode->quartet()->where('id', $quartetId)->firstOrFail();
        $quartet->fill($body);
        $quartet->save();

        return Redirect::route('dashboard.games.qr-codes.view', [
            'id'            => $game->id,
            'qrCodeUuid'    => $qrCode->uuid
        ]);
    }
}
