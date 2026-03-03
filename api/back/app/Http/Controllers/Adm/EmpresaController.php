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
        $empresas = Empresa::with('modulos')->get()->map(function($e) {
            return [
                'id'      => $e->EMP_ID,
                'nome'    => $e->EMP_NOME,
                'raz'     => $e->EMP_RAZ,
                'cnpj'    => $e->EMP_CNPJ,
                'email'   => $e->EMP_EMAIL,
                'num'     => $e->EMP_NUM,
                'ativo'   => $e->EMP_ATIV,
                'modulos' => $e->modulos->pluck('MOD_NOME')
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

    // POST /api/adm/empresas/criar - Criar uma nova empresa
    public function store(Request $request)
    {
        $request->validate([
            'EMP_NOME'  => 'required|string|max:150',
            'EMP_RAZ'   => 'required|string|max:150',
            'EMP_CNPJ'  => 'required|string|max:14|unique:EMPRESAS,EMP_CNPJ',
            'EMP_EMAIL' => 'required|email|max:150|unique:EMPRESAS,EMP_EMAIL',
            'EMP_NUM'   => 'nullable|string|max:20',
            'ADM_ID'    => 'required|integer|exists:SEWFY_ADMS,ADM_ID',
            'modulos'   => 'nullable|array',
            'modulos.*' => 'integer|exists:MODULOS,MOD_ID',
        ]);

        $empresa = Empresa::create([
            'EMP_NOME'  => trim($request->EMP_NOME),
            'EMP_RAZ'   => trim($request->EMP_RAZ),
            'EMP_CNPJ'  => trim($request->EMP_CNPJ),
            'EMP_EMAIL' => trim($request->EMP_EMAIL),
            'EMP_NUM'   => $request->EMP_NUM ?? null,
            'EMP_ATIV'  => 1,
            'ADM_ID'    => $request->ADM_ID,
        ]);

        if ($request->filled('modulos')) {
            $empresa->modulos()->attach($request->modulos);
        }

        return response()->json([
            'mensagem' => 'Empresa criada com sucesso',
            'id'       => $empresa->EMP_ID
        ], 201);
    }

    // PUT /api/adm/empresas/{id} - Atualizar dados de uma empresa
    public function update(Request $request, int $id)
    {
        $request->validate([
            'EMP_NOME'  => 'required|string|max:150',
            'EMP_RAZ'   => 'required|string|max:150',
            'EMP_CNPJ'  => 'required|string|max:14|unique:EMPRESAS,EMP_CNPJ,' . $id . ',EMP_ID',
            'EMP_EMAIL' => 'required|email|max:150|unique:EMPRESAS,EMP_EMAIL,' . $id . ',EMP_ID',
            'EMP_NUM'   => 'nullable|string|max:20',
            'EMP_ATIV'  => 'required|boolean',
            'modulos'   => 'nullable|array',
            'modulos.*' => 'integer|exists:MODULOS,MOD_ID',
        ]);

        $empresa = Empresa::findOrFail($id);

        $empresa->update([
            'EMP_NOME'  => trim($request->EMP_NOME),
            'EMP_RAZ'   => trim($request->EMP_RAZ),
            'EMP_CNPJ'  => trim($request->EMP_CNPJ),
            'EMP_EMAIL' => trim($request->EMP_EMAIL),
            'EMP_NUM'   => $request->EMP_NUM ?? null,
            'EMP_ATIV'  => $request->EMP_ATIV,
        ]);

        if ($request->has('modulos')) {
            $empresa->modulos()->sync($request->modulos ?? []);
        }

        return response()->json(['mensagem' => 'Empresa atualizada com sucesso']);
    }
}