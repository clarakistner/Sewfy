<?php

// Importa as classes necessárias do sistema
require_once __DIR__ . "/../../model/DAOs/OrdemDeProducaoDAO.php";
require_once __DIR__ . "/../../model/entidades/OrdemDeProducao.php";
require_once __DIR__ . "/../../model/config/BancoDeDados.php";

// Inicia sessão se ainda não foi iniciada
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Controlador responsável por listar Ordens de Produção
class ListarOrdensProducaoController
{
    private $opDAO;
    private $op;

    // Construtor que inicializa a conexão com o DAO
    public function __construct()
    {
        $conn = conecta_bd();
        $this->op = new OrdemDeProducao();
        $this->opDAO = new OrdemDeProducaoDAO($conn);
    }

    // Método que lista todas as Ordens de Produção do usuário logado
    public function listarOPs()
    {
        try {
            // Busca todas as Ordens de Produção do banco
            $OPs = $this->opDAO->buscarOPs();
            $listaResposta = [];

            // Itera sobre as ordens encontradas
            foreach ($OPs as $op) {
                // Filtra apenas as ordens do usuário logado
                if ($op->getUSUARIOS_USU_ID() === $_SESSION['usuario_id']) {
                    // Monta array com os dados da ordem
                    $respostaOP = [
                        'OP_ID' => $op->getOP_ID(),
                        'OP_DATAA' => $op->getOP_DATAA(),
                        'OP_DATAE' => $op->getOP_DATAE(),
                        'OP_CUSTOT' => $op->getOP_CUSTOT(),
                        'OP_CUSTOU' => $op->getOP_CUSTOU(),
                        'OP_CUSTOUR' => $op->getOP_CUSTOUR(),
                        'OP_QTD' => $op->getOP_QTD(),
                        'OP_QTDE' => $op->getOP_QTDE(),
                        'PRODUTO_ID' => $op->getPRODUTOS_PROD_ID(),
                        'OP_QUEBRA' => $op->getOP_QUEBRA()
                    ];

                    // Adiciona ordem à lista de resposta
                    $listaResposta[] = $respostaOP;
                }
            }

            // Monta resposta de sucesso
            $response = [
                'sucesso' => true,
                'erro' => false,
                'ordensProducao' => $listaResposta
            ];

            echo json_encode($response);
        } catch (Exception $error) {
            // Trata erros e retorna mensagem de falha
            $response = [
                'sucesso' => false,
                'erro' => true,
                'resposta' => 'Erro ao listar ordens de produção: ' . $error
            ];
            echo json_encode($response);
        }
    }
}

?>