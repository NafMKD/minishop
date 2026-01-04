<?php

use App\Http\Controllers\Admin\CartController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
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

require __DIR__ . '/settings.php';
