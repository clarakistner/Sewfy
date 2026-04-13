<?php

namespace App\Http\Controllers\Produto;

use App\Http\Controllers\Controller;
use App\Models\Produto;
use Illuminate\Http\Request;

class ProdutoController extends Controller
{
    // Colunas usadas em todos os métodos — evita SELECT * e reduz dados transferidos
    private const COLUNAS = [
        'PROD_ID', 'PROD_COD', 'PROD_NOME', 'PROD_TIPO',
        'PROD_UM', 'PROD_PRECO', 'PROD_ATIV', 'NECESSITA_CLIFOR'
    ];

    // Usa a empresa já resolvida pelo middleware ImpersonateEmpresa
    private function getEmpresaId(Request $request): string
    {
        $empresa = $request->empresa;

        if ($empresa) {
            return (string) $empresa->EMP_ID;
        }

        // Fallback: parse do token (caso o middleware não tenha rodado)
        $abilities = $request->user()->currentAccessToken()->abilities;
        $ability   = collect($abilities)->first(fn($a) => str_starts_with($a, 'empresa_'));

        if (!$ability) {
            abort(403, 'Token sem empresa associada');
        }

        return str_replace('empresa_', '', $ability);
    }

    // Mapeia os campos do model para o formato da resposta
    private function formatarProduto(mixed $p, bool $comDesc = false): array
    {
        $dados = [
            'id'               => $p->PROD_ID,
            'cod'              => $p->PROD_COD,
            'nome'             => $p->PROD_NOME,
            'tipo'             => $p->PROD_TIPO,
            'um'               => $p->PROD_UM,
            'preco'            => $p->PROD_PRECO,
            'ativo'            => $p->PROD_ATIV,
            'necessita_clifor' => $p->NECESSITA_CLIFOR === 1,
        ];

        if ($comDesc) {
            $dados['desc'] = $p->PROD_DESC;
        }

        return $dados;
    }

    // Aplica filtros de termo e tipo à query
    private function aplicarFiltros($query, string $termo, ?string $tipo): void
    {
        if ($termo !== '') {
            $query->where(function ($q) use ($termo) {
                $q->where('PROD_NOME', 'ilike', '%' . $termo . '%')
                  ->orWhere('PROD_COD', 'ilike', '%' . $termo . '%');
            });
        }

        if (!is_null($tipo)) {
            $query->where('PROD_TIPO', $tipo);
        }
    }

    // GET /api/produtos - Listar produtos ativos, com busca por nome ou código e filtro por tipo
    public function index(Request $request)
    {
        $empresaId = $this->getEmpresaId($request);
        $termo = trim($request->input('termo', ''));
        $tipo  = $request->input('tipo');

        $query = Produto::select(self::COLUNAS)
            ->where('EMP_ID', $empresaId)
            ->where('PROD_ATIV', 1);

        $this->aplicarFiltros($query, $termo, $tipo);

        return response()->json(
            $query->get()->map(fn($p) => $this->formatarProduto($p))->values()
        );
    }

    // POST /api/produtos - Cadastrar um novo produto
    public function store(Request $request)
    {
        $request->validate([
            'PROD_COD'         => 'required|string',
            'PROD_NOME'        => 'required|string',
            'PROD_TIPO'        => 'required|string|in:insumo,produto acabado,conjunto',
            'PROD_UM'          => 'required|string|in:UN,KG,MT',
            'PROD_DESC'        => 'nullable|string',
            'PROD_PRECO'       => 'nullable|numeric',
            'NECESSITA_CLIFOR' => 'required|boolean'
        ]);

        $empresaId = $this->getEmpresaId($request);

        $existe = Produto::where('EMP_ID', $empresaId)
            ->where(function ($q) use ($request) {
                $q->where('PROD_COD', trim($request->PROD_COD))
                  ->orWhere('PROD_NOME', trim($request->PROD_NOME));
            })->exists();

        if ($existe) {
            return response()->json(['erro' => 'Já existe um produto com esse código ou nome'], 409);
        }

        $produto = Produto::create([
            'EMP_ID'           => $empresaId,
            'PROD_COD'         => trim($request->PROD_COD),
            'PROD_NOME'        => trim($request->PROD_NOME),
            'PROD_TIPO'        => $request->PROD_TIPO,
            'PROD_UM'          => trim($request->PROD_UM),
            'PROD_DESC'        => $request->PROD_DESC ?? null,
            'PROD_PRECO'       => $request->PROD_PRECO ? (float) $request->PROD_PRECO : null,
            'PROD_ATIV'        => 1,
            'NECESSITA_CLIFOR' => $request->NECESSITA_CLIFOR ? 1 : 0
        ]);

        return response()->json([
            'mensagem' => 'Produto cadastrado com sucesso',
            'id'       => $produto->PROD_ID
        ], 201);
    }

    // GET /api/produtos/{id} - Detalhes de um produto específico
    public function show(Request $request, int $id)
    {
        $empresaId = $this->getEmpresaId($request);

        $p = Produto::select([...self::COLUNAS, 'PROD_DESC'])
            ->where('PROD_ID', $id)
            ->where('EMP_ID', $empresaId)
            ->firstOrFail();

        return response()->json($this->formatarProduto($p, comDesc: true));
    }

    // PUT /api/produtos/{id} - Atualizar um produto específico
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
            ->where(function ($q) use ($request) {
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

    // GET /api/produtos/todos - Retorna todos os produtos (incluindo inativos)
    public function todos(Request $request)
    {
        $empresaId = $this->getEmpresaId($request);
        $termo     = trim($request->input('termo', ''));
        $tipo      = $request->input('tipo');

        $query = Produto::select(self::COLUNAS)
            ->where('EMP_ID', $empresaId);

        $this->aplicarFiltros($query, $termo, $tipo);

        return response()->json($query->get()->map(fn($p) => $this->formatarProduto($p)));
    }
}