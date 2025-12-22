<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Redirect /register to home page
Route::get('/register', function () {
    return redirect()->route('home');
});

require __DIR__.'/admin.php';
require __DIR__.'/settings.php';
