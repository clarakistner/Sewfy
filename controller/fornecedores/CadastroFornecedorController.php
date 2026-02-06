<?php

session_start();

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

        header('Content-Type: text/plain; charset=utf-8');

        // Só aceita POST
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo "Método não permitido";
            return;
        }

        // Verifica autenticação
        if (empty($_SESSION['usuario_id'])) {
            http_response_code(401);
            echo "Usuário não autenticado";
            return;
        }

        // Validação básica
        if (
            empty($_POST['nome']) ||
            empty($_POST['cpfCnpj']) ||
            empty($_POST['telefone']) ||
            empty($_POST['endereco'])
        ) {
            http_response_code(400);
            echo "Dados obrigatórios não enviados";
            return;
        }

        $usuarioId = (int) $_SESSION['usuario_id'];

        // Normalização dos dados
        $cpfCnpjNumerico    = preg_replace('/\D/', '', $_POST['cpfCnpj']);
        $telefoneNumerico   = preg_replace('/\D/', '', $_POST['telefone']);

        // Evita duplicidade
        if ($this->fornecedorDAO->buscarFornecedoresPorNomeOuCpfCnpj(
            $cpfCnpjNumerico,
            $usuarioId
        )) {
            http_response_code(409);
            echo "CPF/CNPJ já cadastrado";
            return;
        }

        // Criação do objeto
        $fornecedor = new Fornecedor();
        $fornecedor->setUsuarioId($usuarioId);
        $fornecedor->setNome(trim($_POST['nome']));
        error_log("CPF/CNPJ recebido: " . $cpfCnpjNumerico);
        $fornecedor->setCpfCnpj($cpfCnpjNumerico);
        $fornecedor->setTelefone($telefoneNumerico);
        $fornecedor->setEndereco(trim($_POST['endereco']));
        $fornecedor->setAtivo(1); // SEMPRE int

        // Persistência
        $id = $this->fornecedorDAO->criarFornecedor($fornecedor);

        if ($id > 0) {
            http_response_code(201);
            echo "Fornecedor cadastrado com sucesso";
        } else {
            http_response_code(500);
            echo "Erro ao cadastrar fornecedor";
        }
    }
}

$controller = new CadastroFornecedorController();
$controller->cadastrarFornecedor();

?>