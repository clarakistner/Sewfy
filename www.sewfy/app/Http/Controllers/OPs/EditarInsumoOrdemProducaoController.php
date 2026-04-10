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
                return response()->json([
                    'mensagem' => 'Lista de edicao de insumos vazia'
                ]);
            }

            $ids = collect($opins)->pluck('idOPIN')->filter()->values();
            $insumosBanco = OPInsumo::whereIn('OPIN_ID', $ids)->get()->keyBy('OPIN_ID');

            foreach ($opins as $opin) {
                $idOPIN = $opin['idOPIN'] ?? null;
                if (!$idOPIN) continue;

                $insumoBanco = $insumosBanco->get($idOPIN);
                if (!$insumoBanco) continue;

                $qtd    = $opin['qtdInsumo'] ?? $insumoBanco->OPIN_QTD;
                $idFor  = $insumoBanco->NECESSITA_CLIFOR === 1 ? ($opin['idFor'] ?? $insumoBanco->CLIFOR_ID) : null;
                $custot = $opin['custouOPIN'] * $qtd;

                $insumoBanco->update([
                    'OPIN_QTD'    => $qtd,
                    'OPIN_CUSTOU' => $opin['custouOPIN'],
                    'OPIN_CUSTOT' => $custot,
                    'CLIFOR_ID'   => $idFor
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