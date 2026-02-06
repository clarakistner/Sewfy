<?php

session_start();

require_once __DIR__ . '/../../model/config/BancoDeDados.php';
require_once __DIR__ . '/../../model/DAOs/FornecedorDAO.php';

// Só aceita GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo 'Método não permitido';
    exit;
}

// Verifica autenticação
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo 'Usuário não autenticado';
    exit;
}

try {
    $conn = conecta_bd();
    $fornecedorDAO = new FornecedorDAO($conn);

    $usuarioId = $_SESSION['usuario_id'];

    $fornecedores = $fornecedorDAO->buscarFornecedores($usuarioId);

    // Converte objetos para array simples (JSON)
    $resultado = [];

    foreach ($fornecedores as $fornecedor) {
        $resultado[] = [
            'id'       => $fornecedor->getId(),
            'nome'     => $fornecedor->getNome(),
            'telefone' => $fornecedor->getTelefone(),
            'ativo'    => $fornecedor->getAtivo()
        ];
    }

    header('Content-Type: application/json');
    http_response_code(200);
    echo json_encode($resultado);

} catch (Exception $e) {
    http_response_code(500);
    echo 'Erro ao listar fornecedores';
}

?>