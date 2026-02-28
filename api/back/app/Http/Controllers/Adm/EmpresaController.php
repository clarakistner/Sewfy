<?php

namespace App\Http\Controllers\Adm;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use Illuminate\Http\Request;

class EmpresaController extends Controller
{
    // GET /api/adm/empresas - Listar todas as empresas
    public function index()
    {
        $empresas = Empresa::all()->map(function($e) {
            return [
                'id'    => $e->EMP_ID,
                'nome'  => $e->EMP_NOME,
                'cnpj'  => $e->EMP_CNPJ,
                'email' => $e->EMP_EMAIL,
                'ativo' => $e->EMP_ATIV
            ];
        });

        return response()->json($empresas);
    }

    // GET /api/adm/empresas/{id} - Detalhes de uma empresa
    public function show(int $id)
    {
        $empresa = Empresa::with('modulos')->findOrFail($id);

        return response()->json([
            'id'      => $empresa->EMP_ID,
            'nome'    => $empresa->EMP_NOME,
            'raz'     => $empresa->EMP_RAZ,
            'cnpj'    => $empresa->EMP_CNPJ,
            'email'   => $empresa->EMP_EMAIL,
            'num'     => $empresa->EMP_NUM,
            'ativo'   => $empresa->EMP_ATIV,
            'modulos' => $empresa->modulos->pluck('MOD_NOME')
        ]);
    }

    // PUT /api/adm/empresas/{id} - Atualizar uma empresa
    public function update(Request $request, int $id)
    {
        $request->validate([
            'EMP_NOME'  => 'required|string|max:150',
            'EMP_RAZ'   => 'required|string|max:150',
            'EMP_EMAIL' => 'required|email|max:150',
            'EMP_NUM'   => 'nullable|string|max:20',
            'EMP_ATIV'  => 'required|boolean'
        ]);

        $empresa = Empresa::findOrFail($id);

        $empresa->update([
            'EMP_NOME'  => trim($request->EMP_NOME),
            'EMP_RAZ'   => trim($request->EMP_RAZ),
            'EMP_EMAIL' => trim($request->EMP_EMAIL),
            'EMP_NUM'   => $request->EMP_NUM ?? null,
            'EMP_ATIV'  => $request->EMP_ATIV
        ]);

        return response()->json(['mensagem' => 'Empresa atualizada com sucesso']);
    }
}