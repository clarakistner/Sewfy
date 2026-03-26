<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OPs\CriacaoOrdemDeProducaoController;
use App\Http\Controllers\OPs\ListarOrdensProducaoController;
use App\Http\Controllers\OPs\VisualizarOrdemProducaoController;
use App\Http\Controllers\OPs\EditarOrdemProducaoController;
use App\Http\Controllers\OPs\FecharOrdemProducaoController;

Route::middleware(['auth:sanctum'])->prefix('ordemdeproducao')->group(function () {
    Route::post('/criar', [CriacaoOrdemDeProducaoController::class, 'criarOP_OPIs']);
    Route::get('/listar', [ListarOrdensProducaoController::class, 'listarOPs']);
    Route::get('/detalhes/{id}', [VisualizarOrdemProducaoController::class, 'visualizarOP']);
    Route::put('/editar', [EditarOrdemProducaoController::class, 'editarOP']);
    Route::put('/fechar', [FecharOrdemProducaoController::class, 'fecharOP']);
});
