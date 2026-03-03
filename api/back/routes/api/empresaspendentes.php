<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Adm\EmpresaPendenteController;

Route::prefix('adm')->group(function () {
    Route::get('/empresaspendentes', [EmpresaPendenteController::class, 'index']);
    Route::post('/empresaspendentes/criar', [EmpresaPendenteController::class, 'store']);
});