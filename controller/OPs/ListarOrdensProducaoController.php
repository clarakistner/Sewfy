<?php
require_once __DIR__ . "/../../model/DAOs/OrdemDeProducaoDAO.php";
require_once __DIR__ . "/../../model/entidades/OrdemDeProducao.php";
require_once __DIR__ . "/../../model/config/BancoDeDados.php";
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
class ListarOrdensProducaoController
{
    private $opDAO;
    private $op;

    public function __construct()
    {
        $conn = conecta_bd();
        $this->op = new OrdemDeProducao();
        $this->opDAO = new OrdemDeProducaoDAO($conn);
    }

    public function listarOPs()
    {
        try {

            $OPs = $this->opDAO->buscarOPs();
            $listaResposta = [];
            foreach ($OPs as $op) {
                if ($op->getUSUARIOS_USU_ID() === $_SESSION['usuario_id']) {
                    $respostaOP = [
                        'OP_ID' => $op->getOP_ID(),
                        'OP_DATAA'=> $op->getOP_DATAA(),
                        'OP_DATAE'=>$op->getOP_DATAE(),
                        'OP_CUSTOT'=>$op->getOP_CUSTOT(),
                        'OP_CUSTOU'=>$op->getOP_CUSTOU(),
                        'OP_CUSTOUR'=>$op->getOP_CUSTOUR(),
                        'OP_QTD'=>$op->getOP_QTD(),
                        'OP_QTDE'=>$op->getOP_QTDE(),
                        'PRODUTO_ID'=>$op->getPRODUTOS_PROD_ID(),
                        'OP_QUEBRA'=>$op->getOP_QUEBRA()
                    ];
                    $listaResposta[] = $respostaOP;

                }

            }
            $response = [
                'sucesso' => true,
                'erro'=> false,
                'ordensProducao'=>$listaResposta
            ];

            echo json_encode($response);

        } catch (Exception $error) {
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