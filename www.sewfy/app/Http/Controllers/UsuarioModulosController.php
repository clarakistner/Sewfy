<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UsuarioModulos;
use App\Models\Modulo;
use App\Models\SewfyAdm;

class UsuarioModulosController extends Controller
{
    // GET /api/usuario/modulos
    public function getModulosUsuario(Request $request)
    {
        $user = $request->user();

        // Se for adm impersonando, retorna todos os módulos da empresa
        if ($user instanceof SewfyAdm) {
            $empresa = $request->empresa;
            $modulos = $empresa->modulos;
            return response()->json([
                'modulos'    => $modulos->pluck('MOD_NOME')->toArray(),
                'idsModulos' => $modulos->pluck('MOD_ID')->toArray(),
            ]);
        }

        // Fluxo normal do usuário
        $empresaId = $request->empresa->EMP_ID;

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