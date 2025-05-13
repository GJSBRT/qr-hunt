<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Game\LobbyController;
use App\Http\Controllers\GameMaster\GameController;

Route::prefix('/game-master')->middleware('auth')->group(function() {
    Route::get('/', [GameController::class, 'index'])->name('game-master.index');

    Route::post('/game', [GameController::class, 'create'])->name('game-master.game.create');
    Route::prefix('/game/{id}')->group(function() {
        Route::get('/', [GameController::class, 'view'])->name('game-master.game.view');
        Route::put('/', [GameController::class, 'update'])->name('game-master.game.update');
    });
});
