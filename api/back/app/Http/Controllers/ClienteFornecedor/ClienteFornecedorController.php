<?php

namespace App\Http\Controllers\ClienteFornecedor;

use App\Http\Controllers\Controller;
use App\Models\ClienteFornecedor;
use Illuminate\Http\Request;

class ClienteFornecedorController extends Controller
{
    
    // GET /api/clifor?search=Clara - Lista clientes/fornecedores ativos, com busca opcional por nome ou CPF/CNPJ
    public function index(Request $request)
    {
        $empresa = $request->user()->empresa;
        $termo = trim($request->get('search', ''));

        $query = ClienteFornecedor::where('EMP_ID', $empresa->EMP_ID)
            ->where('CLIFOR_ATIV', 1);

        if ($termo !== '') {
            $query->where(function($q) use ($termo) {
                $q->where('CLIFOR_NOME', 'ilike', '%' . $termo . '%')
                ->orWhere('CLIFOR_CPFCNPJ', 'like', '%' . $termo . '%');
            });
        }

        $clifor = $query->get()->map(function($item) {
            return [
                'id'       => $item->CLIFOR_ID,
                'nome'     => $item->CLIFOR_NOME,
                'cpfCnpj'  => $item->CLIFOR_CPFCNPJ,
                'telefone' => $item->CLIFOR_NUM,
                'endereco' => $item->CLIFOR_END,
                'ativo'    => $item->CLIFOR_ATIV
            ];
        });

        return response()->json($clifor);
    }

    // POST /api/clifor
    public function store(Request $request)
    {
        $request->validate([
            'CLIFOR_TIPO'    => 'required|in:cliente,fornecedor,ambos',
            'CLIFOR_NOME'    => 'required|string|min:4|max:255',
            'CLIFOR_CPFCNPJ' => 'required|string',
            'CLIFOR_END'     => 'required|string',
            'CLIFOR_NUM'     => 'nullable|string'
        ]);

        $empresa = $request->user()->empresa;

        $cpfCnpj = preg_replace('/\D/', '', $request->CLIFOR_CPFCNPJ);
        $telefone = preg_replace('/\D/', '', $request->CLIFOR_NUM ?? '');

        // verifica CPF/CNPJ duplicado na empresa
        $existe = ClienteFornecedor::where('EMP_ID', $empresa->EMP_ID)
            ->where('CLIFOR_CPFCNPJ', $cpfCnpj)
            ->exists();

        if ($existe) {
            return response()->json(['erro' => 'CPF/CNPJ já cadastrado'], 409);
        }

        $clifor = ClienteFornecedor::create([
            'EMP_ID'         => $empresa->EMP_ID,
            'CLIFOR_TIPO'    => $request->CLIFOR_TIPO,
            'CLIFOR_NOME'    => trim($request->CLIFOR_NOME),
            'CLIFOR_CPFCNPJ' => $cpfCnpj,
            'CLIFOR_END'     => trim($request->CLIFOR_END),
            'CLIFOR_NUM'     => $telefone ?: null,
            'CLIFOR_ATIV'    => 1
        ]);

        return response()->json([
            'mensagem' => 'Cadastrado com sucesso',
            'id'       => $clifor->CLIFOR_ID
        ], 201);
    }

    // GET /api/clifor/{id} - Visualiza detalhes de um cliente/fornecedor
    public function show(Request $request, int $id)
    {
        $empresa = $request->user()->empresa;

        $clifor = ClienteFornecedor::where('CLIFOR_ID', $id)
            ->where('EMP_ID', $empresa->EMP_ID)
            ->firstOrFail();

        return response()->json([
            'id'       => $clifor->CLIFOR_ID,
            'nome'     => $clifor->CLIFOR_NOME,
            'cpfCnpj'  => $clifor->CLIFOR_CPFCNPJ,
            'telefone' => $clifor->CLIFOR_NUM,
            'endereco' => $clifor->CLIFOR_END,
            'ativo'    => $clifor->CLIFOR_ATIV
        ]);
    }

    
    // PUT /api/clifor/{id} - Atualiza um cliente/fornecedor existente
    public function update(Request $request, int $id)
    {
        $request->validate([
            'CLIFOR_TIPO'    => 'required|in:cliente,fornecedor,ambos',
            'CLIFOR_NOME'    => 'required|string|min:4|max:255',
            'CLIFOR_CPFCNPJ' => 'required|string',
            'CLIFOR_END'     => 'required|string',
            'CLIFOR_NUM'     => 'nullable|string',
            'CLIFOR_ATIV'    => 'required|boolean'
        ]);

        $empresa = $request->user()->empresa;

        $clifor = ClienteFornecedor::where('CLIFOR_ID', $id)
            ->where('EMP_ID', $empresa->EMP_ID)
            ->firstOrFail(); // já retorna 404 se não encontrar

        $cpfCnpj = preg_replace('/\D/', '', $request->CLIFOR_CPFCNPJ);
        $telefone = preg_replace('/\D/', '', $request->CLIFOR_NUM ?? '');

        // só verifica duplicata se o CPF/CNPJ mudou
        $cpfAtual = preg_replace('/\D/', '', $clifor->CLIFOR_CPFCNPJ);

        if ($cpfAtual !== $cpfCnpj) {
            $existe = ClienteFornecedor::where('EMP_ID', $empresa->EMP_ID)
                ->where('CLIFOR_CPFCNPJ', $cpfCnpj)
                ->where('CLIFOR_ID', '!=', $id)
                ->exists();

            if ($existe) {
                return response()->json(['erro' => 'CPF/CNPJ já cadastrado para outro registro'], 409);
            }
        }

        $clifor->update([
            'CLIFOR_TIPO'    => $request->CLIFOR_TIPO,
            'CLIFOR_NOME'    => trim($request->CLIFOR_NOME),
            'CLIFOR_CPFCNPJ' => $cpfCnpj,
            'CLIFOR_END'     => trim($request->CLIFOR_END),
            'CLIFOR_NUM'     => $telefone ?: null,
            'CLIFOR_ATIV'    => $request->CLIFOR_ATIV
        ]);

        return response()->json(['mensagem' => 'Atualizado com sucesso']);
    }
}