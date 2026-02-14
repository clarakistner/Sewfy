<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

require_once __DIR__ . '/../../model/config/BancoDeDados.php';
require_once __DIR__ . '/../../model/DAOs/ProdutoDAO.php';

// só aceita GET
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
    $produtoDAO = new ProdutoDAO($conn);

    // busca o produto pelo id
    $produto = $produtoDAO->buscarProdutoPorId(
        $id,
        $_SESSION['usuario_id']
    );

    // verifica se o produto ta nulo
    if (!$produto) {
        http_response_code(404);
        echo json_encode(['erro' => 'Produto não encontrado']);
        exit;
    }

    // retorna para o front o resultado da pesquisa com os detalhes do produto
    echo json_encode([
            'id'       => $produto->getIdProd(),
            'cod'       => $produto->getCodProd(),
            'nome'       => $produto->getNomeProd(),
            'tipo'       => $tipoTexto = match ((int) $produto->getTipoProd()) {
                                1 => 'Insumo',
                                2 => 'Produto Acabado',
                                default => 'Desconhecido',
                            },
            'um'       => $produto->getUmProd(),
            'preco'       => $produto->getPrecoProd(),
            'ativo'       => $produto->getAtivProd(),
    ]);

} catch (Throwable $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['erro' => 'Erro interno']);
}

?>