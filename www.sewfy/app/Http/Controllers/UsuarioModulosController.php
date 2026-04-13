<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UsuarioModulos;
use App\Models\Modulo;
use App\Models\SewfyAdm;

class UsuarioModulosController extends Controller
{
    // GET /api/usuario/modulos - Retornar os módulos disponíveis para o usuário logado
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

       $resultado = UsuarioModulos::join('MODULOS', 'USUARIO_MODULOS.MOD_ID', '=', 'MODULOS.MOD_ID')
            ->where('USUARIO_MODULOS.USU_ID', $user->USU_ID)
            ->where('USUARIO_MODULOS.EMP_ID', $empresaId)
            ->select('MODULOS.MOD_ID', 'MODULOS.MOD_NOME')
            ->get();

        return response()->json([
            'modulos'    => $resultado->pluck('MOD_NOME')->toArray(),
            'idsModulos' => $resultado->pluck('MOD_ID')->toArray(),
        ]);
    }
}
