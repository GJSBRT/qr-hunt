<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Game\GameController;
use App\Http\Controllers\Game\GameModeController;
use App\Http\Controllers\Game\LobbyController;
use App\Http\Controllers\Game\TeamController;
use App\Http\Middleware\GameSession;

Route::prefix('/game')->group(function() {
    Route::post('/join', [LobbyController::class, 'join'])->name('game.lobby.join');

    Route::prefix('/')->middleware(GameSession::class)->group(function() {
        Route::get('/', [GameController::class, 'index'])->name('game.index');
        Route::post('/action/{action}', [GameModeController::class, 'action'])->name('game.gamemode.action');

        Route::prefix('/lobby')->group(function() {
            Route::get('/', [LobbyController::class, 'index'])->name('game.lobby.index');

            Route::post('/teams', [TeamController::class, 'create'])->name('game.lobby.teams.create');
            Route::put('/teams/switch', [TeamController::class, 'switch'])->name('game.lobby.teams.switch');
        });
    });
});
