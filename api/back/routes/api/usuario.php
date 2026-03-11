<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;

Route::middleware('auth:sanctum')->group(function() {
    Route::get('/funcionario/{id}', [UsuarioController::class, 'retornaFuncionario']);
    Route::put('/funcionario/editar/{id}', [UsuarioController::class, 'editarFuncionario']);
});