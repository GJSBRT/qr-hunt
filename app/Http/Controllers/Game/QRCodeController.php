<?php

namespace App\Http\Controllers\Game;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use App\Class\GameState;
use App\Events\PowerActivatedEvent;
use App\Events\TeamQRCodeTransferredEvent;
use App\Exceptions\InvalidGameState;
use App\Http\Controllers\Controller;
use App\Models\Power;
use App\Models\Team;
use App\Models\TeamQRCode;
use App\Models\TeamScanFreeze;
use Carbon\Carbon;
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

        $team = $gameState->teamPlayer->team()->first();

        $teamQRCodes = $team->team_qr_codes()->where('power_completed_at', null)->get();
        foreach($teamQRCodes as $tQRc) {
            $power = $tQRc->power()->first();
            if (!$power) continue;
            if ($power->type != Power::TYPE_GIVE_QR_TO_ANOTHER_TEAM) continue;

            $tQRc->power_applied_to_team_id = $team->id;
            $tQRc->power_completed_at = Carbon::now();
            $tQRc->save();
        }

        return Redirect::to(route("game.index")."?page=qrcodes");
    }

    public function power(Request $request, int $teamQRCodeId)
    {
        $body = $request->validate([
            "team_id" => "nullable|numeric|exists:team,id",
        ]);

        $gameState = new GameState($request);

        try {
            $gameState->getGameStateFromSession();
        } catch (InvalidGameState $e) {
            return Redirect::route("welcome");
        }

        $teamQrCode = TeamQRCode::where("id", $teamQRCodeId)->firstOrFail();

        if ($teamQrCode->power_used_at != null) {
            throw ValidationException::withMessages([
                "teamQRCodeId" => "Deze power heeft jouw team al geactiveerd."
            ]);
        }

        if ($gameState->teamPlayer->team_id != $teamQrCode->team_id) {
            throw ValidationException::withMessages([
                "teamQRCodeId" => "Je bezit deze QR code niet (meer)."
            ]);
        }

        $qrCode = $teamQrCode->qr_code()->firstOrFail();
        $power = $qrCode->power()->firstOrFail();

        if ($power->related_to_other_team) {
            $body = $request->validate([
                "team_id" => "required|numeric|exists:team,id",
            ]);

            if ($gameState->teamPlayer->team_id == $body['team_id']) {
                throw ValidationException::withMessages([
                    "team_id" => "Je kan deze power niet op je eigen team activeren."
                ]);
            }

            $team = Team::where('game_id', $gameState->game->id)->where('id', $body['team_id'])->first();
            if (!$team) {
                throw ValidationException::withMessages([
                    'team_id' => 'Geselecteerd team niet gevonden.'
                ]);
            }

            $teamQrCode->power_applied_to_team_id = $team->id;

            switch ($power->type) {
                case Power::TYPE_MESSAGE:
                case Power::TYPE_WILDCARD:
                    $teamQrCode->power_completed_at = Carbon::now();
                    break;
                case Power::TYPE_QR_LOCATION_HINT:
                    // TODO: show hint on map
                    $teamQrCode->power_completed_at = Carbon::now();
                    break;
                case Power::TYPE_SCAN_FREEZE:
                    TeamScanFreeze::create([
                        'team_id'   => $team->id,
                        'starts_at' => Carbon::now(),
                        'ends_at'   => Carbon::now()->addSeconds($power->extra_fields['duration'] ?? 0),
                    ]);

                    $teamQrCode->power_completed_at = Carbon::now();
                    break;
                case Power::TYPE_RETURN_TO_START:
                    break;
                case Power::TYPE_GIVE_QR_TO_ANOTHER_TEAM:
                    break;
            }

            PowerActivatedEvent::dispatch($gameState->game, $team, $power, $gameState->teamPlayer->team()->first());
        } else {
            $team = $gameState->teamPlayer->team()->first();
            $teamQrCode->power_applied_to_team_id = $team->id;

            switch ($power->type) {
                case Power::TYPE_MESSAGE:
                case Power::TYPE_WILDCARD:
                    $teamQrCode->power_completed_at = Carbon::now();
                    break;
                case Power::TYPE_QR_LOCATION_HINT:
                    // TODO: show hint on map
                    $teamQrCode->power_completed_at = Carbon::now();
                    break;
                case Power::TYPE_SCAN_FREEZE:
                    TeamScanFreeze::create([
                        'team_id'   => $team->id,
                        'starts_at' => Carbon::now(),
                        'ends_at'   => Carbon::now()->addSeconds($power->extra_fields['duration'] ?? 0),
                    ]);

                    $teamQrCode->power_completed_at = Carbon::now();
                    break;
                case Power::TYPE_RETURN_TO_START:
                    break;
                case Power::TYPE_GIVE_QR_TO_ANOTHER_TEAM:
                    break;
            }

            PowerActivatedEvent::dispatch($gameState->game, $team, $power, null);
        }

        $teamQrCode->power_used_at = Carbon::now();
        $teamQrCode->save();

        return Redirect::to(route("game.index")."?page=qrcodes");
    }

    public function complete_power(Request $request, int $teamQRCodeId)
    {
        $gameState = new GameState($request);

        try {
            $gameState->getGameStateFromSession();
        } catch (InvalidGameState $e) {
            return Redirect::route("welcome");
        }

        $teamQrCode = TeamQRCode::where("id", $teamQRCodeId)->firstOrFail();

        if ($teamQrCode->power_used_at == null) {
            throw ValidationException::withMessages([
                "teamQRCodeId" => "Deze power is nog niet geactiveerd."
            ]);
        }

        if ($gameState->teamPlayer->team_id != $teamQrCode->power_applied_to_team_id) {
            throw ValidationException::withMessages([
                "teamQRCodeId" => "Deze power is niet aan jouw team toegepast."
            ]);
        }

        $teamQrCode->power_completed_at = Carbon::now();
        $teamQrCode->save();

        return Redirect::to(route("game.index"));
    }
}
