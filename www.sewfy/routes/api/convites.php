<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ConviteController;

Route::post('/auth/redefinir-senha', [ConviteController::class, 'redefinirSenha']);
Route::get('/convites/verificar', [ConviteController::class, 'verificar']);
Route::post('/convites/confirmar', [ConviteController::class, 'confirmar']);

Route::middleware(['auth:sanctum', 'impersonate'])->group(function () {
    Route::post('/convites', [ConviteController::class, 'store']);
    Route::post('/auth/trocar-email', [ConviteController::class, 'trocarEmail']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/adm/convites/owner', [ConviteController::class, 'storeOwner']);
    Route::post('/adm/convites/trocar-owner', [ConviteController::class, 'trocarOwner']);
});