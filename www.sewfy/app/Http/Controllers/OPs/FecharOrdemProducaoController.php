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
                'opID' => 'required|string'
            ]);
            $idUsuario = (int) $request->user()->USU_ID;
            $user = $request->user();
            $abilities = $user->currentAccessToken()->abilities;
            $ability   = collect($abilities)->first(fn($a) => str_starts_with($a, 'empresa_'));
            $empresaId = str_replace('empresa_', '', $ability);

            OrdemDeProducao::where('USU_RESPONSAVEL', $idUsuario)
                ->where("EMP_ID", $empresaId)
                ->where(
                    "OP_ID",
                    $request->opID
                )
                ->update(['OP_DATAE' => now(), 'OP_STATUS' => 'fechada']);

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
