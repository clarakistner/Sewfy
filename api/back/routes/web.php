<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ConviteController;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/confirmar-email',  function (){
    
    return view('confirmar-email');
});