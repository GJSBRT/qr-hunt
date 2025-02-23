<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Game\GameController;
use App\Http\Controllers\Game\LobbyController;
use App\Http\Controllers\Game\QRCodeController;
use App\Http\Controllers\Game\TeamController;
use App\Http\Middleware\GameSession;

Route::prefix('/game')->group(function() {
    Route::post('/join', [LobbyController::class, 'join'])->name('game.lobby.join');

    Route::prefix('/')->middleware(GameSession::class)->group(function() {
        Route::get('/', [GameController::class, 'index'])->name('game.index');
        Route::post('/qr-codes', [GameController::class, 'qr_code'])->name('game.qr-code');
        Route::put('/qr-codes/{teamQRCodeId}/transfer', [QRCodeController::class, 'transfer'])->name('game.qr-code.transfer');
        Route::put('/qr-codes/{teamQRCodeId}/power', [QRCodeController::class, 'power'])->name('game.qr-code.power');
        Route::put('/qr-codes/{teamQRCodeId}/complete-power', [QRCodeController::class, 'complete_power'])->name('game.qr-code.complete-power');

        Route::prefix('/lobby')->group(function() {
            Route::get('/', [LobbyController::class, 'index'])->name('game.lobby.index');

            Route::post('/teams', [TeamController::class, 'create'])->name('game.lobby.teams.create');
            Route::put('/teams/switch', [TeamController::class, 'switch'])->name('game.lobby.teams.switch');
        });
    });
});
