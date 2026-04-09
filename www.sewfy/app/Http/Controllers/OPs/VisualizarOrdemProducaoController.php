<?php

namespace App\Http\Controllers\OPs;

use App\Http\Controllers\Controller;
use App\Models\OrdemDeProducao;
use Illuminate\Http\Request;

class VisualizarOrdemProducaoController extends Controller
{
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

            $op = OrdemDeProducao::with('insumos')
                ->where('OP_ID', $id)
                ->where('USU_RESPONSAVEL', $idUsuario)
                ->where('EMP_ID', $empresaId)
                ->first();

            if (!$op) {
                return response()->json([
                    'sucesso'          => false,
                    'erro'             => true,
                    'mensagem_de_erro' => 'Ordem de produção não encontrada'
                ], 404);
            }

            $opResposta = [
                'idOP'        => $op->OP_ID,
                'prodIDOP'    => $op->PROD_ID,
                'dataa'       => $op->OP_DATAA,
                'datae'       => $op->OP_DATAE,
                'custot'      => $op->OP_CUSTOT,
                'custou'      => $op->OP_CUSTOU,
                'custour'     => $op->OP_CUSTOUR,
                'qtdOP'       => $op->OP_QTD,
                'qtdeOP'      => $op->OP_QTDE,
                'usuarioIDOP' => $op->USU_ID,
                'status'      => $op->OP_STATUS,
                'quebra'      => $op->OP_QUEBRA
            ];

            $opinSResposta = [];
            foreach ($op->insumos as $opin) {
                $opinSResposta[] = [
                    'idOPIN'           => $opin->OPIN_ID,
                    'forOPIN'          => $opin->CLIFOR_ID,
                    'custotOPIN'       => $opin->OPIN_CUSTOT,
                    'custouOPIN'       => $opin->OPIN_CUSTOU,
                    'qtdOPIN'          => $opin->OPIN_QTD,
                    'umOPIN'           => $opin->OPIN_UM,
                    'opOPIN'           => $opin->OP_ID,
                    'prodIdOPIN'       => $opin->PROD_ID,
                    'necessita_clifor' => $opin->NECESSITA_CLIFOR === 1
                ];
            }

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