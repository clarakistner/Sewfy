<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeConfigController;

Route::middleware(['auth:sanctum', 'impersonate'])->group(function () {
    Route::get('/home/config', [HomeConfigController::class, 'show']);
    Route::put('/home/config', [HomeConfigController::class, 'update']);
});