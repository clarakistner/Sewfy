<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Adm\EmpresaPendenteController;

Route::middleware('auth:sanctum')->prefix('adm')->group(function () {
    Route::get('/empresaspendentes', [EmpresaPendenteController::class, 'index']);
    Route::post('/empresaspendentes/criar', [EmpresaPendenteController::class, 'store']);
    Route::get('/empresaspendentes/{id}', [EmpresaPendenteController::class, 'show']);
    Route::delete('/empresaspendentes/{id}', [EmpresaPendenteController::class, 'destroy']);
});