<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\OwnerDashboard;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('owner-dashboard', [OwnerDashboard::class, 'index'])->name('owner-dashboard');
    Route::get('owner-produk', function () {
        return Inertia::render('owner/owner-produk');
    })->name('owner-produk');
    Route::get('owner-produk/tambah', function () {
        return Inertia::render('owner/owner-tambahproduk');
    })->name('owner-editproduk');Route::get('owner-produk/edit', function () {
        return Inertia::render('owner/owner-editproduk');
    })->name('owner-editproduk');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
