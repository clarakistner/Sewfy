<?php

namespace App\Http\Controllers\OPs;

use App\Http\Controllers\Controller;
use App\Models\OrdemDeProducao;
use App\Helpers\FuncoesAuxiliares;
use Illuminate\Http\Request;

class EditarOrdemProducaoController extends Controller
{
    public function editarOP(Request $request)
    {
        try {
            $dados = $request->json()->all();

            if (!$dados) {
                return response()->json([
                    'sucesso'          => false,
                    'erro'             => true,
                    'mensagem_de_erro' => 'Dados inválidos ou inexistentes!'
                ], 400);
            }

            $op    = $dados['OP'] ?? null;
            $idOP  = $op['idOP'];

            // Recalcula o custo total a partir dos insumos
            $custot = (float) FuncoesAuxiliares::retornaCustotOP($idOP);

            $qtd    = $dados['NovaQtdOP'] ?: (int) $op['qtdOP'];
            $custou = $custot / $qtd;
            

            // Atualiza a OP no banco
            OrdemDeProducao::where('OP_ID', $idOP)->update([
                'OP_QTD'    => $qtd,
                'OP_CUSTOU' => $custou,
                'OP_CUSTOT' => $custot
            ]);

            return response()->json([
                'sucesso' => true,
                'erro'    => false
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'sucesso'          => false,
                'erro'             => true,
                'mensagem_de_erro' => 'Erro ao tentar editar a ordem de produção: ' . $e->getMessage()
            ], 500);
        }
    }
}