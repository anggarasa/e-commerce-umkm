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

    // Notifications
    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\AdminNotificationController::class, 'index'])->name('index');
        Route::get('/count', [\App\Http\Controllers\Admin\AdminNotificationController::class, 'count'])->name('count');
        Route::post('/{notification}/read', [\App\Http\Controllers\Admin\AdminNotificationController::class, 'markAsRead'])->name('mark-read');
        Route::post('/read-all', [\App\Http\Controllers\Admin\AdminNotificationController::class, 'markAllAsRead'])->name('mark-all-read');
    });

    // CMS
    Route::prefix('cms')->name('cms.')->group(function () {
        Route::get('/homepage', [\App\Http\Controllers\Admin\CMSController::class, 'homepage'])->name('homepage');
        Route::put('/homepage', [\App\Http\Controllers\Admin\CMSController::class, 'updateHomepage'])->name('homepage.update');
        Route::get('/about-us', [\App\Http\Controllers\Admin\CMSController::class, 'aboutUs'])->name('about-us');
        Route::put('/about-us', [\App\Http\Controllers\Admin\CMSController::class, 'updateAboutUs'])->name('about-us.update');
    });
});
