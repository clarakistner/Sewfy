<?php

namespace App\Http\Controllers\OPs;

use App\Http\Controllers\Controller;
use App\Models\OrdemDeProducao;
use App\Models\ClienteFornecedor as Clifor;
use App\Models\Empresa;
use App\Models\Produto;
use Illuminate\Http\Request;

class GerarGuiasImpressaoController extends Controller
{
    // ─── POST /ordemdeproducao/guias (JSON — sem alteração) ───────────────────

    public function gerarGuias(Request $request)
    {
        try {
            $user      = $request->user();
            $abilities = $user->currentAccessToken()->abilities;
            $ability   = collect($abilities)->first(fn($a) => str_starts_with($a, 'empresa_'));

            if (!$ability) {
                return response()->json([
                    'sucesso'          => false,
                    'erro'             => true,
                    'mensagem_de_erro' => 'Token inválido'
                ], 403);
            }

            $empresaId = str_replace('empresa_', '', $ability);

            $opsIds = $request->input('ops_ids');

            if (empty($opsIds) || !is_array($opsIds)) {
                return response()->json([
                    'sucesso'          => false,
                    'erro'             => true,
                    'mensagem_de_erro' => 'Nenhuma ordem de produção selecionada'
                ], 422);
            }

            $guias = $this->buscarGuias($empresaId, $opsIds);

            if ($guias === null) {
                return response()->json([
                    'sucesso'          => false,
                    'erro'             => true,
                    'mensagem_de_erro' => 'Nenhuma ordem de produção encontrada'
                ], 404);
            }

            if (empty($guias)) {
                return response()->json([
                    'sucesso'          => false,
                    'erro'             => true,
                    'mensagem_de_erro' => 'Nenhum insumo com fornecedor encontrado nas ordens selecionadas'
                ], 404);
            }

            return response()->json([
                'sucesso' => true,
                'erro'    => false,
                'guias'   => $guias
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'sucesso'          => false,
                'erro'             => true,
                'mensagem_de_erro' => 'Erro ao gerar guias: ' . $e->getMessage()
            ], 500);
        }
    }

    // ─── GET /ordemdeproducao/guias/imprimir (View Blade para impressão) ──────

    public function imprimirGuias(Request $request)
    {
        try {
            // Autentica via token na query string
            $tokenStr = $request->query('token');

            if (!$tokenStr) {
                abort(403, 'Token não informado');
            }

            $token = \Laravel\Sanctum\PersonalAccessToken::findToken($tokenStr);

            if (!$token) {
                abort(403, 'Token inválido');
            }

            $abilities = $token->abilities;
            $ability   = collect($abilities)->first(fn($a) => str_starts_with($a, 'empresa_'));

            if (!$ability) {
                abort(403, 'Token sem permissão de empresa');
            }

            $empresaId = str_replace('empresa_', '', $ability);

            // IDs das OPs via query string: ?ops=1,2,3
            $opsIds = array_filter(explode(',', $request->query('ops', '')));

            if (empty($opsIds)) {
                abort(422, 'Nenhuma ordem de produção informada');
            }

            $guias = $this->buscarGuias($empresaId, $opsIds);

            if (empty($guias)) {
                abort(404, 'Nenhuma guia encontrada');
            }

            return view('guias-impressao', compact('guias'));
        } catch (\Exception $e) {
            abort(500, 'Erro ao gerar guias: ' . $e->getMessage());
        }
    }

    // ─── Lógica compartilhada ─────────────────────────────────────────────────

    private function buscarGuias(string $empresaId, array $opsIds): ?array
    {
        $empresa = Empresa::where('EMP_ID', $empresaId)->first();

        $ops = OrdemDeProducao::with([
            'insumos' => fn($q) => $q
                ->whereNotNull('CLIFOR_ID')
                ->where('NECESSITA_CLIFOR', 1)
                ->select('OPIN_ID', 'OP_ID', 'PROD_ID', 'CLIFOR_ID', 'OPIN_QTD', 'OPIN_UM', 'OPIN_CUSTOU', 'OPIN_CUSTOT')
        ])
            ->where('EMP_ID', $empresaId)
            ->whereIn('OP_ID', $opsIds)
            ->select('OP_ID', 'PROD_ID', 'OP_QTD', 'OP_CUSTOT')
            ->get();

        if ($ops->isEmpty()) {
            return null;
        }

        $guias = [];

        foreach ($ops as $op) {
            $produto = Produto::find($op->PROD_ID);

            foreach ($op->insumos as $insumo) {
                $clifor      = Clifor::find($insumo->CLIFOR_ID);
                $insumo_prod = Produto::find($insumo->PROD_ID);

                $guias[] = [
                    'empresa_nome'    => $empresa?->EMP_NOME ?? '',
                    'op_id'           => $op->OP_ID,
                    'produto_nome'    => $produto?->PROD_NOME ?? '',
                    'produto_cod'     => $produto?->PROD_COD ?? '',
                    'fornecedor_nome' => $clifor?->CLIFOR_NOME ?? '',
                    'insumo_id'       => $insumo->OPIN_ID,
                    'insumo_nome'     => $insumo_prod?->PROD_NOME ?? '',
                    'insumo_qtd'      => $insumo->OPIN_QTD,
                    'insumo_um'       => $insumo->OPIN_UM,
                    'custo_unitario'  => $insumo->OPIN_CUSTOU,
                    'custo_estimado'  => $insumo->OPIN_CUSTOT,
                ];
            }
        }

        return $guias;
    }
}