<?php

use App\Http\Controllers\Contas\ContaPagarController;
use Illuminate\Support\Facades\Route;

Route::prefix('contas')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/{cp_id}', [ContaPagarController::class, 'mostrarConta']);
        Route::get('/listar', [ContaPagarController::class, 'listarContas']);
        Route::post('/criar', [ContaPagarController::class, 'criarConta']);
        Route::put('/atualizar-pagamento/{cp_id}', [ContaPagarController::class, 'atualizarDataPagamento']);
    });
});