<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Adm\EmpresaController;

// rotas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/adm/empresas', [EmpresaController::class, 'index']);
    Route::get('/adm/empresas/{id}', [EmpresaController::class, 'show']);
    Route::put('/adm/empresas/{id}', [EmpresaController::class, 'update']);
});