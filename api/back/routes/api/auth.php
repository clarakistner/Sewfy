<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/auth/login', [AuthController::class, 'loginUsuario']);
Route::post('/auth/adm/login', [AuthController::class, 'loginAdm']);
Route::middleware('auth:sanctum')->post('/auth/logout', [AuthController::class, 'logout']);