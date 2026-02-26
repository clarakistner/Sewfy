<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/../../model/config/BancoDeDados.php';
require_once __DIR__ . '/../../model/DAOs/EmpresaDAO.php';
require_once __DIR__ . '/../../model/Entidades/Empresa.php';

class EditarEmpresaController
{

    private EmpresaDAO $empresaDAO;

    public function __construct(){
        $conn = conecta_bd();
        $this->empresaDAO = new EmpresaDAO($conn);
    }


    public function editarEmpresa(int $id): void
    {
        header('Content-Type: application/json; charset=utf-8');
        try {
            if (empty($_SESSION['ADM_ID'])) {
                http_response_code(401);
                echo json_encode(['erro' => 'Acesso restrito a administradores']);
                return;
            }

            $id = (int) $id;

            if ($id <= 0) {
                http_response_code(400);
                echo json_encode(['erro' => 'ID inválido']);
                return;
            }

            $data = json_decode(file_get_contents("php://input"), true);

            if (
                empty($data['nome']) ||
                empty($data['razao']) ||
                empty($data['cnpj']) ||
                empty($data['email']) ||
                empty($data['numero']) ||
                !isset($data['ativo'])
            ) {
                http_response_code(400);
                echo json_encode(['erro' => 'Dados obrigatórios não enviados']);
                return;
            }

            $nome = trim($data['nome']);
            $razao = trim($data['razao']);
            $cnpjNumerico = preg_replace('/\D/', '', $data['cnpj']);
            $email = trim($data['email']);
            $numNumerico = preg_replace('/\D/', '', $data['numero']);
            $ativo = $data['ativo'] ? 1 : 0;
            
            $empresaAtual = $this->empresaDAO->buscarEmpresaPorId($id);

            if (!$empresaAtual) {
                http_response_code(404);
                echo json_encode(['erro' => 'Empresa não encontrada']);
                return;
            }

            $cnpjAntigo = preg_replace('/\D/', '', $empresaAtual->getEMP_CNPJ());

            if ($cnpjAntigo !== $cnpjNumerico) {

                if ($this->empresaDAO->cnpjJaExisteParaOutraEmpresa(
                    $cnpjNumerico,
                    $id
                )) {
                    http_response_code(409);
                    echo json_encode(['erro' => 'CNPJ já cadastrado para outra empresa']);
                    return;
                }
            }

            $empresa = new Empresa();
            $empresa->setEMP_Id($id);
            $empresa->setEMP_NOME($nome);
            $empresa->setEMP_RAZ($razao);
            $empresa->setEMP_CNPJ($cnpjNumerico);
            $empresa->setEMP_EMAIL($email);
            $empresa->setEMP_NUM($numNumerico);
            $empresa->setEMP_ATIV($ativo);

            if ($this->empresaDAO->editarEmpresa($empresa)) {
                http_response_code(200);
                echo json_encode([
                    'mensagem' => 'Empresa atualizada com sucesso'
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['erro' => 'Erro ao atualizar empresa']);
            }

        } catch (Throwable $e) {
            error_log('Erro ao editar empresa: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['erro' => 'Erro interno']);
        }
    }

}

