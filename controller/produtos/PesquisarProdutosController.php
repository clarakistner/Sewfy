<?php
session_start();

require_once __DIR__ . '/../../model/config/BancoDeDados.php';
require_once __DIR__ . '/../../model/DAOs/ProdutoDAO.php';

header('Content-Type: application/json');

ini_set('display_errors', 0);
error_reporting(E_ALL);

function logDebug($label, $data) {
    error_log("[DEBUG] $label: " . print_r($data, true));
}

try {
    logDebug("REQUEST_METHOD", $_SERVER['REQUEST_METHOD']);
    logDebug("SESSION", $_SESSION);
    logDebug("GET", $_GET);

    // Só aceita GET 
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        throw new Exception("Método inválido");
    }

    if (!isset($_SESSION['usuario_id'])) {
        throw new Exception("Usuário não autenticado");
    }

    // variaveis recebem do front as informações
    $usuarioId = $_SESSION['usuario_id'];
    $termo = $_GET['termo'] ?? '';
    $tipo  = $_GET['tipo'] ?? '';

    logDebug("usuarioId", $usuarioId);
    logDebug("termo", $termo);
    logDebug("tipo", $tipo);

    // estabelece conexão com o banco
    $conn = conecta_bd();
    if (!$conn) {
        throw new Exception("Falha ao obter conexão com o banco");
    }

    $produtosDAO = new ProdutoDAO($conn);

    // produtos recebe um array com todos os produtos desse usuário
    $produtos = $produtosDAO->buscarProdutos($usuarioId);
    logDebug("produtos antes do filtro", $produtos);

    // verifica se o termo da busca não ta vazio
    if ($termo !== '') {
        $termoLower = mb_strtolower($termo);

        // percorre cada produto e retorna os que geram true
        $produtos = array_filter($produtos, function ($produto) use ($termoLower) {
            return
                $produto->getNomeProd() !== null &&
                (
                    // verifica se o nome do produto contém o termo pesquisado (transforma tudo em lower para evitar erro)
                    str_contains(mb_strtolower($produto->getNomeProd()), $termoLower) ||
                    str_contains( // faz o mesmo com o codigo 
                        mb_strtolower((string)$produto->getCodProd()),
                        $termoLower
                    )
                );
        });
    }

    // verifica se o tipo do filtro não ta vazio
    if ($tipo !== '') {
         // percorre cada produto e retorna os que geram true
        $produtos = array_filter($produtos, function ($produto) use ($tipo) {
            // verifica se o tipo do produto é o mesmo do filtro
            return $produto->getTipoProd() == $tipo;
        });
    }

    // manda para o front o resultado da pesquisa
    echo json_encode(array_values($produtos));
    logDebug("produtos depois do filtro", $produtos);
    exit;

} catch (Throwable $e) {
    error_log("[ERRO CONTROLLER] " . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        "erro" => "Erro interno",
        "mensagem" => $e->getMessage()
    ]);
    exit;
}