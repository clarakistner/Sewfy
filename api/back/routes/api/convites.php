<?php

use App\Http\Controllers\ConviteController;
use Illuminate\Support\Facades\Route;

Route::prefix('convites')->group(function () {

    Route::get('/validar/{token}', [ConviteController::class, 'validar']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/{idEmp}', [ConviteController::class, 'index']);
        Route::post('/', [ConviteController::class, 'store']);
        Route::get('/{idConvite}/{idEmp}', [ConviteController::class, 'show']);
    });
});
