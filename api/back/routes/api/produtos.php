<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Produtos\CadastroProdutoController;
use App\Http\Controllers\Produtos\EditarProdutoController;
use App\Http\Controllers\Produtos\ListarProdutosController;
use App\Http\Controllers\Produtos\VisualizarProdutoController;

Route::prefix('produtos')->group(function () {
    Route::get('/', [ListarProdutosController::class, 'listar']);
    Route::post('/', [CadastroProdutoController::class, 'cadastrarProduto']);
    Route::get('/{id}', [VisualizarProdutoController::class, 'visualizar']);
    Route::put('/{id}', [EditarProdutoController::class, 'editarProduto']);
});