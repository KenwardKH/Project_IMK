<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\customerDashboard;
use App\Http\Controllers\ConfirmOrderController;
use App\Http\Controllers\CustomerCartController;
use App\Http\Controllers\CashierController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ownerDashboard;
use App\Http\Controllers\ownerSupplier;
use App\Http\Controllers\ownerProduct;
use App\Http\Controllers\ownerDaftarKasir;
use App\Http\Controllers\ownerDaftarCustomer;
use App\Http\Controllers\ownerPembelianSupply;
use App\Http\Controllers\OwnerTransaksiController;

// Order routes with controller
Route::get('order/{status}', [OrderController::class, 'index'])->name('orders.index');
Route::get('/test-cashier', function () {
    return 'Cashier route is accessible!';
});
Route::prefix('cashier')->name('cashier.')->group(function () {
        // Main cashier page
        Route::get('/', [CashierController::class, 'index'])->name('index');
        
        // Cart operations
        Route::post('/cart/update', [CashierController::class, 'updateCart'])->name('cart.update');
        Route::delete('/cart/remove/{productId}', [CashierController::class, 'removeFromCart'])->name('cart.remove');
        Route::delete('/cart/clear', [CashierController::class, 'clearCart'])->name('cart.clear');
        
        // Checkout
        Route::post('/checkout', [CashierController::class, 'checkout'])->name('checkout');
        
        // API endpoints (for AJAX requests)
        Route::get('/api/cart-summary', [CashierController::class, 'getCartSummary'])->name('api.cart-summary');
        Route::get('/api/search-products', [CashierController::class, 'searchProducts'])->name('api.search-products');
        Route::get('/api/transaction-history', [CashierController::class, 'getTransactionHistory'])->name('api.transaction-history');
        
        //Confirm Order Page
        Route::get('/orders', [ConfirmOrderController::class, 'index'])->name('order.confirm');
        Route::delete('/orders/{id}', [ConfirmOrderController::class, 'destroy'])->name('order.destroy');
        Route::post('/confirm/{id}', [ConfirmOrderController::class, 'confirmOrder'])->name('order.confirm');

    });
Route::middleware(['auth', 'verified'])->group(function () {
    // Display cart
    Route::get('/cart', [CustomerCartController::class, 'index'])->name('cart.index');

    // Add to cart
    Route::post('/cart', [CustomerCartController::class, 'store'])->name('cart.store');

    // Update cart item
    Route::put('/cart/{id}', [CustomerCartController::class, 'update'])->name('cart.update');

    // Remove from cart
    Route::delete('/cart/{id}', [CustomerCartController::class, 'destroy'])->name('cart.destroy');

    // Get cart count (for navbar)
    Route::get('/cart/count', [CustomerCartController::class, 'getCartCount'])->name('cart.count');

    // CHECKOUT
    Route::post('/checkout', [CustomerCartController::class, 'checkout'])->name('cart.checkout');

    // Order management routes
    Route::get('/order/{id}/detail', [OrderController::class, 'show'])->name('orders.show');
    Route::post('/order/{id}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
    Route::post('/order/{id}/upload-payment', [OrderController::class, 'uploadPaymentProof'])->name('orders.upload-payment');
    Route::get('/order/{id}/invoice', [OrderController::class, 'generateInvoice'])->name('orders.invoice');

    Route::get('/', [customerDashboard::class, 'index'])->name('dashboard');
    Route::get('products', [customerDashboard::class, 'indexProducts'])->name('products.index');
    Route::get('/product/{id}', [CustomerDashboard::class, 'showProduct'])->name('product.show');


    //Cashier
    // route::resource('cashier',CashierController::class)->name('cashier');
    

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
    Route::get('/owner-produk/edit/{id}', [ownerProduct::class, 'edit'])->name('owner.produk.edit');
    Route::post('/owner-produk/update/{id}', [ownerProduct::class, 'update'])->name('owner.produk.update');
    Route::delete('/owner-produk/{id}', [ownerProduct::class, 'destroy'])->name('owner.produk.destroy');

    Route::get('/owner-pembelian-supply', [ownerPembelianSupply::class, 'index'])->name('owner.pembelian.supply');
    Route::get('/owner-pembelian-supply/tambah', [ownerPembelianSupply::class, 'create'])->name('owner.pembelian.supply.create');
    Route::post('/owner-pembelian-supply/store', [ownerPembelianSupply::class, 'store'])->name('owner.pembelian.supply.store');
    Route::get('/owner-pembelian-supply/edit/{id}', [ownerPembelianSupply::class, 'edit'])->name('owner.pembelian.supply.edit');
    Route::put('/owner-pembelian-supply/update/{id}', [ownerPembelianSupply::class, 'update'])->name('owner.pembelian.supply.update');
    Route::delete('/owner-pembelian-supply/destroy/{id}', [ownerPembelianSupply::class, 'destroy'])->name('owner.pembelian.supply.destroy');

    Route::resource('owner-daftar-pelanggan', ownerDaftarCustomer::class);

    // Owner Daftar Kasir Routes
    Route::resource('owner-daftar-kasir', ownerDaftarKasir::class);

    Route::get('owner-riwayat-kasir', function () {
        return Inertia::render('owner/owner-riwayat-kasir');
    })->name('owner-riwayat-kasir');

    Route::get('owner-riwayat-transaksi', [OwnerTransaksiController::class, 'index'])->name('owner-riwayat-transaksi');
    Route::get('owner-laporan-penjualan', function () {
        return Inertia::render('owner/owner-laporan-penjualan');
    })->name('owner-laporan-penjualan');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
