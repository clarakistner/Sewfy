<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\EmpresaUsuarios;
use App\Models\SewfyAdm;

class EmpresaUsuariosController extends Controller
{
    public function usuarioEhProprietario(Request $request)
    {
        $user = $request->user();

        // Se for adm impersonando, sempre é proprietário
        if ($user instanceof SewfyAdm) {
            return response()->json(['proprietario' => true]);
        }

        // Fluxo normal do usuário
        $abilities = $user->currentAccessToken()->abilities;
        $ability   = collect($abilities)->first(fn($a) => str_starts_with($a, 'empresa_'));
        $empresaId = str_replace('empresa_', '', $ability);
        $userId    = $user->USU_ID;

        $empresaUsuario = EmpresaUsuarios::where('EMP_ID', $empresaId)
            ->where('USU_ID', $userId)
            ->first();

        if (!$empresaUsuario) {
            return response()->json(['erro' => 'Vínculo não encontrado'], 404);
        }

        if ($empresaUsuario->USU_ATIV === 0) {
            return response()->json(['erro' => 'Usuário inativo na empresa'], 403);
        }

        $ehProprietario = $empresaUsuario->USU_E_PROPRIETARIO === 1;
        return response()->json(['proprietario' => $ehProprietario]);
    }

    public function buscaFuncionariosEmpresa(Request $request)
    {
        $user = $request->user();
        $abilities = $user->currentAccessToken()->abilities;
        $ability   = collect($abilities)->first(fn($a) => str_starts_with($a, 'empresa_'));
        $empresaId = str_replace('empresa_', '', $ability);

        $listaFuncionarios = User::whereIn(
            'USU_ID',
            EmpresaUsuarios::where('EMP_ID', $empresaId)
                ->where('USU_ID', '!=', $user->USU_ID)
                ->pluck('USU_ID')
        )->select('USU_NOME', 'USU_EMAIL', 'USU_NUM', 'USU_ATIV', 'USU_ID')
        ->get();

        return response()->json([
            'funcionarios'=> $listaFuncionarios,
        ]);
    }
}
