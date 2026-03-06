<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioModulosController;  

Route::middleware('auth:sanctum')->get('/modulos-usuario', [UsuarioModulosController::class, 'getModulosUsuario']);