<?php

use App\Http\Controllers\Dashboard\GameController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('/dashboard')->middleware(['auth', 'verified'])->group(function() {
    Route::get('/', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
    
    Route::prefix('games')->group(function() {
        Route::get('/', [GameController::class, 'index'])->name('dashboard.games.index');
        Route::get('/{id}', [GameController::class, 'view'])->name('dashboard.games.view');
    });    
});
