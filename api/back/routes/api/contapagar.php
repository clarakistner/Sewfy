<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Contas\ContaPagarController;

Route::middleware(['auth:sanctum', 'impersonate'])->group(function () {
    Route::get('/contas-pagar',      [ContaPagarController::class, 'listarContas']);
    Route::get('/contas-pagar/{id}', [ContaPagarController::class, 'mostrarConta']);
});