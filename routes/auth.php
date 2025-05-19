<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::post('register', [RegisteredUserController::class, 'store'])->name('auth.register');
    Route::post('login', [AuthenticatedSessionController::class, 'store'])->name('auth.login');
    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])->name('auth.password.email');
    Route::post('reset-password', [NewPasswordController::class, 'store'])->name('auth.password.store');
});

Route::middleware('auth')->group(function () {
    Route::put('password', [PasswordController::class, 'update'])->name('auth.password.update');
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('auth.logout');
});
