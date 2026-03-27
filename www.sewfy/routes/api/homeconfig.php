<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeConfigController;

// Rotas para HomeConfig
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/home/config', [HomeConfigController::class, 'show']);
    Route::put('/home/config', [HomeConfigController::class, 'update']);
});