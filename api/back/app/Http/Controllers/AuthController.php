<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\SewfyAdm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\EmpresaUsuarios;
use App\Models\Empresa;

session_start();
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

        if ($user->USU_ATIV === 0) {
            return response()->json(['erro' => 'Conta inativa'], 403);
        }

        $empresasUsuario = EmpresaUsuarios::where('USU_ID', $user->USU_ID)->get();

        $quantidadeEmpresas = $empresasUsuario->count();
        $empresasIds = Empresa::whereIn('EMP_ID', $empresasUsuario->pluck('EMP_ID'))->whereIn('EMP_ATIV', [1])->pluck('EMP_ID')->toArray();

        $abilities = array_map(fn($id) => "empresa_$id", $empresasIds);
        $user->tokens()->delete();
        $token = $user->createToken('user-token', $abilities)->plainTextToken;
        return response()->json([
            'token'   => $token,
            'nome'    => $user->USU_NOME,
            'isOwner' => $user->USU_IS_OWNER,
            'quantidade_empresas' => $quantidadeEmpresas,
            'empresas_ids' => $empresasIds,
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

        if ($adm->ADM_ATIV === 0) {
            return response()->json(['erro' => 'Conta inativa'], 403);
        }

        $_SESSION['adm_id'] = $adm->ADM_ID;
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
    public function defineEmpresaSelecionada(Request $request)
    {
        $request->validate([
            'empresa_id' => 'required|integer|exists:EMPRESAS,EMP_ID',
        ]);

        $empresaIdToken = "empresa_{$request->empresa_id}";
        if (!$request->user()->tokenCan($empresaIdToken)) {
            return response()->json(['erro' => 'Acesso negado para esta empresa'], 403);
        }
        $request->user()->currentAccessToken()->delete();
        $token = $request->user()->createToken('user-token', ['empresaId' => $empresaIdToken])->plainTextToken;

        return response()->json([
            'mensagem' => 'Empresa selecionada com sucesso',
            'token' => $token,
            'empresa_id' => $request->empresa_id
        ]);
    }
}
