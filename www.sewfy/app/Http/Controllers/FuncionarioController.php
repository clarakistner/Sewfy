<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FuncionarioController extends Controller
{
    // GET /api/funcionario/owner/empresas
    public function outrasEmpresasOwner(Request $request)
    {
        $empresaAtualId = $request->empresa->EMP_ID;

        $empresas = DB::table('EMPRESA_USUARIOS')
            ->join('EMPRESAS', 'EMPRESA_USUARIOS.EMP_ID', '=', 'EMPRESAS.EMP_ID')
            ->where('EMPRESA_USUARIOS.USU_ID', $request->user()->USU_ID)
            ->where('EMPRESA_USUARIOS.USU_E_PROPRIETARIO', 1)
            ->where('EMPRESA_USUARIOS.EMP_ID', '!=', $empresaAtualId)
            ->where('EMPRESAS.EMP_ATIV', 1)
            ->select('EMPRESAS.EMP_ID', 'EMPRESAS.EMP_NOME')
            ->get();

        return response()->json(['empresas' => $empresas]);
    }

    // GET /api/empresa/{id}/modulos
    public function modulosPorEmpresa(Request $request, int $id)
    {
        $eProprietario = DB::table('EMPRESA_USUARIOS')
            ->where('EMP_ID', $id)
            ->where('USU_ID', $request->user()->USU_ID)
            ->where('USU_E_PROPRIETARIO', 1)
            ->exists();

        if (!$eProprietario) {
            return response()->json(['erro' => 'Acesso negado'], 403);
        }

        $modulos = DB::table('EMPRESA_MODULOS')
            ->join('MODULOS', 'EMPRESA_MODULOS.MOD_ID', '=', 'MODULOS.MOD_ID')
            ->where('EMPRESA_MODULOS.EMP_ID', $id)
            ->select('MODULOS.MOD_ID', 'MODULOS.MOD_NOME')
            ->get();

        return response()->json(['modulos' => $modulos]);
    }
}