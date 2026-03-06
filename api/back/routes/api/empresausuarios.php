<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmpresaUsuariosController;

Route::middleware('auth:sanctum')->get('/empresa-usuario/ehproprietario', [EmpresaUsuariosController::class, 'usuarioEhProprietario']);