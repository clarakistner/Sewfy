<?php

session_start();

require_once __DIR__ . '/../../model/config/BancoDeDados.php';
require_once __DIR__ . '/../../model/DAOs/ProdutoDAO.php';
require_once __DIR__ . '/../../model/entidades/Produto.php';

class CadastroProdutoController {

    private ProdutoDAO $ProdutoDAO;

    public function __construct() {
        $conn = conecta_bd();
        $this->ProdutoDAO = new ProdutoDAO($conn);
    }

    public function cadastrarProduto(): void {

        header('Content-Type: text/plain; charset=utf-8');

        // Só aceita POST
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo "Método não permitido";
            return;
        }

        // Verifica autenticação
        if (empty($_SESSION['usuario_id'])) {
            http_response_code(401);
            echo "Usuário não autenticado";
            return;
        }

        // Validação básica
        if (
            empty($_POST['cod']) ||
            empty($_POST['tipo']) ||
            empty($_POST['nome']) ||
            empty($_POST['um'])
        ) {
            http_response_code(400);
            echo "Dados obrigatórios não enviados";
            return;
        }

        $usuarioId = (int) $_SESSION['usuario_id'];
        $cod = $_POST['cod'];
        $nome = $_POST['nome'];

        // Evita duplicidade
        if ($this->ProdutoDAO->existeProdutoComMesmoNomeOuCodigo($cod, $nome, $usuarioId)) {
            http_response_code(409);
            echo "Já existe um produto com esse código ou nome";
            return;
        }

        // Criação do objeto
        $Produto = new Produto();
        $Produto->setIdUsuProd($usuarioId);
        $Produto->setCodProd($cod);
        $Produto->setTipoProd(trim($_POST['tipo']));
        $Produto->setNomeProd($nome);
        $Produto->setUmProd(trim($_POST['um']));
        $Produto->setDescProd($_POST['desc']);
        $preco = (float) str_replace(',', '.', str_replace(['R$', ' '], '', $_POST['preco']));
        $Produto->setPrecoProd($preco);
        $Produto->setAtivProd(1); // SEMPRE int

        // Persistência
        $id = $this->ProdutoDAO->criarProduto($Produto);

        if ($id > 0) {
            http_response_code(201);
            echo "Produto cadastrado com sucesso";
        } else {
            http_response_code(500);
            echo "Erro ao cadastrar Produto";
        }
    }
}

$controller = new CadastroProdutoController();
$controller->cadastrarProduto();

?>