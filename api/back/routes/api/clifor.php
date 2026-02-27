<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClienteFornecedor\ClienteFornecedorController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/clifor', [ClienteFornecedorController::class, 'index']);
    Route::post('/clifor', [ClienteFornecedorController::class, 'store']);
    Route::get('/clifor/{id}', [ClienteFornecedorController::class, 'show']);
    Route::put('/clifor/{id}', [ClienteFornecedorController::class, 'update']);
});