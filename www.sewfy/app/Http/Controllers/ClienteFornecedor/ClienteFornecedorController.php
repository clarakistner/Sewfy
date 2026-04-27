<?php

namespace App\Http\Controllers\ClienteFornecedor;

use App\Http\Controllers\Controller;
use App\Models\ClienteFornecedor;
use Illuminate\Http\Request;

class ClienteFornecedorController extends Controller
{

    // Função para extrair o ID da empresa a partir das abilities do token de acesso do usuário
    private function getEmpresaId(Request $request): string
    {
        $abilities = $request->user()->currentAccessToken()->abilities;
        $ability   = collect($abilities)->first(fn($a) => str_starts_with($a, 'empresa_'));

        if (!$ability) {
            abort(403, 'Token sem empresa associada');
        }

        return str_replace('empresa_', '', $ability);
    }

    // GET /api/clifor?search=Clara - Listar clientes/fornecedores ativos, com busca por nome ou CPF/CNPJ
    public function index(Request $request)
    {
        $empresaId = $this->getEmpresaId($request);
        $termo     = trim($request->get('search', ''));

        $query = ClienteFornecedor::where('EMP_ID', $empresaId)
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

    // POST /api/clifor - Cadastrar um novo cliente/fornecedor
    public function store(Request $request)
    {
        $request->validate([
            'CLIFOR_TIPO'    => 'required|in:cliente,fornecedor,ambos',
            'CLIFOR_NOME'    => 'required|string|min:4|max:255',
            'CLIFOR_CPFCNPJ' => 'required|string',
            'CLIFOR_END'     => 'required|string',
            'CLIFOR_NUM'     => 'nullable|string'
        ]);

        $empresaId = $this->getEmpresaId($request);
        $cpfCnpj   = preg_replace('/\D/', '', $request->CLIFOR_CPFCNPJ);
        $telefone  = preg_replace('/\D/', '', $request->CLIFOR_NUM ?? '');

        $existe = ClienteFornecedor::where('EMP_ID', $empresaId)
            ->where('CLIFOR_CPFCNPJ', $cpfCnpj)
            ->exists();

        if ($existe) {
            return response()->json(['erro' => 'CPF/CNPJ já cadastrado'], 409);
        }

        $clifor = ClienteFornecedor::create([
            'EMP_ID'         => $empresaId,
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

    // GET /api/clifor/{id} - Detalhes de um cliente/fornecedor específico
    public function show(Request $request, int $id)
    {
        $empresaId = $this->getEmpresaId($request);

        $clifor = ClienteFornecedor::where('CLIFOR_ID', $id)
            ->where('EMP_ID', $empresaId)
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

    // PUT /api/clifor/{id} - Atualizar um cliente/fornecedor específico
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

        $empresaId = $this->getEmpresaId($request);

        $clifor = ClienteFornecedor::where('CLIFOR_ID', $id)
            ->where('EMP_ID', $empresaId)
            ->firstOrFail();

        $cpfCnpj  = preg_replace('/\D/', '', $request->CLIFOR_CPFCNPJ);
        $telefone = preg_replace('/\D/', '', $request->CLIFOR_NUM ?? '');
        $cpfAtual = preg_replace('/\D/', '', $clifor->CLIFOR_CPFCNPJ);

        if ($cpfAtual !== $cpfCnpj) {
            $existe = ClienteFornecedor::where('EMP_ID', $empresaId)
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

    // GET /api/clifor/todos - Retorna todos os clientes/fornecedores, incluindo os inativos, para uma empresa específica (usado para relatórios e exportação de dados)
    public function todos(Request $request)
    {
        $empresaId = $this->getEmpresaId($request);
        $termo     = trim($request->get('search', ''));

        $query = ClienteFornecedor::where('EMP_ID', $empresaId); // sem CLIFOR_ATIV

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

    // GET /api/clifor/fornecedores - Retorna apenas fornecedores e ambos ativos
    public function fornecedores(Request $request)
    {
        $empresaId = $this->getEmpresaId($request);

        $clifor = ClienteFornecedor::where('EMP_ID', $empresaId)
            ->where('CLIFOR_ATIV', 1)
            ->whereIn('CLIFOR_TIPO', ['fornecedor', 'ambos'])
            ->get()
            ->map(fn($item) => [
                'id'   => $item->CLIFOR_ID,
                'nome' => $item->CLIFOR_NOME,
            ]);

        return response()->json($clifor);
    }
}