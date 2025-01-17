<?php

use App\Http\Controllers\Dashboard\GameController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::prefix('games')->group(function() {
    Route::get('/', [GameController::class, 'index'])->name('dashboard.games.index');
});

