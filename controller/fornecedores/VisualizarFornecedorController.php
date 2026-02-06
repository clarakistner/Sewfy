<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

require_once __DIR__ . '/../../model/config/BancoDeDados.php';
require_once __DIR__ . '/../../model/DAOs/FornecedorDAO.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['erro' => 'Método não permitido']);
    exit;
}

if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['erro' => 'Usuário não autenticado']);
    exit;
}

$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

if (!$id) {
    http_response_code(400);
    echo json_encode(['erro' => 'ID inválido']);
    exit;
}

try {
    $conn = conecta_bd();
    $fornecedorDAO = new FornecedorDAO($conn);

    // ⚠️ ESTE MÉTODO PRECISA EXISTIR NO DAO
    $fornecedor = $fornecedorDAO->buscarFornecedorPorId(
        $id,
        $_SESSION['usuario_id']
    );

    if (!$fornecedor) {
        http_response_code(404);
        echo json_encode(['erro' => 'Fornecedor não encontrado']);
        exit;
    }

    echo json_encode([
        'id'       => $fornecedor->getId(),
        'nome'     => $fornecedor->getNome(),
        'cpfCnpj'  => $fornecedor->getCpfCnpj(),
        'telefone' => $fornecedor->getTelefone(),
        'endereco' => $fornecedor->getEndereco(),
        'ativo'    => $fornecedor->isAtivo()
    ]);

} catch (Throwable $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['erro' => 'Erro interno']);
}

?>