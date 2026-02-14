<?php

// Importa classes auxiliares
require_once __DIR__ . '/../../controller/ProdutoController.php';
require_once __DIR__ . '/../../controller/OPs/CriacaoOrdemDeProducaoController.php';
require_once __DIR__ . '/../../controller/OPs/ListarOrdensProducaoController.php';

// Cria função para gerenciar as rotas
function gerenciadorRotas($metodo, $uri)
{
    // Retira a parte comum da url e define o restante como uri
    $uri = str_replace('/Sewfy/api/back/api.php', '', $uri);

    // Verifica as rotas e os metodos
    if ($uri === "/ordemdeproducao/criar" && $metodo === 'POST') {
        // Cria o controller a ser utilizado
        $controller = new CriacaoOrdemDeProducaoController();
        // Chama a função do controller
        $controller->criarOP_OPIs();
        // Para o if
        return;
    }
    if ($uri === '/ordemdeproducao/listar' && $metodo === 'GET'){
        $controller = new ListarOrdensProducaoController();
        $controller->listarOPs();
        return;
    }

}

?>