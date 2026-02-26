<?php

namespace App\Http\Controllers\OPs;

use App\Http\Controllers\Controller;
use App\Models\OrdemDeProducao;
use App\Models\OPInsumo;
use Illuminate\Http\Request;

// Controlador responsável pela criação de Ordens de Produção
class CriacaoOrdemDeProducaoController extends Controller
{
    // Método principal que cria a Ordem de Produção e seus Insumos
    public function criarOP_OPIs(Request $request)
    {
        try {
            $dados = $request->json()->all();

            // Valida se os dados foram recebidos corretamente
            if (!$dados) {
                return response()->json([
                    'sucesso' => false,
                    'erro' => 'Dados inválidos ou ausentes'
                ], 400);
            }

            // Extrai os dados da Ordem de Produção
            $usuarioId = $request->session()->get('usuario_id');
            $qtdProd   = $dados['OP_QTD'] ?? null;
            $dataa     = $dados['OP_DATAA'] ?? null;
            $produtoId = $dados['PROD_ID'] ?? null;
            $custouOP  = $dados['OP_CUSTOU'] ?? null;
            $custotOP  = $dados['OP_CUSTOT'] ?? null;

            // Gera ID único para a Ordem de Produção
            $numero = OrdemDeProducao::where('USUARIOS_USU_ID', $usuarioId)->count() + 1;
            $idOp = 'OP0' . $usuarioId . '00' . $numero;

            // Persiste a Ordem de Produção no banco
            OrdemDeProducao::create([
                'OP_ID'            => $idOp,
                'OP_QTD'           => $qtdProd,
                'OP_DATAA'         => $dataa,
                'OP_CUSTOU'        => $custouOP,
                'OP_CUSTOT'        => $custotOP,
                'USUARIOS_USU_ID'  => $usuarioId,
                'PRODUTOS_PROD_ID' => $produtoId
            ]);

            // Extrai e persiste os insumos da OP
            $insumos = $dados['INSUMOS'] ?? [];
            foreach ($insumos as $ins) {
                OPInsumo::create([
                    'OPIN_UM'                => $ins['UM'],
                    'OPIN_QTD'               => $ins['QTDIN'],
                    'OPIN_CUSTOU'            => $ins['CUSTOU'],
                    'OPIN_CUSTOT'            => $ins['CUSTOT'],
                    'PRODUTOS_PROD_ID'       => $ins['INSUID'],
                    'ORDEM_PRODUCAO_OP_ID'   => $idOp,
                    'FORNECEDORES_CLIFOR_ID' => $ins['IDFORNECEDOR']
                ]);
            }

            // Retorna resposta de sucesso
            return response()->json([
                'sucesso' => true,
                'erro'    => false
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'erro',
                'erro'   => $e->getMessage()
            ], 500);
        }
    }
}