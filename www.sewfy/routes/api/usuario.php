<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;

Route::middleware(['auth:sanctum', 'impersonate'])->group(function () {
    Route::get('/usuario/owner', [UsuarioController::class, 'retornaOwner']);
    Route::put('/usuario/owner', [UsuarioController::class, 'editarOwner']);
    Route::get('/usuario/{id}', [UsuarioController::class, 'retornaFuncionario']);
    Route::put('/usuario/{id}', [UsuarioController::class, 'editarFuncionario']);
});