<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FuncionarioController;


// Rotas para Funcionario
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/funcionario/owner/empresas', [FuncionarioController::class, 'outrasEmpresasOwner']);
    Route::get('/empresa/{id}/modulos', [FuncionarioController::class, 'modulosPorEmpresa']);
});