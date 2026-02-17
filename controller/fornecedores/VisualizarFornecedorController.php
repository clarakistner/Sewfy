<?php

require_once __DIR__ . '/../../model/config/BancoDeDados.php';
require_once __DIR__ . '/../../model/DAOs/FornecedorDAO.php';

if (session_status() === PHP_SESSION_NONE) {
            session_start();
}

class VisualizarFornecedorController
{
    private FornecedorDAO $fornecedorDAO;

    public function __construct()
    {
        $conn = conecta_bd();
        $this->fornecedorDAO = new FornecedorDAO($conn);
    }

    public function visualizar(int $id): void
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

            $usuarioId = (int) $_SESSION['usuario_id'];

            $fornecedor = $this->fornecedorDAO
                ->buscarFornecedorPorId($id, $usuarioId);

            if (!$fornecedor) {
                http_response_code(404);
                echo json_encode(['erro' => 'Fornecedor não encontrado']);
                return;
            }

            http_response_code(200);

            echo json_encode([
                'id'       => $fornecedor->getId(),
                'nome'     => $fornecedor->getNome(),
                'cpfCnpj'  => $fornecedor->getCpfCnpj(),
                'telefone' => $fornecedor->getTelefone(),
                'endereco' => $fornecedor->getEndereco(),
                'ativo'    => $fornecedor->isAtivo()
            ]);

        } catch (Throwable $e) {
            error_log('Erro ao visualizar fornecedor: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['erro' => 'Erro interno']);
        }
    }
}