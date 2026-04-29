<?php

namespace App\Http\Controllers\OPs;

use App\Http\Controllers\Controller;
use App\Models\OrdemDeProducao;
use Illuminate\Http\Request;
use App\Models\Produto;


class ListarOrdensProducaoController extends Controller
{
    public function retornaNome($id)
    {
        $prod = Produto::find($id);
        return $prod->PROD_NOME;
    }

    public function listarOPs(Request $request)
    {
        try {
            $empresaId = $request->empresa->EMP_ID;

            $ops = OrdemDeProducao::where('EMP_ID', $empresaId)
            ->when($request->filled('prod_id'), fn($q) =>
                $q->where('PROD_ID', $request->prod_id)
                ->orWhereHas('insumos', fn($qi) =>
                    $qi->where('PROD_ID', $request->prod_id)
                )
            )
            ->when($request->filled('status'), fn($q) =>
                $q->where('OP_STATUS', $request->status)
            )
            ->with('insumos')
            ->select('OP_ID', 'OP_DATAA', 'OP_DATAE', 'OP_STATUS', 'OP_CUSTOT', 'OP_CUSTOU', 'OP_CUSTOUR', 'OP_QTD', 'OP_QTDE', 'PROD_ID', 'OP_QUEBRA')
            ->get();

            $listaResposta = $ops->map(fn($op) => [
                'idOP'         => $op->OP_ID,
                'dataa'        => $op->OP_DATAA,
                'datae'        => $op->OP_DATAE,
                'status'       => $op->OP_STATUS,
                'custot'       => $op->OP_CUSTOT,
                'custou'       => $op->OP_CUSTOU,
                'custour'      => $op->OP_CUSTOUR,
                'qtdOP'        => $op->OP_QTD,
                'qtdeOP'       => $op->OP_QTDE,
                'prodIDOP'     => $op->PROD_ID,
                'nome_produto' => $this->retornaNome($op->PROD_ID),
                'quebra'       => $op->OP_QUEBRA,
                'qtdInsumo'    => $request->filled('prod_id') && $op->PROD_ID != $request->prod_id
                    ? optional($op->insumos->firstWhere('PROD_ID', $request->prod_id))->OPIN_QTD
                    : null,
                'umInsumo'     => $request->filled('prod_id') && $op->PROD_ID != $request->prod_id
                ? optional($op->insumos->firstWhere('PROD_ID', $request->prod_id))->OPIN_UM
                : null,
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