<?php

session_start();

require_once __DIR__ . '/../../model/config/BancoDeDados.php';
require_once __DIR__ . '/../../model/DAOs/ProdutoDAO.php';

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
    $produtoDAO = new ProdutoDAO($conn);

    $usuarioId = $_SESSION['usuario_id'];

    $produtos = $produtoDAO->buscarProdutos($usuarioId);

    // Converte objetos para array simples (JSON)
    $resultado = [];

    // pra cada produto ele vai pegar as informações e colocar dentro de um vetor
    foreach ($produtos as $produto) {
        $resultado[] = [
            'id'       => $produto->getIdProd(),
            'cod'       => $produto->getCodProd(),
            'nome'       => $produto->getNomeProd(),
            'tipo'       => $tipoTexto = match ((int) $produto->getTipoProd()) {
                                1 => 'Insumo',
                                2 => 'Produto Acabado',
                                default => 'Desconhecido',
                            },
            'um'       =>  $produto->getUmProd(),
            'preco'       => $produto->getPrecoProd(),
            'ativo'       => $produto->getAtivProd(),
        ];
    }

    header('Content-Type: application/json');
    http_response_code(200);
    //manda para o front o vetor com os produtos e seus respectivos detalhes
    echo json_encode($resultado);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "erro" => true,
        "mensagem" => "Erro ao buscar produtos"
    ]);
}

?>