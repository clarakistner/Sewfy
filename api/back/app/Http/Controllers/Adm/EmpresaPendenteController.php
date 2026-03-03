<?php

namespace App\Http\Controllers\Adm;
use App\Http\Controllers\Controller;
use App\Models\EmpresaPendente;
use Illuminate\Http\Request;

class EmpresaPendenteController extends Controller
{
    // GET /api/adm/empresas-pendentes - Listar todas as empresas pendentes
    public function index()
    {
        $empresas = EmpresaPendente::all()->map(function($e) {
            return [
                'id'    => $e->EMP_ID,
                'nome'  => $e->EMP_NOME,
                'cnpj'  => $e->EMP_CNPJ,
                'email' => $e->EMP_EMAIL,
            ];
        });

        return response()->json($empresas);
    }
    public function show(int $id)
    {
        $empresa = EmpresaPendente::findOrFail($id);

        return response()->json([
            'id'    => $empresa->EMP_ID,
            'nome'  => $empresa->EMP_NOME,
            'raz'   => $empresa->EMP_RAZ,
            'cnpj'  => $empresa->EMP_CNPJ,
            'email' => $empresa->EMP_EMAIL,
            'num'   => $empresa->EMP_NUM
        ]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'EMPP_NOME'  => 'required|string|max:150',
            'EMPP_RAZ'   => 'required|string|max:150',
            'EMPP_EMAIL' => 'required|email|max:150',
            'EMPP_NUM'   => 'nullable|string|max:20',
            'ADM_ID'   => 'required|integer|exists:SEWFY_ADMS,ADM_ID',
            'EMPP_CNPJ'  => 'required|string|max:20'
        ]);

        $empresa = EmpresaPendente::create([
            'EMPP_NOME'  => trim($request->EMPP_NOME),
            'EMPP_RAZ'   => trim($request->EMPP_RAZ),
            'EMPP_EMAIL' => trim($request->EMPP_EMAIL),
            'EMPP_NUM'   => $request->EMPP_NUM ?? null,
            'ADM_ID'     => $request->ADM_ID,
            'EMPP_CNPJ'  => trim($request->EMPP_CNPJ)
        ]);

        return response()->json(['message' => 'Empresa pendente criada com sucesso', 'id' => $empresa->EMP_ID], 201);
    }
   
    public function destroy(int $id)
    {
        $empresa = EmpresaPendente::findOrFail($id);
        $empresa->delete();

        return response()->json(['message' => 'Empresa pendente excluída com sucesso']);
    }
}