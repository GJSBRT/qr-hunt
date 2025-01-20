<?php

namespace App\Http\Controllers\Game;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use App\Class\GameState;
use App\Exceptions\InvalidGameState;
use App\Http\Controllers\Controller;
use App\Models\QRCode;
use App\Models\TeamQRCode;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class GameController extends Controller
{
    public function index(Request $request)
    {
        $gameState = new GameState($request);

        try {
            $gameState->getGameStateFromSession();
        } catch (InvalidGameState $e) {
            return Redirect::route('welcome');
        }

        return Inertia::render('Game', [
            'gameState' => $gameState->toArray()
        ]);
    }

    public function qr_code(Request $request) {
        $body = $request->validate([
            'uuid' => 'required|string|uuid'
        ]);

        $gameState = new GameState($request);

        try {
            $gameState->getGameStateFromSession();
        } catch (InvalidGameState $e) {
            return Redirect::route('welcome');
        }

        // Valid QR hunt code?
        $qrCode = QRCode::where('uuid', $body['uuid'])->first();
        if (!$qrCode) {
            throw ValidationException::withMessages([
                'uuid' => 'Ongeldige QR code.'
            ]);
        }

        // QR code for this game?
        if ($qrCode->game_id != $gameState->game->id) {
            throw ValidationException::withMessages([
                'uuid' => 'Deze QR code is voor een ander QR hunt spel.'
            ]);
        }

        $team = $gameState->teamPlayer->team()->first();

        // Already scanned?
        $teamQrCodeCount = $team->team_qr_codes()->where('qr_code_uuid', $body['uuid'])->count();
        if ($teamQrCodeCount > 0) {
            throw ValidationException::withMessages([
                'uuid' => 'Jouw team heeft deze QR code al gescanned!'
            ]);
        }

        // Max scans reached of QR code?
        if ($qrCode->max_scans) {
            $qrCodeScanCount = $qrCode->team_qr_codes()->count();
            if ($qrCodeScanCount >= $qrCode->max_scans) {
                throw ValidationException::withMessages([
                    'uuid' => 'Telaat! Deze QR code is al het maximaal aantal keer gescanned.'
                ]);
            }
        }

        // TODO: Check if was scanned at location of QR code.

        $teamQrCode = TeamQRCode::create([
            'qr_code_uuid'      => $body['uuid'],
            'team_id'           => $team->id,
            'team_player_id'    => $gameState->teamPlayer->id,
        ]);

        return response()->json([
            'quartet' => $qrCode->quartet()->first(),
            'power' => $qrCode->power()->first(),
        ]);
    }
}
