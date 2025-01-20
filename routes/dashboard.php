<?php

use App\Http\Controllers\Dashboard\GameController;
use App\Http\Controllers\Dashboard\PowerController;
use App\Http\Controllers\Dashboard\QRCodeController;
use App\Http\Controllers\Dashboard\TeamController;
use App\Http\Controllers\Dashboard\TeamPointModifierController;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('/dashboard')->middleware(['auth', 'verified'])->group(function() {
    Route::get('/', function () {
        return Redirect::route('dashboard.games.index');
    })->name('dashboard');
    
    Route::prefix('games')->group(function() {
        Route::get('/', [GameController::class, 'index'])->name('dashboard.games.index');
        Route::post('/', [GameController::class, 'create'])->name('dashboard.games.create');

        Route::prefix('/{id}')->group(function() {
            Route::get('/', [GameController::class, 'view'])->name('dashboard.games.view');
            Route::put('/', [GameController::class, 'update'])->name('dashboard.games.update');

            Route::prefix('/qr-codes')->group(function() {
                Route::get('/', [QRCodeController::class, 'index'])->name('dashboard.games.qr-codes.index');
                Route::post('/', [QRCodeController::class, 'create'])->name('dashboard.games.qr-codes.create');
                Route::get('/{qrCodeUuid}', [QRCodeController::class, 'view'])->name('dashboard.games.qr-codes.view');
                Route::put('/{qrCodeUuid}', [QRCodeController::class, 'update'])->name('dashboard.games.qr-codes.update');
                Route::delete('/{qrCodeUuid}', [QRCodeController::class, 'delete'])->name('dashboard.games.qr-codes.delete');
            });

            Route::prefix('/powers')->group(function() {
                Route::get('/', [PowerController::class, 'index'])->name('dashboard.games.powers.index');
                Route::post('/', [PowerController::class, 'create'])->name('dashboard.games.powers.create');
                Route::get('/{powerId}', [PowerController::class, 'view'])->name('dashboard.games.powers.view');
                Route::put('/{powerId}', [PowerController::class, 'update'])->name('dashboard.games.powers.update');
                Route::delete('/{powerId}', [PowerController::class, 'delete'])->name('dashboard.games.powers.delete');
            });

            Route::prefix('/teams')->group(function() {
                Route::get('/', [TeamController::class, 'index'])->name('dashboard.games.teams.index');

                Route::prefix('/{teamId}')->group(function() {
                    Route::get('/', [TeamController::class, 'view'])->name('dashboard.games.teams.view');
                    Route::delete('/', [TeamController::class, 'delete'])->name('dashboard.games.teams.delete');

                    Route::prefix('point-modifiers')->group(function() {
                        Route::post('/', [TeamPointModifierController::class, 'create'])->name('dashboard.games.teams.points-modifiers.create');
                        Route::put('/{modifierId}', [TeamPointModifierController::class, 'update'])->name('dashboard.games.teams.points-modifiers.update');
                        Route::delete('/{modifierId}', [TeamPointModifierController::class, 'delete'])->name('dashboard.games.teams.points-modifiers.delete');
                    });
                });
            });
        });
    });    
});
