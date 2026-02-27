<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Auth\Factory;

class AuthController extends Controller
{
    // Registra um novo usuário após validar os dados recebidos
    public function register()
    {
        $validator = Validator::make(request()->all(), [
            'name'     => 'required',
            'email'    => 'required|email|unique:users',
            'password' => 'required|confirmed|min:8',
        ]);

        // Retorna os erros de validação caso existam
        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        // Cria e salva o novo usuário
        $user           = new User;
        $user->name     = request()->name;
        $user->email    = request()->email;
        $user->password = request()->password;
        $user->save();

        return response()->json($user, 201);
    }

    // Autentica o usuário e retorna um token JWT
    public function login()
    {
        $credencials = request(['email', 'password']);

        // Retorna erro 401 caso as credenciais sejam inválidas
        if (!$token = auth()->attempt($credencials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    // Retorna os dados do usuário autenticado
    public function me()
    {
        return response()->json(auth()->user());
    }

    // Invalida o token e encerra a sessão do usuário
    public function logout()
    {
        auth()->logout();
        return response()->json(['message' => 'Successfully logged out']);
    }

    // Gera um novo token para o usuário autenticado
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    // Formata e retorna a resposta com o token JWT
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => auth()->factory()->getTTL() * 60
        ]);
    }
}
