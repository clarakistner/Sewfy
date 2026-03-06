<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SewfyAdmController;

Route::middleware('auth:sanctum')->prefix('adm')->group(function () {
    Route::get('/sewfyadm', [SewfyAdmController::class, 'index']);
    Route::post('/sewfyadm', [SewfyAdmController::class, 'store']);
});
