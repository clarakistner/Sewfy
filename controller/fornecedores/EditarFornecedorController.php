<?php

session_start();

require_once __DIR__ . '/../../model/config/BancoDeDados.php';
require_once __DIR__ . '/../../model/DAOs/FornecedorDAO.php';
require_once __DIR__ . '/../../model/Entidades/Fornecedor.php';

class EditarFornecedorController
{
    private FornecedorDAO $fornecedorDAO;

    public function __construct()
    {
        $conn = conecta_bd();
        $this->fornecedorDAO = new FornecedorDAO($conn);
    }

    public function editarFornecedor(): void
    {
        header('Content-Type: text/plain; charset=utf-8');

        // Só aceita POST
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo "Método não permitido";
            return;
        }

        // Autenticação
        if (empty($_SESSION['usuario_id'])) {
            http_response_code(401);
            echo "Usuário não autenticado";
            return;
        }

        // Campos obrigatórios
        if (
            empty($_POST['id']) ||
            empty($_POST['nome']) ||
            empty($_POST['cpfCnpj']) ||
            empty($_POST['telefone']) ||
            empty($_POST['endereco']) ||
            !isset($_POST['ativo'])
        ) {
            http_response_code(400);
            echo "Dados obrigatórios não enviados";
            return;
        }

        $id        = (int) $_POST['id'];
        $usuarioId = (int) $_SESSION['usuario_id'];

        // Normalização dos dados
        $nome               = trim($_POST['nome']);
        $cpfCnpjNumerico    = preg_replace('/\D/', '', $_POST['cpfCnpj']);
        $telefoneNumerico   = preg_replace('/\D/', '', $_POST['telefone']);
        $endereco           = trim($_POST['endereco']);
        $ativo              = ($_POST['ativo'] == 1) ? 1 : 0;

        // Validação de CPF/CNPJ (existente no banco, mas diferente do atual)
       $fornecedorAtual = $this->fornecedorDAO
            ->buscarFornecedorPorId($id, $usuarioId);

        $cpfAntigo = preg_replace('/\D/', '', $fornecedorAtual->getCpfCnpj());

        if ($cpfAntigo !== $cpfCnpjNumerico) {
            if ($this->fornecedorDAO->cpfCnpjJaExisteParaOutroFornecedor(
                $cpfCnpjNumerico,
                $usuarioId,
                $id
            )) {
                http_response_code(409);
                echo "CPF/CNPJ já cadastrado para outro fornecedor";
                return;
            }
        }


        // Entidade
        $fornecedor = new Fornecedor();
        $fornecedor->setId($id);
        $fornecedor->setUsuarioId($usuarioId);
        $fornecedor->setNome($nome);
        $fornecedor->setCpfCnpj($cpfCnpjNumerico); // só números
        $fornecedor->setTelefone($telefoneNumerico);
        $fornecedor->setEndereco($endereco);
        $fornecedor->setAtivo($ativo);

        // Persistência
        if ($this->fornecedorDAO->atualizarFornecedor($fornecedor)) {
            http_response_code(200);
            echo "Fornecedor atualizado com sucesso";
        } else {
            http_response_code(500);
            echo "Erro ao atualizar fornecedor";
        }
    }
}

// Execução
$controller = new EditarFornecedorController();
$controller->editarFornecedor();

?>