<?php

require_once __DIR__ . '/../../controller/ProdutoController.php';

function gerenciadorRotas($metodo, $uri)
{
    $uri = str_replace('/Sewfy/api/back', '', $uri);
    if ($uri === '/produtos' && $metodo === 'POST') {
        $controller = new ProdutoController();
        $controller->criarProduto();
        return;
    }
}

?>