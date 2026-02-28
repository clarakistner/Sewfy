<?php
use App\Models\User;
use Illuminate\Support\Facades\Route;

Route::get('/gerar-token-teste', function () {

    $user = User::first();

    if (!$user) {
        return response()->json([
            'message' => 'Nenhum usuário encontrado.'
        ], 404);
    }

    $token = $user->createToken('token-teste')->plainTextToken;

    return response()->json([
        'token' => $token
    ]);

});