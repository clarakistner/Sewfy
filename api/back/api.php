<?php

// Registra informações de debug no arquivo de log
file_put_contents('debug.log', date('Y-m-d H:i:s') . " - Requisição recebida\n", FILE_APPEND);
file_put_contents('debug.log', "URI: " . $_SERVER['REQUEST_URI'] . "\n", FILE_APPEND);
file_put_contents('debug.log', "Method: " . $_SERVER['REQUEST_METHOD'] . "\n", FILE_APPEND);

// Configura headers HTTP para controle de cache e CORS
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Trata requisições OPTIONS (preflight do CORS)
if($_SERVER['REQUEST_METHOD'] === 'OPTIONS'){
    http_response_code(200);
    exit();
}

// Importa o arquivo de rotas
require_once __DIR__ . '/routes.php';

// Captura a URI e o método HTTP da requisição
$uri = $_SERVER['REQUEST_URI'];
$metodo = $_SERVER['REQUEST_METHOD'];

// Remove query strings da URI (tudo após o ?)
$uri = strtok($uri, '?');

// Registra log antes de chamar o gerenciador
file_put_contents('debug.log', "Chamando gerenciadorRotas\n", FILE_APPEND);

// Chama o gerenciador de rotas com o método e URI
gerenciadorRotas($metodo, $uri);

// Registra log após execução
file_put_contents('debug.log', "Fim da execução\n\n", FILE_APPEND);

?>