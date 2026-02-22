<?php

require_once __DIR__ . '/../../model/config/BancoDeDados.php';
require_once __DIR__ . '/../../model/DAOs/OrdemDeProducaoDAO.php';
require_once __DIR__ . '/../../model/entidades/OrdemDeProducao.php';
require_once __DIR__ . '/FuncoesAuxiliares.php';
class EditarOrdemProducaoController
{
    private $opDAO;

    public function __construct()
    {
        $conn = conecta_bd();
        $this->opDAO = new OrdemDeProducaoDAO($conn);
    }

    public function editarOP()
    {
        try {
            $request = file_get_contents('php://input');
            $dados = json_decode($request, true);

            if (!$dados) {
                http_response_code(400);
                $response = [
                    'sucesso' => false,
                    'erro' => true,
                    'mensagem_de_erro' => 'Dados inválidos ou inexistentes!'
                ];
                echo json_encode($response);
            }

            $op = $dados['OP'] ?? null;
            $idOP = $op['idOP'];
            ///////////////////////////////////
            //Atualizar
            $custot = (float) retornaCustotOP($idOP);
           
            $qtd = $dados['NovaQtdOP'] ?: (int)$op['qtdOP'];
             //Atualizar
            $custou = $custot / $qtd;
            /////////////////////////////////
            $quebra = $dados['NovaQuebra'] ?: (float) $op['quebra'];
            
            $this->opDAO->editarOP($custot, $custou, $quebra, $qtd, $idOP);

            $response = [
                'sucesso' => true,
                'erro' => false
            ];
            echo json_encode($response);
        } catch (Exception $error) {
            $response = [
                'sucesso' => false,
                'erro' => true,
                'mensagem_de_erro' => 'Erro ao tentar editar a ordem de produção: ' . $error
            ];
            echo json_encode($response);
        }
    }
}
