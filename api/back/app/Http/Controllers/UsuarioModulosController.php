<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UsuarioModulos;
use App\Models\Modulo;
use App\Models\SewfyAdm;

class UsuarioModulosController extends Controller
{
    public function getModulosUsuario(Request $request)
    {
        $user = $request->user();

        // Se for adm impersonando, retorna todos os módulos da empresa
        if ($user instanceof SewfyAdm) {
            $empresa   = $request->empresa;
            $modulos   = $empresa->modulos->pluck('MOD_NOME')->toArray();
            return response()->json(['modulos' => $modulos]);
        }

        // Fluxo normal do usuário
        $abilities = $user->currentAccessToken()->abilities;
        $ability   = collect($abilities)->first(fn($a) => str_starts_with($a, 'empresa_'));
        $empresaId = str_replace('empresa_', '', $ability);

        $modulosUsuario = UsuarioModulos::where('USU_ID', $user->USU_ID)
            ->where('EMP_ID', $empresaId)
            ->pluck('MOD_ID')
            ->toArray();

        $nomesModulos = Modulo::whereIn('MOD_ID', $modulosUsuario)
            ->pluck('MOD_NOME')
            ->toArray();

        return response()->json(['modulos' => $nomesModulos]);
    }
}