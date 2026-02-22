<?php
require_once __DIR__ . '/../../model/config/BancoDeDados.php';
require_once __DIR__ . '/../../model/DAOs/OPInsumoDAO.php';
require_once __DIR__ . '/../../model/entidades/OPInsumo.php';
require_once __DIR__ . '/../../model/DAOs/OrdemDeProducaoDAO.php';
require_once __DIR__ . '/FuncoesAuxiliares.php';
class CriacaoInsumoController
{
    private $opinDAO;
    private $opDAO;

    public function __construct()
    {
        $conn = conecta_bd();
        $this->opinDAO = new OPInsumoDAO($conn);
        $this->opDAO = new OrdemDeProducaoDAO($conn);
    }

    public function criarInsumo()
    {
        try {
            $request = file_get_contents('php://input');
            $dados = json_decode($request, true);

            if (!$dados) {
                http_response_code(400);
                $response = [
                    'sucesso' => false,
                    'erro' => true,
                    'mensagem_de_erro' => 'Dados inválidos ou ausentes!'
                ];
                echo json_encode($response);
                return;
            }

            $idUsuario = (int) $_SESSION['usuario_id'];
            $um = $dados['UM'] ?? null;
            $qtd = $dados['QTD'] ?? null;
            $idFor = $dados['IDFOR'] ?? null;
            $idProd = $dados['IDPROD'] ?? null;
            $idOP = $dados['IDOP'] ?? null;
            $custou = $dados['CUSTOU'] ?? null;
            $custot = $dados['CUSTOT'] ?? null;
            $opin = new OPInsumo();
            $opin->setFORNECEDORES_CLIFOR_ID(is_numeric($idFor) ? (int) $idFor : null);
            $opin->setOPIN_CUSTOT((float) $custot);
            $opin->setOPIN_CUSTOU((float) $custou);
            $opin->setOPIN_QTD((int) $qtd);
            $opin->setOPIN_UM($um);
            $opin->setORDEM_PRODUCAO_OP_ID($idOP);
            $opin->setPRODUTOS_PROD_ID((int) $idProd);

            $this->opinDAO->criarOpInsumo($opin);
            $op = $this->opDAO->buscarOPPorID($idOP, $idUsuario);

            $qtdOP = $op->getOP_QTD();
            $custotOP = retornaCustotOP($idOP);
            $custouOP = $custotOP / $qtdOP ;
            $quebra = $op->getOP_QUEBRA();

            $this->opDAO->editarOP($custotOP, $custouOP, $quebra, $qtdOP, $idOP);
            $response = [
                'sucesso' => true,
                'erro' => false,

            ];
            echo json_encode($response);
        } catch (Exception $error) {
            $response = [
                'sucesso' => false,
                'erro' => true,
                'mensagem_de_erro' => 'Erro ao tentar criar insumo: ' . $error
            ];
            echo json_encode($response);
        }
    }
}
