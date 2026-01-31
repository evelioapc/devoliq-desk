<?php

use App\Http\Controllers\Web\ActivityLogPageController;
use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\BillingPageController;
use App\Http\Controllers\Web\ClientPageController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\OperationPageController;
use App\Http\Controllers\Web\ServicePageController;
use App\Http\Controllers\Web\UserPageController;
use Illuminate\Support\Facades\Route;

Route::get('/locale/{locale}', \App\Http\Controllers\Web\LocaleController::class)->name('locale.set');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

Route::middleware('auth')->group(function () {
    Route::get('/', DashboardController::class)->name('dashboard');
    Route::get('/settings', \App\Http\Controllers\Web\SettingsPageController::class)->name('settings.index');
    Route::get('/support', \App\Http\Controllers\Web\SupportPageController::class)->name('support.index');
    Route::get('/clients', ClientPageController::class)->name('clients.index');
    Route::get('/services', ServicePageController::class)->name('services.index');
    Route::get('/operations', OperationPageController::class)->name('operations.index');
    Route::get('/activity-logs', ActivityLogPageController::class)->name('activity-logs.index');

    Route::middleware('role:admin')->group(function () {
        Route::get('/users', UserPageController::class)->name('users.index');
        Route::get('/billing', BillingPageController::class)->name('billing.index');
    });
});
