<?php

namespace App\Http\Controllers\OPs;

use App\Http\Controllers\Controller;
use App\Models\OPInsumo;
use App\Models\OrdemDeProducao;
use App\Helpers\FuncoesAuxiliares;
use Illuminate\Http\Request;

class CriacaoInsumoController extends Controller
{
    public function criarInsumo(Request $request)
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

            $opinS     = $dados['insumosInseridos'];
            $idUsuario = (int) $request->user()->USU_ID;
            $user = $request->user();
            $abilities = $user->currentAccessToken()->abilities;
            $ability   = collect($abilities)->first(fn($a) => str_starts_with($a, 'empresa_'));
            $empresaId = str_replace('empresa_', '', $ability);

            if (!$opinS || count($opinS) === 0) {
                return;
            }

            foreach ($opinS as $opin) {
                $idOP = $opin['opOPIN'] ?? null;

                // Cria o insumo no banco
                OPInsumo::create([
                    'OPIN_UM'                => $opin['umOPIN'] ?? null,
                    'OPIN_QTD'               => (int) ($opin['qtdOPIN'] ?? null),
                    'OPIN_CUSTOU'            => (float) ($opin['custouOPIN'] ?? null),
                    'OPIN_CUSTOT'            => (float) ($opin['custotOPIN'] ?? null),
                    'PROD_ID'       => (int) ($opin['prodIdOPIN'] ?? null),
                    'OP_ID'   => $idOP,
                    'CLIFOR_ID' => is_numeric($opin['forOPIN'] ?? null) ? (int) $opin['forOPIN'] : null,
                    'NECESSITA_CLIFOR' => $opin['necessita_clifor'] ? 1 : 0
                ]);

                // Recalcula e atualiza os custos da OP
                $op       = OrdemDeProducao::where('OP_ID', $idOP)
                    ->where('USU_RESPONSAVEL', $idUsuario)
                    ->where('EMP_ID', $empresaId)
                    ->first();

                $custotOP = FuncoesAuxiliares::retornaCustotOP($idOP);
                $custouOP = $custotOP / $op->OP_QTD;

                OrdemDeProducao::where('OP_ID', $idOP)->update([
                    'OP_QTD'    => $op->OP_QTD,
                    'OP_CUSTOU' => $custouOP,
                    'OP_CUSTOT' => $custotOP,
                    'OP_QUEBRA' => $op->OP_QUEBRA
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
                'mensagem_de_erro' => 'Erro ao tentar criar insumo: ' . $e->getMessage()
            ], 500);
        }
    }
}
