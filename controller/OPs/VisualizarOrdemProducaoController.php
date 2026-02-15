<?php

// Importa as classes necessárias do sistema
require_once __DIR__ . "/../../model/DAOs/OrdemDeProducaoDAO.php";
require_once __DIR__ . "/../../model/DAOs/OPInsumoDAO.php";
require_once __DIR__ . "/../../model/entidades/OrdemDeProducao.php";
require_once __DIR__ . "/../../model/entidades/OPInsumo.php";
require_once __DIR__ . "/../../model/config/BancoDeDados.php";
class VisualizarOrdemProducaoController
{
    private $opDAO;
    private $opinDAO;

    public function __construct()
    {
        $conn = conecta_bd();
        $this->opDAO = new OrdemDeProducaoDAO($conn);
        $this->opinDAO = new OPInsumoDAO($conn);
    }

    public function visualizarOP($id)
    {
        try {

            $idUsuario = (int) $_SESSION['usuario_id'];
            // Busca a OP
            $op = $this->opDAO->buscarOPPorId($id, $idUsuario);
            $opResposta = [
                'idOP' => $op->getOP_ID(),
                'prodIDOP' => $op->getPRODUTOS_PROD_ID(),
                'dataa' => $op->getOP_DATAA(),
                'datae' => $op->getOP_DATAE(),
                'custot' => $op->getOP_CUSTOT(),
                'custou' => $op->getOP_CUSTOU(),
                'custour' => $op->getOP_CUSTOUR(),
                'qtdOP' => $op->getOP_QTD(),
                'qtdeOP' => $op->getOP_QTDE(),
                'usuarioIDOP' => $op->getUSUARIOS_USU_ID(),
                'quebra' => $op->getOP_QUEBRA(),
            ];
            // Busca os insumos da OP
            $opinS = $this->opinDAO->buscaInsumos($op->getOP_ID());
            $opinSResposta = [];
            foreach ($opinS as $opin) {
                $opinSResposta[] = [
                    'idOPIN' => $opin->getOPIN_ID(),
                    'forOPIN' => $opin->getFORNECEDORES_CLIFOR_ID(),
                    'custotOPIN' => $opin->getOPIN_CUSTOT(),
                    'custouOPIN' => $opin->getOPIN_CUSTOU(),
                    'qtdOPIN' => $opin->getOPIN_QTD(),
                    'umOPIN' => $opin->getOPIN_UM(),
                    'opOPIN' => $opin->getORDEM_PRODUCAO_OP_ID(),
                    'prodIdOPIN' => $opin->getPRODUTOS_PROD_ID(),
                ];
            }

            $response = [
                'sucesso'=> true,
                'erro'=> false,
                'op'=> $opResposta,
                'opinS' => $opinSResposta
            ];
            echo json_encode($response);
        } catch (Exception $error) {
            $response = [
                'sucesso' => false,
                'erro' => true,
                'mensagem de erro' => 'Erro ao tentar visualizar ordem de produção: ' . $error
            ];
            echo json_encode($response);
        }
    }
}
