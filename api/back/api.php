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
require_once 'routes.php';

// Captura a URI e o método HTTP da requisição
$metodo = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove query strings da URI (tudo após o ?)
$base = '/Sewfy/api';
$uri = str_replace($base, '', $uri);

// Registra log antes de chamar o gerenciador
file_put_contents('debug.log', "Chamando gerenciadorRotas\n", FILE_APPEND);

// Chama o gerenciador de rotas com o método e URI
gerenciadorRotas($metodo, $uri);

// Registra log após execução
file_put_contents('debug.log', "Fim da execução\n\n", FILE_APPEND);

?>