<?php

// Importa classes auxiliares
require_once __DIR__ . '/../../controller/OPs/CriacaoOrdemDeProducaoController.php';
require_once __DIR__ . '/../../controller/OPs/ListarOrdensProducaoController.php';
require_once __DIR__ . '/../../controller/OPs/VisualizarOrdemProducaoController.php';
require_once __DIR__ . '/../../controller/OPs/DeletarInsumoOrdemProducaoController.php';
require_once __DIR__ . '/../../controller/OPs/EditarOrdemProducaoController.php';

//produtos
require_once __DIR__ . '/../../controller/produtos/CadastroProdutoController.php';
require_once __DIR__ . '/../../controller/produtos/EditarProdutoController.php';
require_once __DIR__ . '/../../controller/produtos/ListarProdutosController.php';
require_once __DIR__ . '/../../controller/produtos/VisualizarProdutoController.php';

// fornecedores
require_once __DIR__ . '/../../controller/fornecedores/CadastroFornecedorController.php';
require_once __DIR__ . '/../../controller/fornecedores/EditarFornecedorController.php';
require_once __DIR__ . '/../../controller/fornecedores/ListarFornecedoresController.php';
require_once __DIR__ . '/../../controller/fornecedores/VisualizarFornecedorController.php';

// Cria função para gerenciar as rotas
function gerenciadorRotas($metodo, $uri)
{
    //var_dump($uri);
    //die();

    // Retira a parte comum da url e define o restante como uri
    $uri = str_replace('/back/api.php', '', $uri);

    // Verifica as rotas e os metodos
    if ($uri === "/ordemdeproducao/criar" && $metodo === 'POST') {
        // Cria o controller a ser utilizado
        $controller = new CriacaoOrdemDeProducaoController();
        // Chama a função do controller
        $controller->criarOP_OPIs();
        // Para o if
        return;
    }
    if ($uri === '/ordemdeproducao/listar' && $metodo === 'GET') {
        $controller = new ListarOrdensProducaoController();
        $controller->listarOPs();
        return;
    }
    if (preg_match('#^/ordemdeproducao/detalhes/([a-zA-Z0-9]+)$#', $uri, $matches) && $metodo === 'GET') {
        $id = $matches[1];
        $controller = new VisualizarOrdemProducaoController();
        $controller->visualizarOP($id);
        return;
    }

    // Produtos
    if ($uri === '/produtos' && $metodo === 'POST') {
        $controller = new CadastroProdutoController();
        $controller->cadastrarProduto();
        return;
    }
    // GET /produtos (listar ou filtrar)
    if ($uri === '/produtos' && $metodo === 'GET') {
        $controller = new ListarProdutosController();
        $controller->listar();
        return;
    }
    // GET /produtos/{id}
    if (preg_match('#^/produtos/([0-9]+)$#', $uri, $matches) && $metodo === 'GET') {
        $controller = new VisualizarProdutoController();
        $controller->visualizar((int) $matches[1]);
        return;
    }
    // PUT /produtos/{id}
    if (preg_match('#^/produtos/([0-9]+)$#', $uri, $matches) && $metodo === 'PUT') {
        $controller = new EditarProdutoController();
        $controller->editarProduto((int) $matches[1]);
        return;
    }

    // fornecedores
    if ($uri === '/fornecedores' && $metodo === 'POST') {
        $controller = new CadastroFornecedorController();
        $controller->cadastrarFornecedor();
        return;
    }
    // GET /fornecedores (listar ou filtrar)
    if ($uri === '/fornecedores' && $metodo === 'GET') {
        $controller = new ListarFornecedoresController();
        $controller->listar();
        return;
    }
    // GET /fornecedores/{id}
    if (preg_match('#^/fornecedores/([0-9]+)$#', $uri, $matches) && $metodo === 'GET') {
        $controller = new VisualizarFornecedorController();
        $controller->visualizar((int) $matches[1]);
        return;
    }
    // PUT /fornecedores/{id}
    if (preg_match('#^/fornecedores/([0-9]+)$#', $uri, $matches) && $metodo === 'PUT') {
        $controller = new EditarFornecedorController();
        $controller->editarFornecedor((int) $matches[1]);
        return;
    }

    // Deletar insumo
    if (preg_match('#^/insumos/deletar/(\d+)$#', $uri, $matches) && $metodo === 'DELETE') {
        $idOPIN = (int) $matches[1];
        $controller = new DeletarInsumoOrdemProducaoController();
        $controller->deletaInsumo($idOPIN);
        return;
    }
    if($uri === '/ordemdeproducao/editar' && $metodo === 'PUT'){
        $controller = new EditarOrdemProducaoController();
        $controller->editarOP();
        return;
    }
}
