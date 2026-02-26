<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OPs\CriacaoOrdemDeProducaoController;
use App\Http\Controllers\OPs\ListarOrdensProducaoController;
use App\Http\Controllers\OPs\VisualizarOrdemProducaoController;
use App\Http\Controllers\OPs\EditarOrdemProducaoController;

Route::prefix('ordemdeproducao')->group(function () {
    Route::post('/criar', [CriacaoOrdemDeProducaoController::class, 'criarOP_OPIs']);
    Route::get('/listar', [ListarOrdensProducaoController::class, 'listarOPs']);
    Route::get('/detalhes/{id}', [VisualizarOrdemProducaoController::class, 'visualizarOP']);
    Route::put('/editar', [EditarOrdemProducaoController::class, 'editarOP']);
});