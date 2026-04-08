<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmpresaUsuariosController;

// Rotas para Empresa-Usuários
Route::middleware(['auth:sanctum', 'impersonate'])->group(function () {
    Route::get('/empresa-usuario/ehproprietario', [EmpresaUsuariosController::class, 'usuarioEhProprietario']);
    Route::get('/empresa-usuarios/funcionarios', [EmpresaUsuariosController::class, 'buscaFuncionariosEmpresa']);
    Route::get('/empresa-usuario/{id}', [EmpresaUsuariosController::class, 'buscaFuncionario']);
    Route::put('/empresa-usuario/{id}', [EmpresaUsuariosController::class, 'atualizarFuncionario']);
    
});
Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('/empresa-usuario/usuario/empresas', [EmpresaUsuariosController::class, 'getEmpresasUsuario']);
});