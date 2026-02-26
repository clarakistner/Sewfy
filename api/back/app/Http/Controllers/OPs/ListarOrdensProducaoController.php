<?php

namespace App\Http\Controllers\OPs;

use App\Http\Controllers\Controller;
use App\Models\OrdemDeProducao;
use Illuminate\Http\Request;

// Controlador responsável por listar Ordens de Produção
class ListarOrdensProducaoController extends Controller
{
    // Método que lista todas as Ordens de Produção do usuário logado
    public function listarOPs(Request $request)
    {
        try {
            $idUsuario = (int) $request->session()->get('usuario_id');

            // Busca todas as Ordens de Produção do usuário
            $ops = OrdemDeProducao::where('USUARIOS_USU_ID', $idUsuario)->get();

            $listaResposta = [];

            // Itera sobre as ordens encontradas e monta a resposta
            foreach ($ops as $op) {
                $listaResposta[] = [
                    'OP_ID'      => $op->OP_ID,
                    'OP_DATAA'   => $op->OP_DATAA,
                    'OP_DATAE'   => $op->OP_DATAE,
                    'OP_CUSTOT'  => $op->OP_CUSTOT,
                    'OP_CUSTOU'  => $op->OP_CUSTOU,
                    'OP_CUSTOUR' => $op->OP_CUSTOUR,
                    'OP_QTD'     => $op->OP_QTD,
                    'OP_QTDE'    => $op->OP_QTDE,
                    'PRODUTO_ID' => $op->PRODUTOS_PROD_ID,
                    'OP_QUEBRA'  => $op->OP_QUEBRA
                ];
            }

            return response()->json([
                'sucesso'         => true,
                'erro'            => false,
                'ordensProducao'  => $listaResposta
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