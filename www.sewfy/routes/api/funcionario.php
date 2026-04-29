<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FuncionarioController;

Route::middleware(['auth:sanctum', 'impersonate'])->group(function () {
    Route::get('/funcionario/owner/empresas', [FuncionarioController::class, 'outrasEmpresasOwner']);
    Route::get('/empresa/{id}/modulos', [FuncionarioController::class, 'modulosPorEmpresa']);
});