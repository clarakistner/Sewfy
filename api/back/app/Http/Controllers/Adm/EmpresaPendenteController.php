<?php

namespace App\Http\Controllers\Adm;
use App\Http\Controllers\Controller;
use App\Models\EmpresaPendente;
use Illuminate\Http\Request;
session_start();
class EmpresaPendenteController extends Controller
{
    // GET /api/adm/empresaspendentes - Listar todas as empresas pendentes
    public function index()
    {
        $empresas = EmpresaPendente::with('modulos')->get()->map(function($e) {
            return [
                'id'      => $e->EMPP_ID,
                'nome'    => $e->EMPP_NOME,
                'raz'     => $e->EMPP_RAZ,
                'cnpj'    => $e->EMPP_CNPJ,
                'email'   => $e->EMPP_EMAIL,
                'num'     => $e->EMPP_NUM,
                'modulos' => $e->modulos->pluck('MOD_NOME')
            ];
        });

        return response()->json($empresas);
    }

    // GET /api/adm/empresaspendentes/{id} - Detalhes de uma empresa pendente
    public function show(int $id)
    {
        $empresa = EmpresaPendente::with('modulos')->findOrFail($id);

        return response()->json([
            'id'      => $empresa->EMPP_ID,
            'nome'    => $empresa->EMPP_NOME,
            'raz'     => $empresa->EMPP_RAZ,
            'cnpj'    => $empresa->EMPP_CNPJ,
            'email'   => $empresa->EMPP_EMAIL,
            'num'     => $empresa->EMPP_NUM,
            'modulos' => $empresa->modulos->pluck('MOD_NOME')
        ]);
    }

    // POST /api/adm/empresaspendentes/criar - Criar uma nova empresa pendente
    public function store(Request $request)
    {
        $request->validate([
            'EMPP_NOME'  => 'required|string|max:50',
            'EMPP_RAZ'   => 'required|string|max:100',
            'EMPP_EMAIL' => 'required|email|max:50|unique:EMPRESAS_PENDENTES,EMPP_EMAIL',
            'EMPP_CNPJ'  => 'required|string|max:14|unique:EMPRESAS_PENDENTES,EMPP_CNPJ',
            'EMPP_NUM'   => 'nullable|string|max:20',
            'modulos'    => 'nullable|array',
            'modulos.*'  => 'integer|exists:MODULOS,MOD_ID',
        ]);

        $empresa = EmpresaPendente::create([
            'EMPP_NOME'  => trim($request->EMPP_NOME),
            'EMPP_RAZ'   => trim($request->EMPP_RAZ),
            'EMPP_EMAIL' => trim($request->EMPP_EMAIL),
            'EMPP_CNPJ'  => trim($request->EMPP_CNPJ),
            'EMPP_NUM'   => $request->EMPP_NUM ?? null,
            'ADM_ID'     => $_SESSION['adm_id'] ?? null,
        ]);

        if ($request->filled('modulos')) {
            $empresa->modulos()->attach($request->modulos);
        }

        return response()->json([
            'message' => 'Empresa pendente criada com sucesso',
            'id'      => $empresa->EMPP_ID
        ], 201);
    }

    // DELETE /api/adm/empresaspendentes/{id} - Excluir uma empresa pendente
    public function destroy(int $id)
    {
        $empresa = EmpresaPendente::findOrFail($id);
        $empresa->delete();

        return response()->json(['message' => 'Empresa pendente excluída com sucesso']);
    }
}