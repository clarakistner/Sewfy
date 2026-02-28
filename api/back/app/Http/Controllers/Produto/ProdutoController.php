<?php

namespace App\Http\Controllers\Produto;

use App\Http\Controllers\Controller;
use App\Models\Produto;
use Illuminate\Http\Request;

class ProdutoController extends Controller
{
    // GET /api/produtos?termo=camisa&tipo=1 - Lista produtos ativos, com busca opcional por nome/código e filtro por tipo
    public function index(Request $request)
    {
        $empresa = $request->user()->empresa;
        $termo = trim($request->get('termo', ''));
        $tipo = $request->get('tipo');

        $query = Produto::where('EMP_ID', $empresa->EMP_ID)
            ->where('PROD_ATIV', 1);

        if ($termo !== '') {
            $query->where(function($q) use ($termo) {
                $q->where('PROD_NOME', 'ilike', '%' . $termo . '%')
                  ->orWhere('PROD_COD', 'ilike', '%' . $termo . '%');
            });
        }

        if (!is_null($tipo)) {
            $query->where('PROD_TIPO', (int) $tipo);
        }

        $produtos = $query->get()->map(function($p) {
            return [
                'id'    => $p->PROD_ID,
                'cod'   => $p->PROD_COD,
                'nome'  => $p->PROD_NOME,
                'tipo'  => match ((int) $p->PROD_TIPO) {
                    0 => 'Insumo',
                    1 => 'Produto Acabado',
                    default => 'Desconhecido'
                },
                'um'    => $p->PROD_UM,
                'preco' => $p->PROD_PRECO,
                'ativo' => $p->PROD_ATIV
            ];
        });

        return response()->json($produtos);
    }

    // POST /api/produtos - Cadastra um novo produto
    public function store(Request $request)
    {
        $request->validate([
            'PROD_COD'  => 'required|string',
            'PROD_NOME' => 'required|string',
            'PROD_TIPO' => 'required|integer',
            'PROD_UM'   => 'required|string',
            'PROD_DESC' => 'nullable|string',
            'PROD_PRECO' => 'nullable|numeric'
        ]);

        $empresa = $request->user()->empresa;

        $existe = Produto::where('EMP_ID', $empresa->EMP_ID)
            ->where(function($q) use ($request) {
                $q->where('PROD_COD', trim($request->PROD_COD))
                  ->orWhere('PROD_NOME', trim($request->PROD_NOME));
            })->exists();

        if ($existe) {
            return response()->json(['erro' => 'Já existe um produto com esse código ou nome'], 409);
        }

        $produto = Produto::create([
            'EMP_ID'     => $empresa->EMP_ID,
            'PROD_COD'   => trim($request->PROD_COD),
            'PROD_NOME'  => trim($request->PROD_NOME),
            'PROD_TIPO'  => (int) $request->PROD_TIPO,
            'PROD_UM'    => trim($request->PROD_UM),
            'PROD_DESC'  => $request->PROD_DESC ?? null,
            'PROD_PRECO' => $request->PROD_PRECO ? (float) $request->PROD_PRECO : null,
            'PROD_ATIV'  => 1
        ]);

        return response()->json([
            'mensagem' => 'Produto cadastrado com sucesso',
            'id'       => $produto->PROD_ID
        ], 201);
    }

    // GET /api/produtos/{id} - Visualiza detalhes de um produto
    public function show(Request $request, int $id)
    {
        $empresa = $request->user()->empresa;

        $p = Produto::where('PROD_ID', $id)
            ->where('EMP_ID', $empresa->EMP_ID)
            ->firstOrFail();

        return response()->json([
            'id'    => $p->PROD_ID,
            'cod'   => $p->PROD_COD,
            'nome'  => $p->PROD_NOME,
            'tipo'  => match ((int) $p->PROD_TIPO) {
                0 => 'Insumo',
                1 => 'Produto Acabado',
                3 => 'Conjunto',
                default => 'Desconhecido'
            },
            'um'    => $p->PROD_UM,
            'preco' => $p->PROD_PRECO,
            'ativo' => $p->PROD_ATIV,
            'desc'  => $p->PROD_DESC
        ]);
    }

    // PUT /api/produtos/{id} - Atualiza um produto existente
    public function update(Request $request, int $id)
    {
        $request->validate([
            'PROD_COD'   => 'required|string',
            'PROD_NOME'  => 'required|string',
            'PROD_TIPO'  => 'required|integer',
            'PROD_UM'    => 'required|string',
            'PROD_DESC'  => 'nullable|string',
            'PROD_PRECO' => 'nullable|numeric',
            'PROD_ATIV'  => 'required|boolean'
        ]);

        $empresa = $request->user()->empresa;

        $produto = Produto::where('PROD_ID', $id)
            ->where('EMP_ID', $empresa->EMP_ID)
            ->firstOrFail();

        $existe = Produto::where('EMP_ID', $empresa->EMP_ID)
            ->where(function($q) use ($request) {
                $q->where('PROD_COD', trim($request->PROD_COD))
                  ->orWhere('PROD_NOME', trim($request->PROD_NOME));
            })
            ->where('PROD_ID', '!=', $id)
            ->exists();

        if ($existe) {
            return response()->json(['erro' => 'Já existe outro produto com esse código ou nome'], 409);
        }

        $produto->update([
            'PROD_COD'   => trim($request->PROD_COD),
            'PROD_NOME'  => trim($request->PROD_NOME),
            'PROD_TIPO'  => (int) $request->PROD_TIPO,
            'PROD_UM'    => trim($request->PROD_UM),
            'PROD_DESC'  => $request->PROD_DESC ?? null,
            'PROD_PRECO' => $request->PROD_PRECO ? (float) $request->PROD_PRECO : null,
            'PROD_ATIV'  => $request->PROD_ATIV
        ]);

        return response()->json(['mensagem' => 'Produto atualizado com sucesso']);
    }
}