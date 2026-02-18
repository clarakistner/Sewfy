<?php

// Importa as classes necessárias do sistema
require_once __DIR__ . "/../../model/DAOs/OrdemDeProducaoDAO.php";
require_once __DIR__ . "/../../model/DAOs/OPInsumoDAO.php";
require_once __DIR__ . "/../../model/entidades/OrdemDeProducao.php";
require_once __DIR__ . "/../../model/entidades/OPInsumo.php";
require_once __DIR__ . "/../../model/config/BancoDeDados.php";

// Inicia sessão se ainda não foi iniciada
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Controlador responsável pela criação de Ordens de Produção
class CriacaoOrdemDeProducaoController
{
    private $opDAO;
    private $opinDAO;

    // Construtor que inicializa as conexões com os DAOs
    public function __construct()
    {
        $conn = conecta_bd();
        $this->opDAO = new OrdemDeProducaoDAO($conn);
        $this->opinDAO = new OPInsumoDAO($conn);
    }

    // Método principal que cria a Ordem de Produção e seus Insumos
    public function criarOP_OPIs()
    {
        try {
            // Lê o JSON enviado na requisição
            $json = file_get_contents('php://input');
            $dados = json_decode($json, true);

            // Valida se os dados foram recebidos corretamente
            if (!$dados) {
                http_response_code(400);
                echo json_encode([
                    'sucesso' => false,
                    'erro' => "Dados inválidos ou ausentes"
                ]);
                return;
            }

            // Extrai os dados da Ordem de Produção
            $qtdProd = $dados['OP_QTD'] ?? null;
            $dataa = $dados['OP_DATAA'] ?? null;
            $usuarioId = $_SESSION['usuario_id'] ?? null;
            $produtoId = $dados['PROD_ID'] ?? null;
            $custouOP = $dados['OP_CUSTOU'] ?? null;
            $custotOP = $dados['OP_CUSTOT'] ?? null;

            // Cria e configura o objeto da Ordem de Produção
            $op = new OrdemDeProducao();
            $op->setOP_CUSTOT($custotOP);
            $op->setOP_CUSTOU($custouOP);
            $op->setOP_DATAA($dataa);
            $op->setOP_QTD($qtdProd);
            $op->setUSUARIOS_USU_ID($usuarioId);
            $op->setPRODUTOS_PROD_ID($produtoId);

            // Gera ID único para a Ordem de Produção
            $numero = $this->opDAO->contaOPs($usuarioId) + 1;
            $idOp = 'OP0'.$usuarioId.'00'.$numero;
            $op->setOP_ID($idOp);

            // Persiste a Ordem de Produção no banco
            $this->opDAO->criarOP($op);

            // Extrai lista de insumos
            $insumos = $dados['INSUMOS'] ?? null;

            // Itera sobre cada insumo e persiste no banco
            foreach ($insumos as $ins) {
                $insumo = new OPInsumo();
                $insumo->setFORNECEDORES_CLIFOR_ID($ins['IDFORNECEDOR']);
                $insumo->setOPIN_CUSTOT($ins['CUSTOT']);
                $insumo->setOPIN_CUSTOU($ins['CUSTOU']);
                $insumo->setOPIN_QTD($ins['QTDIN']);
                $insumo->setOPIN_UM($ins["UM"]);
                $insumo->setPRODUTOS_PROD_ID($ins['INSUID']);
                $insumo->setORDEM_PRODUCAO_OP_ID($idOp);
                $this->opinDAO->criarOpInsumo($insumo);
            }

            // Retorna resposta de sucesso
            $response = [
                'sucesso' => true,
                'erro' => "false"
            ];
            echo json_encode($response);
        } catch (Exception $e) {
            // Trata erros e retorna código 500
            http_response_code(500);
            echo json_encode([
                'status' => "erro",
                'erro' => $e->getMessage()
            ]);
        }
    }
}

?>