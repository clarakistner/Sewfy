<?php

namespace App\Http\Controllers\OPs;

use App\Http\Controllers\Controller;
use App\Models\OrdemDeProducao;
use App\Models\OPInsumo;
use App\Helpers\FuncoesAuxiliares;
use Illuminate\Http\Request;

// Controlador responsável pela criação de Ordens de Produção
class CriacaoOrdemDeProducaoController extends Controller
{
    // Método principal que cria a Ordem de Produção e seus Insumos
    public function criarOP_OPIs(Request $request)
    {
        try {
            $dados = $request->json()->all();

            $user = $request->user();
            $abilities = $user->currentAccessToken()->abilities;
            $ability   = collect($abilities)->first(fn($a) => str_starts_with($a, 'empresa_'));
            $empresaId = str_replace('empresa_', '', $ability);
            // Valida se os dados foram recebidos corretamente
            if (!$dados) {
                return response()->json([
                    'sucesso' => false,
                    'erro' => 'Dados inválidos ou ausentes'
                ], 400);
            }

            // Extrai os dados da Ordem de Produção
            $usuarioId = $request->user()->USU_ID;
            $qtdProd   = $dados['OP_QTD'] ?? null;
            $dataa     = $dados['OP_DATAA'] ?? null;
            $produtoId = $dados['PROD_ID'] ?? null;
            $custouOP  = $dados['OP_CUSTOU'] ?? null;
            $custotOP  = $dados['OP_CUSTOT'] ?? null;

            $numero = OrdemDeProducao::where('USU_RESPONSAVEL', $usuarioId)
                ->where('EMP_ID', $empresaId)
                ->max('OP_CONTADOR') + 1;

            $idOp = 'OP0' . $usuarioId . '00' . $numero;

            // Persiste a Ordem de Produção no banco
            $op = OrdemDeProducao::create([
                'OP_ID'           => 'TEMP',
                'OP_QTD'          => $qtdProd,
                'OP_DATAA'        => $dataa,
                'OP_CUSTOU'       => $custouOP,
                'OP_CUSTOT'       => $custotOP,
                'USU_RESPONSAVEL' => $usuarioId,
                'PROD_ID'         => $produtoId,
                'EMP_ID'          => $empresaId,
            ]);

            $op->refresh();

            $idOp = 'OP0' . $usuarioId . '00' . $op->OP_CONTADOR;

            $op->OP_ID = $idOp;
            $op->save();

            // Extrai e persiste os insumos da OP
            $insumos = $dados['INSUMOS'] ?? [];

            OPInsumo::insert(array_map(fn($ins) => [
                'OPIN_UM'          => $ins['UM'],
                'OPIN_QTD'         => $ins['QTDIN'],
                'OPIN_CUSTOU'      => $ins['CUSTOU'],
                'OPIN_CUSTOT'      => $ins['CUSTOT'],
                'PROD_ID'          => $ins['INSUID'],
                'OP_ID'            => $idOp,
                'CLIFOR_ID'        => $ins['IDFORNECEDOR'],
                'NECESSITA_CLIFOR' => FuncoesAuxiliares::retornaNecessitaCliFor($ins['INSUID'], $empresaId)
            ], $insumos));

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
