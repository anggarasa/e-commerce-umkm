<?php

use App\Http\Controllers\StorefrontController;
use Illuminate\Support\Facades\Route;

// Storefront routes (public)
Route::get('/', [StorefrontController::class, 'index'])->name('home');
Route::get('/products', [StorefrontController::class, 'products'])->name('products.index');
Route::get('/products/{product:slug}', [StorefrontController::class, 'productDetail'])->name('products.show');
Route::get('/category/{category:slug}', [StorefrontController::class, 'category'])->name('categories.show');

// Redirect /register to home page
Route::get('/register', function () {
    return redirect()->route('home');
});

require __DIR__.'/admin.php';
require __DIR__.'/settings.php';
