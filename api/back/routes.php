<?php

require_once __DIR__ . '/../../controller/ProdutoController.php';
require_once __DIR__ . '/../../controller/OPs/CriacaoOrdemDeProducao.php';
require_once __DIR__ . '/../../controller/OPs/ListarOrdensProducaoController.php';

function gerenciadorRotas($metodo, $uri)
{
    $uri = str_replace('/Sewfy/api/back/api.php', '', $uri);

    if ($uri === '/produtos' && $metodo === 'POST') {
        $controller = new ProdutoController();
        $controller->criarProduto();
        return;
    }
    if ($uri === '/produtos/lista' && $metodo === 'GET') {
        $controller = new ProdutoController();
        $controller->buscarProdutos();
        return;
    }
    $padrao = '#^/produtos/buscaProduto/(\d+)$#';
    if (preg_match($padrao, $uri, $matches) && $metodo === 'GET') {
        $id = (int)$matches[1];
        $controller = new ProdutoController();
        $controller->buscaprodutoPorId($id);
        return;
    }

    if ($uri === '/produtos/editar' && $metodo === 'PUT') {
        $controller = new ProdutoController();
        $controller->atualizarProduto();
        return;
    }

    if ($uri === "/ordemdeproducao/criar" && $metodo === 'POST') {
        $controller = new CriacaoOrdemDeProducao();
        $controller->criarOP_OPIs();
        return;
    }
    if ($uri === '/ordemdeproducao/listar' && $metodo === 'GET'){
        $controller = new ListarOrdensProducaoController();
        $controller->listarOPs();
        return;
    }

}

?>