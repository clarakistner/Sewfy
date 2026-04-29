<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OPs\CriacaoOrdemDeProducaoController;
use App\Http\Controllers\OPs\ListarOrdensProducaoController;
use App\Http\Controllers\OPs\VisualizarOrdemProducaoController;
use App\Http\Controllers\OPs\EditarOrdemProducaoController;
use App\Http\Controllers\OPs\FecharOrdemProducaoController;
use App\Http\Controllers\OPs\GerarGuiasImpressaoController;

Route::middleware(['auth:sanctum', 'impersonate'])->prefix('ordemdeproducao')->group(function () {
    Route::post('/criar', [CriacaoOrdemDeProducaoController::class, 'criarOP_OPIs']);
    Route::get('/listar', [ListarOrdensProducaoController::class, 'listarOPs']);
    Route::get('/detalhes/{id}', [VisualizarOrdemProducaoController::class, 'visualizarOP']);
    Route::put('/editar', [EditarOrdemProducaoController::class, 'editarOP']);
    Route::put('/fechar', [FecharOrdemProducaoController::class, 'fecharOP']);
    Route::post('/guias', [GerarGuiasImpressaoController::class, 'gerarGuias']);
});

// Rota de impressão sem middleware auth:sanctum — autenticação feita via token na query string
Route::get('/ordemdeproducao/guias/imprimir', [GerarGuiasImpressaoController::class, 'imprimirGuias']);