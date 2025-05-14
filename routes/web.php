<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/tes', function () {
    $produk = [
        ['id' => 1, 'nama' => 'Kaos', 'harga' => 50000],
        ['id' => 2, 'nama' => 'Celana', 'harga' => 75000],
    ];

    return Inertia::render('tes', [
        'produk' => $produk
    ]);
})->name('tes');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
