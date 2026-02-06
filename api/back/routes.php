<?php

require_once __DIR__ . '/../../controller/ProdutoController.php';

function gerenciadorRotas($metodo, $uri)
{
    $uri = str_replace('/Sewfy/api/back/api.php', '', $uri);

    if ($uri === '/produtos' && $metodo === 'POST') {
        $controller = new ProdutoController();
        $controller->criarProduto();
        return;
    }
    if($uri === '/produtos/lista' && $metodo === 'GET'){
        $controller = new ProdutoController();
        $produtos = $controller->buscarProdutos();
        return $produtos;
    }
    if($uri === '/produtos/editar' && $metodo === 'PUT'){
        $controller = new ProdutoController();
        $controller->atualizarProduto();
        return;
    }
     
}

?>