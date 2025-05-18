<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ownerDashboard;
use App\Http\Controllers\ownerSupplier;
use App\Http\Controllers\ownerProduct;

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
    })->name('owner-tambah-produk');
    Route::get('owner-produk/edit', function () {
        return Inertia::render('owner/owner-editproduk');
    })->name('owner-edit-produk');
    // Route::get('owner-supplier', [ownerSupplier::class, 'index'])->name('owner-supplier');
    Route::get('owner-supplier/tambah', function () {
        return Inertia::render('owner/owner-tambah-supplier');
    })->name('owner-tambah-supplier');
    Route::resource('owner-supplier', ownerSupplier::class);
    Route::get('/owner-supplier/edit/{id}', 
        [ownerSupplier::class, 'edit']
    )->name('owner-edit-supplier');
    Route::put('/owner-supplier/{id}',[ownerSupplier::class,'update']);

    Route::resource('/owner-produk', ownerProduct::class)->names('owner.produk');

    Route::get('owner-pembelian-supply', function () {
        return Inertia::render('owner/owner-pembelian-supply');
    })->name('owner-pembelian-supply');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
