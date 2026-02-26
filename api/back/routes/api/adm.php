<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Adm\AdmLoginController;

Route::post('/adm/login', [AdmLoginController::class, 'fazerLogin']);