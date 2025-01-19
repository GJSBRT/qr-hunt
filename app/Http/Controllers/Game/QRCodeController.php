<?php

namespace App\Http\Controllers\Game;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use App\Class\GameState;
use App\Events\TeamQRCodeTransferredEvent;
use App\Exceptions\InvalidGameState;
use App\Http\Controllers\Controller;
use App\Models\TeamQRCode;
use Illuminate\Validation\ValidationException;

class QRCodeController extends Controller
{
    public function transfer(Request $request, int $teamQRCodeId)
    {
        $body = $request->validate([
            "team_id" => "required|numeric|exists:team,id",
        ]);

        $teamQrCode = TeamQRCode::where("id", $teamQRCodeId)->firstOrFail();

        $gameState = new GameState($request);

        try {
            $gameState->getGameStateFromSession();
        } catch (InvalidGameState $e) {
            return Redirect::route("welcome");
        }

        if ($gameState->teamPlayer->team_id == $body['team_id']) {
            throw ValidationException::withMessages([
                "team_id" => "Je kan geen QR code aan je eigen team geven slimpie."
            ]);
        }

        if ($gameState->teamPlayer->team_id != $teamQrCode->team_id) {
            throw ValidationException::withMessages([
                "teamQRCodeId" => "Je bezit deze QR code niet (meer)."
            ]);
        }

        $teamQrCode->team_id                    = $body["team_id"];
        $teamQrCode->transferred_from_team_id   = $gameState->teamPlayer->team_id;
        $teamQrCode->save();

        TeamQRCodeTransferredEvent::dispatch($teamQrCode);

        return Redirect::to(route("game.index")."?page=qrcodes");
    }
}
