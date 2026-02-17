<?php

if (session_status() === PHP_SESSION_NONE) {
            session_start();
}

require_once __DIR__ . '/../../model/config/BancoDeDados.php';
require_once __DIR__ . '/../../model/DAOs/FornecedorDAO.php';
require_once __DIR__ . '/../../model/entidades/Fornecedor.php';

class CadastroFornecedorController {

    private FornecedorDAO $fornecedorDAO;

    public function __construct() {
        $conn = conecta_bd();
        $this->fornecedorDAO = new FornecedorDAO($conn);
    }

    public function cadastrarFornecedor(): void {
        header('Content-Type: application/json; charset=utf-8');

        if (empty($_SESSION['usuario_id'])) {
            http_response_code(401);
            echo json_encode(['erro' => 'Usuário não autenticado']);
            return;
        }

        $data = json_decode(file_get_contents("php://input"), true);

        if (
            empty($data['nome']) ||
            empty($data['cpfCnpj']) ||
            empty($data['telefone']) ||
            empty($data['endereco'])
        ) {
            http_response_code(400);
            echo json_encode(['erro' => 'Dados obrigatórios não enviados']);
            return;
        }

        $usuarioId = (int) $_SESSION['usuario_id'];

        $cpfCnpjNumerico  = preg_replace('/\D/', '', $data['cpfCnpj']);
        $telefoneNumerico = preg_replace('/\D/', '', $data['telefone']);

        if ($this->fornecedorDAO->buscarFornecedoresPorNomeOuCpfCnpj(
            $cpfCnpjNumerico,
            $usuarioId
        )) {
            http_response_code(409);
            echo json_encode(['erro' => 'CPF/CNPJ já cadastrado']);
            return;
        }

        $fornecedor = new Fornecedor();
        $fornecedor->setUsuarioId($usuarioId);
        $fornecedor->setNome(trim($data['nome']));
        $fornecedor->setCpfCnpj($cpfCnpjNumerico);
        $fornecedor->setTelefone($telefoneNumerico);
        $fornecedor->setEndereco(trim($data['endereco']));
        $fornecedor->setAtivo(1);

        $id = $this->fornecedorDAO->criarFornecedor($fornecedor);

        if ($id > 0) {
            http_response_code(201);
            echo json_encode([
                'mensagem' => 'Fornecedor cadastrado com sucesso',
                'id' => $id
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['erro' => 'Erro ao cadastrar fornecedor']);
        }
    }
}


?>