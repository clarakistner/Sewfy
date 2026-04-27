<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Contas\ContaPagarController;

Route::middleware(['auth:sanctum', 'impersonate'])->group(function () {
    Route::get('/contas-pagar',      [ContaPagarController::class, 'listarContas']);
    Route::get('/contas-pagar/{id}', [ContaPagarController::class, 'mostrarConta']);
    Route::post('/contas-pagar',     [ContaPagarController::class, 'criarConta']);
    Route::put('/contas-pagar/{id}', [ContaPagarController::class, 'atualizarConta']);
});