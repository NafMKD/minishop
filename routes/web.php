<?php

use App\Http\Controllers\Admin\CartController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\OrderController as UserOrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\CartController as UserCartController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [WelcomeController::class, 'index'])->name('home');

Route::middleware(['auth', 'role:admin', 'verified'])->group(function () {
    Route::get('admin/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('admin.dashboard');

    // Products
    Route::get('admin/products', [ProductController::class, 'index'])->name('admin.products');
    Route::post('admin/products', [ProductController::class, 'store'])->name('admin.products.store');
    Route::put('admin/products/{product}', [ProductController::class, 'update'])->name('admin.products.update');
    Route::delete('admin/products/{product}', [ProductController::class, 'destroy'])->name('admin.products.destroy');

    // Carts
    Route::get('admin/carts', [CartController::class, 'index'])->name('admin.carts');

    // Orders
    Route::get('admin/orders', [OrderController::class, 'index'])->name('admin.orders');
});

Route::middleware(['auth', 'role:user', 'verified'])->group(function () {
    // User Cart Routes
    Route::prefix('carts')->group(function () {
        Route::get('carts', [UserCartController::class, 'getUserActiveCart'])->name('carts');
        Route::post('carts/checkout', [UserCartController::class, 'checkOutActiveCart'])->name('carts.checkout');
        Route::post('carts/{product}', [UserCartController::class, 'addItemToCart'])->name('carts.addItem');
        Route::put('carts/items/{product}', [UserCartController::class, 'addItemToCart'])->name('carts.updateItem');
        Route::delete('carts/items/{product}', [UserCartController::class, 'removeItemToCart'])->name('carts.removeItem');
    });

    // User Orders Routes
    Route::get('orders', [UserOrderController::class, 'index'])->name('orders');
});

require __DIR__ . '/settings.php';
