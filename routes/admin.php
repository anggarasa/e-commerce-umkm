<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OrderController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('categories', CategoryController::class)->except(['show']);
    Route::resource('products', \App\Http\Controllers\Admin\ProductController::class);
    Route::resource('orders', OrderController::class)->only(['index', 'show', 'update']);
    Route::post('orders/{order}/approve-cancellation', [OrderController::class, 'approveCancellation'])->name('orders.approve-cancellation');
    Route::post('orders/{order}/reject-cancellation', [OrderController::class, 'rejectCancellation'])->name('orders.reject-cancellation');

    // Reports
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\ReportController::class, 'index'])->name('index');
        Route::get('/export', [\App\Http\Controllers\Admin\ReportController::class, 'export'])->name('export');
    });

    Route::get('settings', [\App\Http\Controllers\Admin\SettingController::class, 'index'])->name('settings.index');
    Route::put('settings', [\App\Http\Controllers\Admin\SettingController::class, 'update'])->name('settings.update');
});
