<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OPs\CriacaoInsumoController;
use App\Http\Controllers\OPs\DeletarInsumoOrdemProducaoController;
use App\Http\Controllers\OPs\EditarInsumoOrdemProducaoController;

Route::prefix('insumos')->group(function () {
    Route::post('/criar', [CriacaoInsumoController::class, 'criarInsumo']);
    Route::put('/editar', [EditarInsumoOrdemProducaoController::class, 'editaOPIN']);
    Route::delete('/deletar', [DeletarInsumoOrdemProducaoController::class, 'deletaInsumo']);
});