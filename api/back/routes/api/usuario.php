<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;

Route::middleware('auth:sanctum')->group(function() {
    Route::get('/funcionario/{id}', [UsuarioController::class, 'retornaFuncionario']);
    Route::get('/funcionario/owner/resgatar',[UsuarioController::class,'retornaOwner']);
    Route::put('/funcionario/owner/editar',[UsuarioController::class,'editarOwner']);
    Route::put('/funcionario/editar/{id}', [UsuarioController::class, 'editarFuncionario']);
});