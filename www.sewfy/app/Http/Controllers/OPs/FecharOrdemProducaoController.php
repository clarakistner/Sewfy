<?php

namespace App\Http\Controllers\OPs;

use App\Http\Controllers\Controller;
use App\Models\OrdemDeProducao;
use App\Models\OPInsumo;
use App\Models\ContaPagar;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class FecharOrdemProducaoController extends Controller
{
    public function fecharOP(Request $request)
    {
        try {
            $request->validate([
                'opID' => 'required|string',
                'qtde' => 'required|numeric|min:0',
                'quebra' => 'required|numeric|min:0'

            ]);
            $idUsuario = (int) $request->user()->USU_ID;
            $user = $request->user();
            $abilities = $user->currentAccessToken()->abilities;
            $ability   = collect($abilities)->first(fn($a) => str_starts_with($a, 'empresa_'));
            $empresaId = str_replace('empresa_', '', $ability);
            $op = OrdemDeProducao::where('OP_ID', $request->opID)
                ->where('USU_RESPONSAVEL', $idUsuario)
                ->where('EMP_ID', $empresaId)
                ->first();
            $quebra = (int) $request->quebra;
            $qtde = (int) $request->qtde;
            OrdemDeProducao::where('USU_RESPONSAVEL', $idUsuario)
                ->where("EMP_ID", $empresaId)
                ->where(
                    "OP_ID",
                    $request->opID
                )
            ->update(['OP_DATAE' => now(), 'OP_STATUS' => 'fechada', 'OP_QTDE' => $qtde, 'OP_QUEBRA' => (float) number_format(($quebra ) / ((int) $op->OP_QTD) * 100, 2, '.', ''), 'OP_CUSTOUR' => $op->OP_CUSTOT / $qtde]);

             

            $opins = OPInsumo::where('OP_ID', $request->opID)
                ->where('NECESSITA_CLIFOR', 1)
                ->get();
            $dados = $opins->map(fn($opin) => [
                'EMP_ID'    => $empresaId,
                'CLIFOR_ID' => $opin->CLIFOR_ID,
                'CP_VALOR'  => $opin->OPIN_CUSTOT,
                'CP_DATAE'  => $opin->OPIN_DATAE,
                'CP_DATAV'  => Carbon::parse($opin->OPIN_DATAE)->addMonth()->toDateString(),
                'CP_STATUS' => 'pendente',
                'USU_ID'    => $user->USU_ID,
            ])->toArray();

            ContaPagar::insert($dados);


            return response()->json([
                'sucesso'         => true,
                'erro'            => false,
                'mensagem'  => 'Ordem de Produção fechada!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'sucesso'  => false,
                'erro'     => true,
                'resposta' => 'Erro ao tentar fechar ordem de produção: ' . $e->getMessage()
            ], 500);
        }
    }
}
