<?php

require_once __DIR__ . '/../../controller/ProdutoController.php';

function gerenciadorRotas($metodo, $uri)
{
   file_put_contents(__DIR__ . '/debug.log', "gerenciadorRotas - URI: $uri | Método: $metodo\n", FILE_APPEND);
    
    $uri = str_replace('/Sewfy/api/back', '', $uri);
    
    file_put_contents(__DIR__ . '/debug.log', "URI depois do replace: $uri\n", FILE_APPEND);
    
    if ($uri === '/produtos' && $metodo === 'POST') {
        file_put_contents(__DIR__ . '/debug.log', "Entrou no if de criar produto\n", FILE_APPEND);
        
        $controller = new ProdutoController();
        $controller->criarProduto();
        return;
    }
     file_put_contents(__DIR__ . '/debug.log', "Nenhuma rota encontrada\n", FILE_APPEND);
}

?>