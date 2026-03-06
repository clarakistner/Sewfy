<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UsuarioModulos;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Support\Facades\Auth as FacadesAuth;
use Laravel\Sanctum\Guard;
use App\Models\Modulo;

class UsuarioModulosController extends Controller
{
    public function getModulosUsuario(Request $request)
    {

        $abilities = $request->user()->currentAccessToken()->abilities;
        $ability = collect($abilities)->first(fn($a) => str_starts_with($a, 'empresa_'));
        $empresaId = str_replace('empresa_', '', $ability);

        $modulosUsuario = UsuarioModulos::where('USU_ID', $request->user()->USU_ID)
            ->where('EMP_ID', $empresaId)
            ->pluck('MOD_ID')->toArray();
        $nomesModulos = [];
        
        $nomesModulos = Modulo::whereIn('MOD_ID', $modulosUsuario)->pluck('MOD_NOME')->toArray();
        

        return response()->json(['modulos' => $nomesModulos]);
    }
}
