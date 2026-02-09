<?php

session_start();
require_once __DIR__ . "../../model/DAOs/OrdemDeProducaoDAO.php";
require_once __DIR__ . "../../model/DAOs/OPInsumoDAO.php";
require_once __DIR__ . "../../model/entidades/OrdemDeProducao.php";
require_once __DIR__ . "../../model/DAOs/OPInsumoDAO.php";
require_once __DIR__ . "../../model/config/BancoDeDados.php";
class CriacaoOrdemDeProducao
{
    private $opDAO;
    private $opinDAO;
    public function __construct()
    {
        $conn = conecta_bd();
        $this->opDAO = new OrdemDeProducaoDAO($conn);
        $this->opinDAO = new OPInsumoDAO($conn);
    }
    public function criarOP_OPIs()
    {
        try {
            $json = file_get_contents('php://input');
            $dados = json_decode($json, true);
            if (!$dados) {
                http_response_code(400);
                echo json_encode([
                    'sucesso' => false,
                    'erro' => "Dados inválidos ou ausentes"
                ]);
                return;
            }

            $qtdProd = $dados['OP_QTD'] ?? null;
            $dataa = $dados['OP_DATAA'] ?? null;
            $usuarioId = $_SESSION['usuario_id'] ?? null;
            $produtoId = $dados['PROD_ID'] ?? null;
            $op = new OrdemDeProducao();
            $op->setOP_DATAA($dataa);
            $op->setOP_QTD($qtdProd);
            $op->setUSUARIOS_USU_ID($usuarioId);
            $op->setPRODUTOS_PROD_ID($produtoId);
            $idOp = $this->opDAO->criarOP($op);
            $insumos = $dados['INSUMOS'] ?? null;

            foreach ($insumos as $i) {
                $insumo = new OPInsumo();
                $insumo->setFORNECEDORES_CLIFOR_ID($i['FORNECEDOR']);
                $insumo->setOPIN_CUSTOT($i['CUSTOT']);
                $insumo->setOPIN_CUSTOU($i['CUSTOU']);
                $insumo->setOPIN_QTD($i['QTDIN']);
                $insumo->setOPIN_UM($i["UM"]);
                $insumo->setPRODUTOS_PROD_ID($i['INSUID']);
                $insumo->setORDEM_PRODUCAO_OP_ID($idOp);
                $this->opinDAO->criarOpInsumo($insumo);

            }
            $response = [
                'sucesso' => true,
                'erro' => "false"
            ];
            echo json_encode($response);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'status' => "erro",
                'erro' => $e->getMessage()
            ]);
        }
    }
}

?>