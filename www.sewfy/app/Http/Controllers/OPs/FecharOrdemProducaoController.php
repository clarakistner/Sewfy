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
                'opID'   => 'required|string',
                'quebra' => 'required|numeric|min:0'
            ]);

            $empresaId = $request->empresa->EMP_ID;

            $op = OrdemDeProducao::where('OP_ID', $request->opID)
                ->where('EMP_ID', $empresaId)
                ->first();

            if (!$op) {
                return response()->json([
                    'sucesso'  => false,
                    'erro'     => true,
                    'resposta' => 'Ordem de produção não encontrada'
                ], 404);
            }

            $quebra = (int) $request->quebra;
            $qtde   = (int) $op->OP_QTD - $quebra;

            $opins = OPInsumo::where('OP_ID', $request->opID)
                ->where('NECESSITA_CLIFOR', 1)
                ->get();

            $idOPNumero = preg_replace('/\D/', '', $request->opID);
            $last       = ContaPagar::lockForUpdate()
                ->orderByRaw('"CP_ID" DESC')
                ->value('CP_ID');

            $lastNumber = (int) substr($last ?? '0', strrpos($last ?? '0', '-') + 1);

            $dados = $opins->map(fn($opin, $index) => [
                'EMP_ID'    => $empresaId,
                'OPIN_ID'   => $opin->OPIN_ID,
                'OP_ID'     => $op->OP_ID,
                'CLIFOR_ID' => $opin->CLIFOR_ID,
                'CP_VALOR'  => $opin->OPIN_CUSTOT,
                'CP_DATAE'  => now(),
                'CP_DATAV'  => Carbon::parse($opin->OPIN_DATAE)->addMonth()->toDateString(),
                'CP_STATUS' => 'pendente',
                'USU_ID'    => $request->user()->USU_ID,
                'CP_ID'     => 'CP' . $idOPNumero . '-' . str_pad($lastNumber + $index + 1, 6, '0', STR_PAD_LEFT)
            ])->toArray();

            ContaPagar::insert($dados);

            OrdemDeProducao::where('OP_ID', $request->opID)
                ->where('EMP_ID', $empresaId)
                ->update([
                    'OP_DATAE'   => now(),
                    'OP_STATUS'  => 'fechada',
                    'OP_QTDE'    => $qtde,
                    'OP_QUEBRA'  => (float) number_format(($quebra / (int) $op->OP_QTD) * 100, 2, '.', ''),
                    'OP_CUSTOUR' => $qtde > 0 ? $op->OP_CUSTOT / $qtde : 0,
                ]);

            return response()->json([
                'sucesso'  => true,
                'erro'     => false,
                'mensagem' => 'Ordem de Produção fechada!'
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