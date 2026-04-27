<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClienteFornecedor\ClienteFornecedorController;

// Rotas para Cliente/Fornecedor
Route::middleware(['auth:sanctum', 'impersonate'])->group(function () {
    Route::get('/clifor/todos',        [ClienteFornecedorController::class, 'todos']);
    Route::get('/clifor/fornecedores', [ClienteFornecedorController::class, 'fornecedores']);
    Route::get('/clifor',              [ClienteFornecedorController::class, 'index']);
    Route::post('/clifor',             [ClienteFornecedorController::class, 'store']);
    Route::get('/clifor/{id}',         [ClienteFornecedorController::class, 'show']);
    Route::put('/clifor/{id}',         [ClienteFornecedorController::class, 'update']);
});