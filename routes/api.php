<?php

use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BillingController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\OperationController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/health', HealthController::class);

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:login');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/seed-demo', \App\Http\Controllers\Api\SeedDemoController::class);
    Route::get('/me', [AuthController::class, 'me']);
    Route::match(['put', 'patch'], '/me', [AuthController::class, 'updateProfile']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard/summary', [DashboardController::class, 'summary']);

    Route::get('/activity-logs', [ActivityLogController::class, 'index']);

    Route::get('/clients', [ClientController::class, 'index']);
    Route::get('/clients/{client}', [ClientController::class, 'show']);
    Route::match(['put', 'patch'], '/clients/{client}', [ClientController::class, 'update']);
    Route::delete('/clients/{client}', [ClientController::class, 'destroy']);
    Route::post('/clients', [ClientController::class, 'store'])->middleware('plan:create-client');
    Route::post('/clients/{id}/restore', [ClientController::class, 'restore']);

    Route::apiResource('services', ServiceController::class);
    Route::post('/services/{id}/restore', [ServiceController::class, 'restore']);

    Route::get('/operations', [OperationController::class, 'index']);
    Route::get('/operations/{operation}', [OperationController::class, 'show']);
    Route::delete('/operations/{operation}', [OperationController::class, 'destroy']);
    Route::post('/operations', [OperationController::class, 'store'])->middleware('plan:create-operation');
    Route::post('/operations/{id}/restore', [OperationController::class, 'restore']);

    Route::get('/billing/usage', [BillingController::class, 'usage']);
    Route::middleware('role:admin')->post('/billing/plan', [BillingController::class, 'setPlan']);

    Route::middleware('role:admin')->apiResource('users', UserController::class);
});
