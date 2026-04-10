<?php

namespace App\Http\Controllers\OPs;

use App\Http\Controllers\Controller;
use App\Models\OrdemDeProducao;
use Illuminate\Http\Request;

class ListarOrdensProducaoController extends Controller
{
    public function listarOPs(Request $request)
    {
        try {
            $idUsuario = (int) $request->user()->USU_ID;
            $user = $request->user();
            $abilities = $user->currentAccessToken()->abilities;
            $ability = collect($abilities)->first(fn($a) => str_starts_with($a, 'empresa_'));
            $empresaId = str_replace('empresa_', '', $ability);

            $ops = OrdemDeProducao::where('USU_RESPONSAVEL', $idUsuario)
                ->where('EMP_ID', $empresaId)
                ->select('OP_ID', 'OP_DATAA', 'OP_DATAE', 'OP_CUSTOT', 'OP_CUSTOU', 'OP_CUSTOUR', 'OP_QTD', 'OP_QTDE', 'PROD_ID', 'OP_QUEBRA')
                ->get();

            $listaResposta = $ops->map(fn($op) => [
                'idOP'     => $op->OP_ID,
                'dataa'    => $op->OP_DATAA,
                'datae'    => $op->OP_DATAE,
                'custot'   => $op->OP_CUSTOT,
                'custou'   => $op->OP_CUSTOU,
                'custour'  => $op->OP_CUSTOUR,
                'qtdOP'    => $op->OP_QTD,
                'qtdeOP'   => $op->OP_QTDE,
                'prodIDOP' => $op->PROD_ID,
                'quebra'   => $op->OP_QUEBRA,
            ]);

            return response()->json([
                'sucesso'        => true,
                'erro'           => false,
                'ordensProducao' => $listaResposta
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'sucesso'  => false,
                'erro'     => true,
                'resposta' => 'Erro ao listar ordens de produção: ' . $e->getMessage()
            ], 500);
        }
    }
}