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
            $user = $request->user();
            $abilities = $user->currentAccessToken()->abilities;
            $ability   = collect($abilities)->first(fn($a) => str_starts_with($a, 'empresa_'));
            $empresaId = str_replace('empresa_', '', $ability);
            $idUsuario = $user->USU_ID;

            if (!$opinS || count($opinS) === 0) {
                return;
            }
            

            foreach ($opinS as $opin) {
                if(!is_numeric($opin)) {
                    continue; // Pula IDs inválidos
                }
                // Busca o insumo e a OP relacionada
                $insumo = OPInsumo::find((int) $opin);
                $op = OrdemDeProducao::where('OP_ID', $insumo->OP_ID)
                    ->where('USU_RESPONSAVEL', $idUsuario)
                    ->where('EMP_ID', $empresaId)
                    ->first();

                // Deleta o insumo
                $insumo->delete();

                // Recalcula e atualiza os custos da OP
                $custotOP = FuncoesAuxiliares::retornaCustotOP($op->OP_ID);
                $custouOP = $custotOP / $op->OP_QTD;

                OrdemDeProducao::where('OP_ID', $insumo->OP_ID)->update([
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
