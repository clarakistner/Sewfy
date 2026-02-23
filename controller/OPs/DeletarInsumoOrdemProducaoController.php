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

    public function deletaInsumo()
    {
        try {

            $request =  file_get_contents('php://input');
            $dados = json_decode($request, true);

            if (!$dados) {
                $response =  [
                    'sucesso' => false,
                    'erro' => true,
                    'mensagem_de_erro' => 'Dados inválidos ou ausentes!'
                ];
                echo json_encode($response);
            }
            $opinS = $dados['insumosDeletados'] ?? null;
            $idUsuario = $_SESSION['usuario_id'];

            if(count($opinS) === 0 || !$opinS){
                return;
            }
            foreach ($opinS as $opin) {
                
                $insumo = $this->opinDAO->buscarInsumo((int) $opin);
                $op = $this->opDAO->buscarOPPorID( $insumo->getORDEM_PRODUCAO_OP_ID(), (int) $idUsuario);
                $this->opinDAO->deletarInsumo((int) $opin);
                $custotOP = retornaCustotOP($op->getOP_ID());
                $custouOP = $custotOP / $op->getOP_QTD();
                $this->opDAO->editarOP($custotOP, $custouOP, $op->getOP_QUEBRA(), $op->getOP_QTD(), $insumo->getORDEM_PRODUCAO_OP_ID());
            }
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
                'mensagem_de_erro' => 'Erro ao tentar deletar insumo: ' . $error
            ];
            echo json_encode($response);
        }
    }
}
