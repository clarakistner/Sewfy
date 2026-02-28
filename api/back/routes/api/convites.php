<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ConviteController;

// rotas do admin Sewfy
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/adm/convites/owner', [ConviteController::class, 'storeOwner']);
});

// rotas do owner/funcionário
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/convites', [ConviteController::class, 'store']);
});

// rota pública — confirmação pelo link do email
Route::post('/convites/confirmar', [ConviteController::class, 'confirmar']);