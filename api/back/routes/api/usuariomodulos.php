<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioModulosController;

Route::middleware(['auth:sanctum', 'impersonate'])->group(function () {
    Route::get('/modulos-usuario', [UsuarioModulosController::class, 'getModulosUsuario']);
});