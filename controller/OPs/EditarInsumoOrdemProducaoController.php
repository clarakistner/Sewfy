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