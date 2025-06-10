<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'role:customer,blocked'])->group(function () {
    Route::redirect('settings', 'settings/profile');

    // Regular profile routes
    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Password routes
    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    // Appearance route
    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');
});

Route::middleware(['auth', 'verified', 'role:owner'])->group(function () { 
    // Owner profile routes (separate from settings)
    Route::get('owner-profile', [ProfileController::class, 'edit'])->name('owner.profile.edit');
    Route::patch('owner-profile', [ProfileController::class, 'update'])->name('owner.profile.update');

    // Owner password routes (separate from settings)
    Route::get('owner-password', [PasswordController::class, 'edit'])->name('owner.password.edit');
    Route::put('owner-password', [PasswordController::class, 'update'])->name('owner.password.update');
});