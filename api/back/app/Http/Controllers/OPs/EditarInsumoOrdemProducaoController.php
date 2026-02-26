<?php

namespace App\Http\Controllers\OPs;

use App\Http\Controllers\Controller;
use App\Models\OPInsumo;
use Illuminate\Http\Request;

class EditarInsumoOrdemProducaoController extends Controller
{
    public function editaOPIN(Request $request)
    {
        try {
            $dados = $request->json()->all();

            if (!$dados) {
                return response()->json([
                    'sucesso'          => false,
                    'erro'             => true,
                    'mensagem_de_erro' => 'Dados inválidos ou ausentes!'
                ], 400);
            }

            $opins = $dados['insumos'] ?? null;

            if (!$opins || count($opins) === 0) {
                return;
            }

            foreach ($opins as $opin) {
                $idOPIN      = $opin['idOPIN'];
                $insumoBanco = OPInsumo::find($idOPIN);

                $qtd   = $opin['qtdInsumo'] ?? $insumoBanco->OPIN_QTD;
                $idFor = $opin['idFor'] ?? $insumoBanco->FORNECEDORES_CLIFOR_ID;

                // Recalcula o custo total do insumo
                $custot = $insumoBanco->OPIN_CUSTOU * $qtd;

                // Atualiza o insumo no banco
                $insumoBanco->update([
                    'OPIN_QTD'               => $qtd,
                    'OPIN_CUSTOT'            => $custot,
                    'FORNECEDORES_CLIFOR_ID' => $idFor
                ]);
            }

            return response()->json([
                'sucesso' => true,
                'erro'    => false
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'sucesso'          => false,
                'erro'             => true,
                'mensagem_de_erro' => 'Erro ao tentar editar insumo da OP: ' . $e->getMessage()
            ], 500);
        }
    }
}