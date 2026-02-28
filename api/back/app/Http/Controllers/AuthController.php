<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\SewfyAdm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // POST /api/auth/login - Login para usuários comuns
    public function loginUsuario(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'senha' => 'required|string',
        ]);

        $user = User::where('USU_EMAIL', $request->email)->first();

        if (!$user || !Hash::check($request->senha, $user->USU_SENHA)) {
            return response()->json(['erro' => 'Credenciais inválidas'], 401);
        }

        if (!$user->USU_ATIV) {
            return response()->json(['erro' => 'Conta inativa'], 403);
        }

        $token = $user->createToken('user-token')->plainTextToken;

        return response()->json([
            'token'   => $token,
            'nome'    => $user->USU_NOME,
            'isOwner' => $user->USU_IS_OWNER,
            'modulos' => $user->modulos->pluck('MOD_NOME')
        ]);
    }

    // POST /api/auth/adm/login - Login para administradores
    public function loginAdm(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'senha' => 'required|string',
        ]);

        $adm = SewfyAdm::where('ADM_EMAIL', $request->email)->first();

        if (!$adm || !Hash::check($request->senha, $adm->ADM_SENHA)) {
            return response()->json(['erro' => 'Credenciais inválidas'], 401);
        }

        if (!$adm->ADM_ATIV) {
            return response()->json(['erro' => 'Conta inativa'], 403);
        }

        $token = $adm->createToken('adm-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'email' => $adm->ADM_EMAIL
        ]);
    }

    // POST /api/auth/logout - Logout para ambos os tipos de usuários
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['mensagem' => 'Logout realizado com sucesso']);
    }
}