<?php
file_put_contents('debug.log', date('Y-m-d H:i:s') . " - Requisição recebida\n", FILE_APPEND);
file_put_contents('debug.log', "URI: " . $_SERVER['REQUEST_URI'] . "\n", FILE_APPEND);
file_put_contents('debug.log', "Method: " . $_SERVER['REQUEST_METHOD'] . "\n", FILE_APPEND);


header('Cache-Control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

if($_SERVER['REQUEST_METHOD'] === 'OPTIONS'){
    http_response_code(200);
    exit();
}
require_once __DIR__ . '/routes.php';

$uri = $_SERVER['REQUEST_URI'];
$metodo = $_SERVER['REQUEST_METHOD'];

$uri = strtok($uri, '?');

file_put_contents('debug.log', "Chamando gerenciadorRotas\n", FILE_APPEND);

gerenciadorRotas($metodo, $uri);

file_put_contents('debug.log', "Fim da execução\n\n", FILE_APPEND);
?>