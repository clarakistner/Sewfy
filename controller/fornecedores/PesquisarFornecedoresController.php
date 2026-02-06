<?php

session_start();

require_once __DIR__ . '/../../model/config/BancoDeDados.php';
require_once __DIR__ . '/../../model/DAOs/FornecedorDAO.php';

// Só aceita GET (busca)
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo 'Método não permitido';
    exit;
}

// Verifica sessão
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo 'Usuário não autenticado';
    exit;
}

$termo = trim($_GET['termo'] ?? '');

if ($termo === '') {
    http_response_code(400);
    echo 'Termo de busca não informado';
    exit;
}

try {
    $conn = conecta_bd();
    $fornecedorDAO = new FornecedorDAO($conn);

    // DAO usando fetchAll()
    $fornecedores = $fornecedorDAO->buscarFornecedoresPorNomeOuCpfCnpj(
        $termo,
        $_SESSION['usuario_id']
    );

    // Converte objetos Fornecedor em array (forma correta para JSON)
    $resultado = [];

    foreach ($fornecedores as $fornecedor) {
        $resultado[] = [
            'id'       => $fornecedor->getId(),
            'nome'     => $fornecedor->getNome(),
            'cpfCnpj'  => $fornecedor->getCpfCnpj(),
            'telefone' => $fornecedor->getTelefone(),
            'endereco' => $fornecedor->getEndereco(),
            'ativo'    => $fornecedor->isAtivo()
        ];
    }

    header('Content-Type: application/json');
    http_response_code(200);
    echo json_encode($resultado);

} catch (Exception $e) {
    error_log('Erro ao pesquisar fornecedor: ' . $e->getMessage());
    http_response_code(500);
    echo 'Erro interno ao buscar fornecedores';
}


?>