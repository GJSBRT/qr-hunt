<?php

use App\Http\Controllers\Game\GameController;
use App\Http\Middleware\GameSession;
use Illuminate\Support\Facades\Route;

Route::prefix('/game')->group(function() {
    Route::post('/join', [GameController::class, 'join'])->name('game.join');

    Route::middleware(GameSession::class)->group(function() {
        Route::get('/', [GameController::class, 'index'])->name('game.index');
    });
});
