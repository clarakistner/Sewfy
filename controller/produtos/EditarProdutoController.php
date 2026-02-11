<?php

session_start();

require_once __DIR__ . '/../../model/config/BancoDeDados.php';
require_once __DIR__ . '/../../model/DAOs/ProdutoDAO.php';
require_once __DIR__ . '/../../model/entidades/Produto.php';

class EditarProdutoController
{
    private ProdutoDAO $produtoDAO;

    public function __construct()
    {
        $conn = conecta_bd();
        $this->produtoDAO = new ProdutoDAO($conn);
    }

    public function editarProduto(): void
    {
        header('Content-Type: text/plain; charset=utf-8');

        // Só aceita POST
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo "Método não permitido";
            return;
        }

        // Autenticação
        if (empty($_SESSION['usuario_id'])) {
            http_response_code(401);
            echo "Usuário não autenticado";
            return;
        }

        // Campos obrigatórios
        if (
            empty($_POST['id']) ||
            empty($_POST['cod']) ||
            empty($_POST['nome']) ||
            empty($_POST['um']) ||
            empty($_POST['tipo']) ||
            !isset($_POST['ativo'])
        ) {
            http_response_code(400);
            echo "Dados obrigatórios não enviados";
            return;
        }

        $id        = (int) $_POST['id'];
        $usuarioId = (int) $_SESSION['usuario_id'];

        // Normalização
        $cod   = trim($_POST['cod']);
        $nome  = trim($_POST['nome']);
        $tipo  = trim($_POST['tipo']);
        $um    = trim($_POST['um']);
        $desc  = isset($_POST['desc']) ? trim($_POST['desc']) : '';
        $ativo = ($_POST['ativo'] == 1) ? 1 : 0;
        $preco = isset($_POST['preco']) ? floatval($_POST['preco']) : 0;

        // Verifica duplicidade (exceto o próprio produto)
        if ($this->produtoDAO->existeCodigoOuNomeOutroProduto(
            $cod,
            $nome,
            $usuarioId,
            $id
        )) {
            http_response_code(409);
            echo "Já existe outro produto com esse código ou nome";
            return;
        }

        // Entidade
        $produto = new Produto();
        $produto->setIdProd($id);
        $produto->setIdUsuProd($usuarioId);
        $produto->setCodProd($cod);
        $produto->setTipoProd($tipo);
        $produto->setUmProd($um);
        $produto->setNomeProd($nome);
        $produto->setPrecoProd($preco);
        $produto->setDescProd($desc);
        $produto->setAtivProd($ativo);

        // Persistência
        if ($this->produtoDAO->atualizaProduto($produto)) {
            http_response_code(200);
            echo "Produto atualizado com sucesso";
        } else {
            http_response_code(500);
            echo "Erro ao atualizar produto";
        }
    }
}

// Execução correta
$controller = new EditarProdutoController();
$controller->editarProduto();