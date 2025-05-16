<?php

use App\Class\GameState;
use App\Http\Controllers\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function (Request $request) {
    $gameState = new GameState($request);

    $inGame = false;
    try {
        $gameState->getGameStateFromSession();
        $inGame = true;
    } catch (\Exception $e) {}

    return Inertia::render('Welcome', [
        'inGame' => $inGame
    ]);
})->name('welcome');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
require __DIR__.'/dashboard.php';
require __DIR__.'/game.php';
require __DIR__.'/game_master.php';
