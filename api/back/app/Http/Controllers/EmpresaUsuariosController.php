<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\EmpresaUsuarios;
class EmpresaUsuariosController extends Controller
{
 public function usuarioEhProprietario(Request $request)
    {
        $user = $request->user();
        $abilities = $user->currentAccessToken()->abilities;
        $ability = collect($abilities)->first(fn($a) => str_starts_with($a, 'empresa_'));
        $empresaId = str_replace('empresa_', '', $ability);
        $userId = $user->USU_ID;
        $empresaUsuario = EmpresaUsuarios::where('EMP_ID', $empresaId)
            ->where('USU_ID', $userId)
            ->first();
        if($empresaUsuario->UU_ATIV === 0){
            return json_encode(['error' => 'Usuário inativo na empresa.'], 403);
        }

        $ehProprietario = $empresaUsuario && $empresaUsuario->USU_E_PROPRIETARIO === 1;
        return response()->json(['proprietario' => $ehProprietario]);
    }
}
