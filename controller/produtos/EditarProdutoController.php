<?php


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

    public function editarProduto(int $id): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        header('Content-Type: application/json');

        if (empty($_SESSION['usuario_id'])) {
            http_response_code(401);
            echo json_encode(['erro' => 'Usuário não autenticado']);
            return;
        }

        $data = json_decode(file_get_contents("php://input"), true);

        if (
            empty($data['cod']) ||
            empty($data['nome']) ||
            empty($data['tipo']) ||
            empty($data['um']) ||
            !isset($data['ativo'])
        ) {
            http_response_code(400);
            echo json_encode(['erro' => 'Dados obrigatórios não enviados']);
            return;
        }

        $usuarioId = (int) $_SESSION['usuario_id'];

        $cod   = trim($data['cod']);
        $nome  = trim($data['nome']);
        $tipo  = trim($data['tipo']);
        $um    = trim($data['um']);
        $desc  = isset($data['desc']) ? trim($data['desc']) : '';
        $ativo = ($data['ativo'] == 1) ? 1 : 0;
        $preco = isset($data['preco']) ? floatval($data['preco']) : 0;

        if ($this->produtoDAO->existeCodigoOuNomeOutroProduto(
            $cod,
            $nome,
            $usuarioId,
            $id
        )) {
            http_response_code(409);
            echo json_encode(['erro' => 'Já existe outro produto com esse código ou nome']);
            return;
        }

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

        if ($this->produtoDAO->atualizaProduto($produto)) {
            echo json_encode(['mensagem' => 'Produto atualizado com sucesso']);
        } else {
            http_response_code(500);
            echo json_encode(['erro' => 'Erro ao atualizar produto']);
        }
    }
}
