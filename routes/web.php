<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\StorefrontController;
use Illuminate\Support\Facades\Route;

// Storefront routes (public)
Route::get('/', [StorefrontController::class, 'index'])->name('home');
Route::get('/products', [StorefrontController::class, 'products'])->name('products.index');
Route::get('/products/{product:slug}', [StorefrontController::class, 'productDetail'])->name('products.show');
Route::get('/category/{category:slug}', [StorefrontController::class, 'category'])->name('categories.show');

// Cart routes
Route::prefix('cart')->name('cart.')->group(function () {
    Route::get('/', [CartController::class, 'index'])->name('index');
    Route::post('/add', [CartController::class, 'add'])->name('add');
    Route::patch('/{cartItem}', [CartController::class, 'update'])->name('update');
    Route::delete('/{cartItem}', [CartController::class, 'remove'])->name('remove');
    Route::delete('/', [CartController::class, 'clear'])->name('clear');
    Route::get('/count', [CartController::class, 'count'])->name('count');
});

// Checkout routes
Route::prefix('checkout')->name('checkout.')->group(function () {
    Route::get('/', [App\Http\Controllers\CheckoutController::class, 'create'])->name('create');
    Route::get('/product/{product}', [App\Http\Controllers\CheckoutController::class, 'createFromProduct'])->name('product');
    Route::post('/', [App\Http\Controllers\CheckoutController::class, 'store'])->name('store');
    Route::get('/success/{order}', [App\Http\Controllers\CheckoutController::class, 'success'])->name('success');
});

// Order tracking routes (public)
Route::prefix('orders')->name('orders.')->group(function () {
    Route::get('/track', [App\Http\Controllers\Storefront\OrderController::class, 'trackForm'])->name('track');
    Route::post('/track', [App\Http\Controllers\Storefront\OrderController::class, 'track'])->name('track.submit');
    Route::get('/{orderNumber}', [App\Http\Controllers\Storefront\OrderController::class, 'show'])->name('show');
});

// Authenticated user orders
Route::middleware(['auth'])->group(function () {
    Route::get('/my-orders', [App\Http\Controllers\Storefront\OrderController::class, 'myOrders'])->name('orders.my');
});

// Redirect /register to home page
Route::get('/register', function () {
    return redirect()->route('home');
});

require __DIR__.'/admin.php';
require __DIR__.'/settings.php';
