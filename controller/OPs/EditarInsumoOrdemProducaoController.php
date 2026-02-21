<?php
require_once __DIR__ . '/../../model/config/BancoDeDados.php';
require_once __DIR__ . '/../../model/DAOs/OPInsumoDAO.php';
require_once __DIR__ . '/../../model/entidades/OPInsumo.php';
class EditarInsumoOrdemProducaoController{
    private $opinDAO;
    public function __construct()
    {
        $conn = conecta_bd();
        $this->opinDAO = new OPInsumoDAO($conn);
    }
    public function editaOPIN()
    {
        try{
            $request = file_get_contents('php://input');
            $dados = json_decode($request, true);
            if(!$dados){
                http_response_code(400);
                $response = [
                    'sucesso' => false,
                    'erro' => true,
                    'mensagem_de_erro' => 'Dados inválidos ou ausentes!'
                ];
                echo json_encode($response);
            }

            $opins = $dados['insumos'] ?? null;
             
            if(!$opins || count($opins) === 0){
                return; 
            }
            foreach($opins as $opin){
                $idOPIN = $opin['idOPIN'];
                $insumoBanco = $this->opinDAO->buscarInsumo($idOPIN);

                $qtd = $opin['qtdInsumo'] ?? $insumoBanco->getOPIN_QTD();
                $idfor = $opin['idFor'] ?? $insumoBanco->getFORNECEDORES_CLIFOR_ID();

                $custot = $insumoBanco->getOPIN_CUSTOU() * $qtd;

                $this->opinDAO->editarInsumo($qtd, $custot, $idfor, $idOPIN);
            }

            $response = [
                'sucesso' => true,
                'erro' => false
            ];

            echo json_encode($response);
        }catch(Exception $error){
            $response = [
                'sucesso' => false,
                'erro' => true,
                'mensagem_de_erro' => 'Erro ao tentar editar insumo da OP: '.$error
            ];
            echo json_encode($response);
        }
    }
}

?>