<?php

namespace App\Http\Controllers\OPs;

use App\Http\Controllers\Controller;
use App\Models\OrdemDeProducao;
use Illuminate\Http\Request;
use App\Models\Produto;

class VisualizarOrdemProducaoController extends Controller
{
    public function retornaNome($id)
    {
        $prod = Produto::find($id);
        return $prod->PROD_NOME;
    }
    public function visualizarOP(Request $request, $id)
    {
        try {
            $user      = $request->user();
            $idUsuario = (int) $user->USU_ID;
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

            $op = OrdemDeProducao::with(['insumos' => fn($q) => $q
                ->select('OPIN_ID', 'CLIFOR_ID', 'OPIN_CUSTOT', 'OPIN_CUSTOU', 'OPIN_QTD', 'OPIN_UM', 'OP_ID', 'PROD_ID', 'NECESSITA_CLIFOR')
                ->whereHas('produto', fn($q) => $q->where('PROD_ATIV', 1))
            ])
                ->where('OP_ID', $id)
                ->where('USU_RESPONSAVEL', $idUsuario)
                ->where('EMP_ID', $empresaId)
                ->select('OP_ID', 'PROD_ID', 'OP_DATAA', 'OP_DATAE', 'OP_CUSTOT', 'OP_CUSTOU', 'OP_CUSTOUR', 'OP_QTD', 'OP_QTDE', 'USU_RESPONSAVEL', 'OP_STATUS', 'OP_QUEBRA')
                ->first();

            if (!$op) {
                return response()->json([
                    'sucesso'          => false,
                    'erro'             => true,
                    'mensagem_de_erro' => 'Ordem de produção não encontrada'
                ], 404);
            }

            $opResposta = [
                'idOP'            => $op->OP_ID,
                'prodIDOP'        => $op->PROD_ID,
                'dataa'           => $op->OP_DATAA,
                'datae'           => $op->OP_DATAE,
                'custot'          => $op->OP_CUSTOT,
                'custou'          => $op->OP_CUSTOU,
                'custour'         => $op->OP_CUSTOUR,
                'qtdOP'           => $op->OP_QTD,
                'nome_produto'    => $this->retornaNome($op->PROD_ID),
                'qtdeOP'          => $op->OP_QTDE,
                'responsavelIDOP' => $op->USU_RESPONSAVEL,
                'status'          => $op->OP_STATUS,
                'quebra'          => $op->OP_QUEBRA
            ];

            $opinSResposta = $op->insumos->map(fn($opin) => [
                'idOPIN'           => $opin->OPIN_ID,
                'forOPIN'          => $opin->CLIFOR_ID,
                'custotOPIN'       => $opin->OPIN_CUSTOT,
                'custouOPIN'       => $opin->OPIN_CUSTOU,
                'qtdOPIN'          => $opin->OPIN_QTD,
                'umOPIN'           => $opin->OPIN_UM,
                'opOPIN'           => $opin->OP_ID,
                'nome_insumo'    => $this->retornaNome($opin->PROD_ID),
                'prodIdOPIN'       => $opin->PROD_ID,
                'necessita_clifor' => $opin->NECESSITA_CLIFOR === 1
            ]);

            return response()->json([
                'sucesso' => true,
                'erro'    => false,
                'op'      => $opResposta,
                'opinS'   => $opinSResposta
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'sucesso'          => false,
                'erro'             => true,
                'mensagem_de_erro' => 'Erro ao tentar visualizar ordem de produção: ' . $e->getMessage()
            ], 500);
        }
    }
}