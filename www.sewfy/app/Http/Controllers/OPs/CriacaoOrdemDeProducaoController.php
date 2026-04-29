<?php

namespace App\Http\Controllers\OPs;

use App\Http\Controllers\Controller;
use App\Models\OrdemDeProducao;
use App\Models\OPInsumo;
use App\Helpers\FuncoesAuxiliares;
use Illuminate\Http\Request;

class CriacaoOrdemDeProducaoController extends Controller
{
    public function criarOP_OPIs(Request $request)
    {
        try {
            $dados = $request->json()->all();

            $empresaId = $request->empresa->EMP_ID;

            if (!$dados) {
                return response()->json([
                    'sucesso' => false,
                    'erro'    => 'Dados inválidos ou ausentes'
                ], 400);
            }

            $usuarioId = $request->user()->USU_ID;
            $qtdProd   = $dados['OP_QTD']    ?? null;
            $dataa     = $dados['OP_DATAA']   ?? null;
            $produtoId = $dados['PROD_ID']    ?? null;
            $custouOP  = $dados['OP_CUSTOU']  ?? null;
            $custotOP  = $dados['OP_CUSTOT']  ?? null;

            $numero = OrdemDeProducao::where('EMP_ID', $empresaId)
                ->max('OP_CONTADOR') + 1;

            $idOp = 'OP' . $empresaId . str_pad($numero, 4, '0', STR_PAD_LEFT);

            $op = OrdemDeProducao::create([
                'OP_ID'           => $idOp,
                'OP_QTD'          => $qtdProd,
                'OP_DATAA'        => $dataa,
                'OP_CONTADOR'     => $numero,
                'OP_CUSTOU'       => $custouOP,
                'OP_CUSTOT'       => $custotOP,
                'USU_RESPONSAVEL' => $usuarioId,
                'PROD_ID'         => $produtoId,
                'EMP_ID'          => $empresaId,
            ]);

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