<?php

require_once __DIR__ . '/../../model/config/BancoDeDados.php';
require_once __DIR__ . '/../../model/DAOs/FornecedorDAO.php';

if (session_status() === PHP_SESSION_NONE) {
            session_start();
}

class ListarFornecedoresController
{
    private FornecedorDAO $fornecedorDAO;

    public function __construct()
    {
        $conn = conecta_bd();
        $this->fornecedorDAO = new FornecedorDAO($conn);
    }

    public function listar(): void
    {
       
        header('Content-Type: application/json; charset=utf-8');

        try {

            if (empty($_SESSION['usuario_id'])) {
                http_response_code(401);
                echo json_encode(['erro' => 'Usuário não autenticado']);
                return;
            }

            $usuarioId = (int) $_SESSION['usuario_id'];
            $termo = trim($_GET['search'] ?? '');

            if ($termo !== '') {
                $fornecedores = $this->fornecedorDAO
                    ->buscarFornecedoresPorNomeOuCpfCnpj($termo, $usuarioId);
            } else {
                $fornecedores = $this->fornecedorDAO
                    ->buscarFornecedores($usuarioId);
            }

            $resultado = [];

            foreach ($fornecedores ?? [] as $fornecedor) {
                $resultado[] = [
                    'id'       => $fornecedor->getId(),
                    'nome'     => $fornecedor->getNome(),
                    'cpfCnpj'  => $fornecedor->getCpfCnpj(),
                    'telefone' => $fornecedor->getTelefone(),
                    'endereco' => $fornecedor->getEndereco(),
                    'ativo'    => $fornecedor->isAtivo()
                ];
            }

            http_response_code(200);
            echo json_encode($resultado);

        } catch (Throwable $e) {
            error_log('Erro ao buscar fornecedores: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['erro' => 'Erro interno ao buscar fornecedores']);
        }
    }
}