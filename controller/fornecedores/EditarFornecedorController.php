<?php

if (session_status() === PHP_SESSION_NONE) {
            session_start();
}

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

    public function editarFornecedor(int $id): void
    {
        header('Content-Type: application/json; charset=utf-8');

        try {

            if (empty($_SESSION['usuario_id'])) {
                http_response_code(401);
                echo json_encode(['erro' => 'Usuário não autenticado']);
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
                empty($data['cpfCnpj']) ||
                empty($data['telefone']) ||
                empty($data['endereco']) ||
                !isset($data['ativo'])
            ) {
                http_response_code(400);
                echo json_encode(['erro' => 'Dados obrigatórios não enviados']);
                return;
            }

            $usuarioId = (int) $_SESSION['usuario_id'];

            $nome = trim($data['nome']);
            $cpfCnpjNumerico = preg_replace('/\D/', '', $data['cpfCnpj']);
            $telefoneNumerico = preg_replace('/\D/', '', $data['telefone']);
            $endereco = trim($data['endereco']);
            $ativo = $data['ativo'] ? 1 : 0;

            $fornecedorAtual = $this->fornecedorDAO
                ->buscarFornecedorPorId($id, $usuarioId);

            if (!$fornecedorAtual) {
                http_response_code(404);
                echo json_encode(['erro' => 'Fornecedor não encontrado']);
                return;
            }

            $cpfAntigo = preg_replace('/\D/', '', $fornecedorAtual->getCpfCnpj());

            if ($cpfAntigo !== $cpfCnpjNumerico) {
                if ($this->fornecedorDAO->cpfCnpjJaExisteParaOutroFornecedor(
                    $cpfCnpjNumerico,
                    $usuarioId,
                    $id
                )) {
                    http_response_code(409);
                    echo json_encode(['erro' => 'CPF/CNPJ já cadastrado para outro fornecedor']);
                    return;
                }
            }

            $fornecedor = new Fornecedor();
            $fornecedor->setId($id);
            $fornecedor->setUsuarioId($usuarioId);
            $fornecedor->setNome($nome);
            $fornecedor->setCpfCnpj($cpfCnpjNumerico);
            $fornecedor->setTelefone($telefoneNumerico);
            $fornecedor->setEndereco($endereco);
            $fornecedor->setAtivo($ativo);

            if ($this->fornecedorDAO->atualizarFornecedor($fornecedor)) {
                http_response_code(200);
                echo json_encode([
                    'mensagem' => 'Fornecedor atualizado com sucesso'
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['erro' => 'Erro ao atualizar fornecedor']);
            }

        } catch (Throwable $e) {
            error_log('Erro ao editar fornecedor: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['erro' => 'Erro interno']);
        }
    }
}