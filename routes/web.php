<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('LandingPage', [
        'auth' => [
            'user' => Auth::user(),
        ],
    ]);
})->name('home');

// Route::get("tes", function(){
//     return Inertia::render("dashboard");
// });

Route::get("cart", function(){
    return Inertia::render("CartPage");
});

Route::get('order/{status}', function ($status) {
    $allowedStatuses = ['belum-bayar', 'sedang-proses', 'selesai', 'dibatalkan'];

    if (!in_array($status, $allowedStatuses)) {
        abort(404);
    }

    return Inertia::render('orders/OrderPage', [
        'status' => $status,
    ]);
});


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('LandingPage', [
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
