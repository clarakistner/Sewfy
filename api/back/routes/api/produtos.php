<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Produto\ProdutoController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/produtos', [ProdutoController::class, 'index']);
    Route::post('/produtos', [ProdutoController::class, 'store']);
    Route::get('/produtos/{id}', [ProdutoController::class, 'show']);
    Route::put('/produtos/{id}', [ProdutoController::class, 'update']);
});