<?php

use App\Http\Controllers\Game\LobbyController;
use App\Http\Controllers\Game\TeamController;
use App\Http\Middleware\GameSession;
use Illuminate\Support\Facades\Route;

Route::prefix('/game')->group(function() {
    Route::post('/join', [LobbyController::class, 'join'])->name('game.lobby.join');

    Route::prefix('/{gameId}')->middleware(GameSession::class)->group(function() {
        Route::prefix('/lobby')->group(function() {
            Route::get('/', [LobbyController::class, 'index'])->name('game.lobby.index');

            Route::post('/teams', [TeamController::class, 'create'])->name('game.lobby.teams.create');
            Route::put('/teams/switch', [TeamController::class, 'switch'])->name('game.lobby.teams.switch');
        });
    });
});
