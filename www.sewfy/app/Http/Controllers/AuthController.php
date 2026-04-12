<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\SewfyAdm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\EmpresaUsuarios;
use App\Models\Empresa;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;


class AuthController extends Controller
{
    // POST /api/auth/login - Login para usuários comuns
    public function loginUsuario(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'senha' => 'required|string',
        ]);
        if (!Auth::attempt([
            'USU_EMAIL' => $request->email,
            'password'  => $request->senha
        ])) {
            return response()->json(['status' => 'erro', 'resposta' => 'Credenciais inválidas'], 401);
        }
        $user = Auth::user();

        if ($user->USU_ATIV === 0) {
            return response()->json(['erro' => 'Conta inativa'], 403);
        }

        $empresasUsuario = EmpresaUsuarios::where('USU_ID', $user->USU_ID)->get();


        $empresasIds = Empresa::whereIn('EMP_ID', $empresasUsuario->pluck('EMP_ID'))->whereIn('EMP_ATIV', [1])->pluck('EMP_ID')->toArray();
        $quantidadeEmpresas = count($empresasIds);
        if (count($empresasIds) > 1) {
            $abilities = array_map(fn($id) => "empresas_$id", $empresasIds);
        } else {
            $abilities = array_map(fn($id) => "empresa_$id", $empresasIds);
        }
        $user->tokens()->delete();
        $token = $user->createToken('user-token', $abilities)->plainTextToken;
        return response()->json([
            'nome'    => $user->USU_NOME,
            'isOwner' => $user->USU_IS_OWNER,
            'empresas_ids' => $empresasIds,
            'quantidade_empresas' => $quantidadeEmpresas,
            'modulos' => $user->modulos->pluck('MOD_NOME')
        ])
            ->cookie('token', $token, 60 * 24 * 30, '/', null, null, false, true, 'lax')
            ->cookie('is_owner', $user->USU_IS_OWNER, 60 * 2, null, null, false, true, 'lax')
            ->cookie('modulos', implode(',', $user->modulos->pluck('MOD_NOME')->toArray()), 60 * 2, null, null, false, true, 'lax');
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


        $request->session()->put('adm_id', $adm->ADM_ID);
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

        $response = response()->json(['mensagem' => 'Logout realizado com sucesso'])
            ->withHeaders([
                'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
                'Pragma' => 'no-cache',
                'Expires' => 'Sat, 01 Jan 2000 00:00:00 GMT',
            ]);

        foreach ($request->cookies->all() as $nome => $valor) {
            $response = $response->withoutCookie($nome);
        }

        return $response;
    }
    public function defineEmpresaSelecionada(Request $request)
    {
        $request->validate([
            'empresa_id' => 'required|integer|exists:EMPRESAS,EMP_ID',
        ]);

        // Verifica se o usuário realmente pertence à empresa no banco
        $pertenceAEmpresa = EmpresaUsuarios::where('USU_ID', $request->user()->USU_ID)
            ->where('EMP_ID', $request->empresa_id)
            ->where('USU_ATIV', 1)
            ->exists();

        if (!$pertenceAEmpresa) {
            return response()->json(['erro' => 'Acesso negado para esta empresa'], 403);
        }

        $empresaIdToken = "empresa_{$request->empresa_id}";
        $request->user()->currentAccessToken()->delete();
        $token = $request->user()->createToken('user-token', [$empresaIdToken])->plainTextToken;
        return response()->json([
            'mensagem'   => 'Empresa selecionada com sucesso',
            'empresa_id' => $request->empresa_id,
            'token'      => $token
        ]);
    }
}
