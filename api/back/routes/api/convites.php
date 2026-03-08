<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ConviteController;

// Confirmação pelo link do email (owner, funcionario, troca_owner, troca_email, redef_senha)
Route::post('/convites/confirmar', [ConviteController::class, 'confirmar']);

// Verificação do token
Route::get('/convites/verificar', [ConviteController::class, 'verificar']);

// Solicitação de redefinição de senha (iniciada no login)
Route::post('/auth/redefinir-senha', [ConviteController::class, 'redefinirSenha']);

// Rotas do admin Sewfy (auth:sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/adm/convites/owner', [ConviteController::class, 'storeOwner']);
    Route::post('/adm/convites/trocar-owner', [ConviteController::class, 'trocarOwner']);
});

// Rotas do owner/funcionário (auth:sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/convites', [ConviteController::class, 'store']);
    Route::post('/convites/trocar-email', [ConviteController::class, 'trocarEmail']);
});