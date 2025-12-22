<?php

use App\Http\Controllers\Admin\CategoryController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', fn () => Inertia::render('admin/dashboard'))->name('dashboard');
    Route::resource('categories', CategoryController::class);
});
