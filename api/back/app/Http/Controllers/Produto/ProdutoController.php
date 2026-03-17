<?php

namespace App\Http\Controllers\Produto;

use App\Http\Controllers\Controller;
use App\Models\Produto;
use Illuminate\Http\Request;

class ProdutoController extends Controller
{
    private function getEmpresaId(Request $request): string
    {
        $abilities = $request->user()->currentAccessToken()->abilities;
        $ability   = collect($abilities)->first(fn($a) => str_starts_with($a, 'empresa_'));

        if (!$ability) {
            abort(403, 'Token sem empresa associada');
        }

        return str_replace('empresa_', '', $ability);
    }

    // GET /api/produtos?termo=camisa&tipo=insumo
    public function index(Request $request)
    {
        $empresaId = $this->getEmpresaId($request);
        $termo     = trim($request->get('termo', ''));
        $tipo      = $request->get('tipo');

        $query = Produto::where('EMP_ID', $empresaId)
            ->where('PROD_ATIV', 1);

        if ($termo !== '') {
            $query->where(function($q) use ($termo) {
                $q->where('PROD_NOME', 'ilike', '%' . $termo . '%')
                  ->orWhere('PROD_COD', 'ilike', '%' . $termo . '%');
            });
        }

        if (!is_null($tipo)) {
            $query->where('PROD_TIPO', $tipo); // string do enum
        }

        $produtos = $query->get()->map(function($p) {
            return [
                'id'    => $p->PROD_ID,
                'cod'   => $p->PROD_COD,
                'nome'  => $p->PROD_NOME,
                'tipo'  => $p->PROD_TIPO,      // 'insumo', 'produto acabado', 'conjunto'
                'um'    => $p->PROD_UM,         // 'UN', 'KG', 'MT'
                'preco' => $p->PROD_PRECO,
                'ativo' => $p->PROD_ATIV
            ];
        });

        return response()->json($produtos);
    }

    // POST /api/produtos
    public function store(Request $request)
    {
        $request->validate([
            'PROD_COD'   => 'required|string',
            'PROD_NOME'  => 'required|string',
            'PROD_TIPO'  => 'required|string|in:insumo,produto acabado,conjunto',
            'PROD_UM'    => 'required|string|in:UN,KG,MT',
            'PROD_DESC'  => 'nullable|string',
            'PROD_PRECO' => 'nullable|numeric'
        ]);

        $empresaId = $this->getEmpresaId($request);

        $existe = Produto::where('EMP_ID', $empresaId)
            ->where(function($q) use ($request) {
                $q->where('PROD_COD', trim($request->PROD_COD))
                  ->orWhere('PROD_NOME', trim($request->PROD_NOME));
            })->exists();

        if ($existe) {
            return response()->json(['erro' => 'Já existe um produto com esse código ou nome'], 409);
        }

        $produto = Produto::create([
            'EMP_ID'     => $empresaId,
            'PROD_COD'   => trim($request->PROD_COD),
            'PROD_NOME'  => trim($request->PROD_NOME),
            'PROD_TIPO'  => $request->PROD_TIPO,
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

    // GET /api/produtos/{id}
    public function show(Request $request, int $id)
    {
        $user = $request->user();
        $abilities = $user->currentAccessToken()->abilities;
        $ability   = collect($abilities)->first(fn($a) => str_starts_with($a, 'empresa_'));
        $empresaId = str_replace('empresa_', '', $ability);

        $p = Produto::where('PROD_ID', $id)
            ->where('EMP_ID', $empresaId)
            ->firstOrFail();

        return response()->json([
            'id'    => $p->PROD_ID,
            'cod'   => $p->PROD_COD,
            'nome'  => $p->PROD_NOME,
            'tipo'  => $p->PROD_TIPO,
            'um'    => $p->PROD_UM,
            'preco' => $p->PROD_PRECO,
            'ativo' => $p->PROD_ATIV,
            'desc'  => $p->PROD_DESC
        ]);
    }

    // PUT /api/produtos/{id}
    public function update(Request $request, int $id)
    {
        $request->validate([
            'PROD_COD'   => 'required|string',
            'PROD_NOME'  => 'required|string',
            'PROD_TIPO'  => 'required|string|in:insumo,produto acabado,conjunto',
            'PROD_UM'    => 'required|string|in:UN,KG,MT',
            'PROD_DESC'  => 'nullable|string',
            'PROD_PRECO' => 'nullable|numeric',
            'PROD_ATIV'  => 'required|boolean'
        ]);

        $empresaId = $this->getEmpresaId($request);

        $produto = Produto::where('PROD_ID', $id)
            ->where('EMP_ID', $empresaId)
            ->firstOrFail();

        $existe = Produto::where('EMP_ID', $empresaId)
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
            'PROD_TIPO'  => $request->PROD_TIPO,
            'PROD_UM'    => trim($request->PROD_UM),
            'PROD_DESC'  => $request->PROD_DESC ?? null,
            'PROD_PRECO' => $request->PROD_PRECO ? (float) $request->PROD_PRECO : null,
            'PROD_ATIV'  => $request->PROD_ATIV
        ]);

        return response()->json(['mensagem' => 'Produto atualizado com sucesso']);
    }

    // GET /api/produtos/todos
    public function todos(Request $request)
    {
        $empresaId = $this->getEmpresaId($request);
        $termo     = trim($request->get('termo', ''));
        $tipo      = $request->get('tipo');

        \Log::info('[PRODUTOS] empId: ' . $empresaId);
        $query = Produto::where('EMP_ID', $empresaId); // sem o PROD_ATIV

        if ($termo !== '') {
            $query->where(function($q) use ($termo) {
                $q->where('PROD_NOME', 'ilike', '%' . $termo . '%')
                ->orWhere('PROD_COD', 'ilike', '%' . $termo . '%');
            });
        }

        if (!is_null($tipo)) {
            $query->where('PROD_TIPO', $tipo);
        }

        $produtos = $query->get()->map(function($p) {
            return [
                'id'    => $p->PROD_ID,
                'cod'   => $p->PROD_COD,
                'nome'  => $p->PROD_NOME,
                'tipo'  => $p->PROD_TIPO,
                'um'    => $p->PROD_UM,
                'preco' => $p->PROD_PRECO,
                'ativo' => $p->PROD_ATIV
            ];
        });

        return response()->json($produtos);
    }
}