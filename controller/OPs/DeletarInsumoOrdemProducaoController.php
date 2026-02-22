<?php

require_once __DIR__ . '/../../model/DAOs/OPInsumoDAO.php';
require_once __DIR__ . '/../../model/entidades/OPInsumo.php';
require_once __DIR__ . '/../../model/DAOs/OrdemDeProducaoDAO.php';
require_once __DIR__ . '/../../model/entidades/OrdemDeProducao.php';
require_once __DIR__ . '/../../model/config/BancoDeDados.php';
require_once __DIR__ . '/FuncoesAuxiliares.php';
// Inicia sessão se ainda não foi iniciada
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
class DeletarInsumoOrdemProducaoController
{
    private $opinDAO;
    private $opDAO;

    public function __construct()
    {
        $conn = conecta_bd();
        $this->opinDAO = new OPInsumoDAO($conn);
        $this->opDAO = new OrdemDeProducaoDAO($conn);
    }

    public function deletaInsumo($idOPIN)
    {
        try {

            $opin = $this->opinDAO->buscarInsumo($idOPIN);
            $idOP = $opin->getORDEM_PRODUCAO_OP_ID();
            $idUsuario = $_SESSION['usuario_id'];
            $this->opinDAO->deletarInsumo($idOPIN);
            $op = $this->opDAO->buscarOPPorID($idOP, $idUsuario);
            $custotOP = retornaCustotOP($op->getOP_ID());
            $custouOP = $custotOP / $op->getOP_QTD();
            $this->opDAO->editarOP($custotOP, $custouOP, $op->getOP_QUEBRA(), $op->getOP_QTD(), $idOP);
            

            $response = [
                'sucesso' => true,
                'erro' => false,
                'resposta' => 'Insumo deletado!'
            ];
            echo json_encode($response);
        } catch (Exception $error) {
            $response = [
                'sucesso' => false,
                'erro' => true,
                'mensagem_de_erro' => 'Erro ao tentar deletar insumo: '.$error
            ];
            echo json_encode($response);
        }
    }
}
