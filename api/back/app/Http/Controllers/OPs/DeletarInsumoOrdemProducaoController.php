<?php

namespace App\Http\Controllers\OPs;

use App\Http\Controllers\Controller;
use App\Models\OPInsumo;
use App\Models\OrdemDeProducao;
use App\Helpers\FuncoesAuxiliares;
use Illuminate\Http\Request;

class DeletarInsumoOrdemProducaoController extends Controller
{
    public function deletaInsumo(Request $request)
    {
        try {
            $dados = $request->json()->all();

            if (!$dados) {
                return response()->json([
                    'sucesso'          => false,
                    'erro'             => true,
                    'mensagem_de_erro' => 'Dados inválidos ou ausentes!'
                ]);
            }

            $opinS     = $dados['insumosDeletados'] ?? null;
            $idUsuario = (int) $request->session()->get('usuario_id');

            if (!$opinS || count($opinS) === 0) {
                return;
            }

            foreach ($opinS as $opin) {
                // Busca o insumo e a OP relacionada
                $insumo = OPInsumo::find((int) $opin);
                $op = OrdemDeProducao::where('OP_ID', $insumo->ORDEM_PRODUCAO_OP_ID)
                    ->where('USUARIOS_USU_ID', $idUsuario)
                    ->first();

                // Deleta o insumo
                $insumo->delete();

                // Recalcula e atualiza os custos da OP
                $custotOP = FuncoesAuxiliares::retornaCustotOP($op->OP_ID);
                $custouOP = $custotOP / $op->OP_QTD;

                OrdemDeProducao::where('OP_ID', $insumo->ORDEM_PRODUCAO_OP_ID)->update([
                    'OP_QTD'    => $op->OP_QTD,
                    'OP_CUSTOU' => $custouOP,
                    'OP_CUSTOT' => $custotOP,
                    'OP_QUEBRA' => $op->OP_QUEBRA
                ]);
            }

            return response()->json([
                'sucesso'  => true,
                'erro'     => false,
                'resposta' => 'Insumo deletado!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'sucesso'          => false,
                'erro'             => true,
                'mensagem_de_erro' => 'Erro ao tentar deletar insumo: ' . $e->getMessage()
            ], 500);
        }
    }
}
