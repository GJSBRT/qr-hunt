<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GameMaster\GameController;
use App\Http\Controllers\GameMaster\GameModeController;
use App\Http\Controllers\GameMaster\TeamController;
use App\Http\Controllers\GameMaster\TeamPlayerController;

Route::prefix('/game-master')->middleware('auth')->group(function() {
    Route::get('/', [GameController::class, 'index'])->name('game-master.index');

    Route::post('/game', [GameController::class, 'create'])->name('game-master.game.create');

    Route::prefix('/game/{id}')->group(function() {
        Route::get('/', [GameController::class, 'view'])->name('game-master.game.view');
        Route::put('/', [GameController::class, 'update'])->name('game-master.game.update');
        Route::post('/game-mode/action/{action}', [GameModeController::class, 'action'])->name('game-master.game.game-mode.action');

        Route::prefix('/teams/{teamId}')->group(function() {
            Route::delete('/', [TeamController::class, 'delete'])->name('game-master.game.teams.delete');
            Route::delete('/players/{playerId}', [TeamPlayerController::class, 'delete'])->name('game-master.game.teams.players.delete');
        });
    });
});
