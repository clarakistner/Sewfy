<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmpresaUsuariosController;

Route::middleware(['auth:sanctum', 'impersonate'])->group(function () {
    Route::get('/empresa-usuario/ehproprietario', [EmpresaUsuariosController::class, 'usuarioEhProprietario']);
    Route::get('/empresa-usuarios/funcionarios', [EmpresaUsuariosController::class, 'buscaFuncionariosEmpresa']);
});