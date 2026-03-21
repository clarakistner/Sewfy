<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Produto\ProdutoController;


// Rotas para Produtos
Route::middleware(['auth:sanctum', 'impersonate'])->group(function () {
    Route::get('/produtos', [ProdutoController::class, 'index']);
    Route::post('/produtos', [ProdutoController::class, 'store']);
    Route::get('/produtos/todos', [ProdutoController::class, 'todos']);
    Route::apiResource('produtos', ProdutoController::class);
    Route::get('/produtos/{id}', [ProdutoController::class, 'show']);
    Route::put('/produtos/{id}', [ProdutoController::class, 'update']);
});