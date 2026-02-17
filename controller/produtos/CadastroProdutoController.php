<?php


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

        header('Content-Type: application/json; charset=utf-8');

        try {

            if (empty($_SESSION['usuario_id'])) {
                http_response_code(401);
                echo json_encode(['erro' => 'Usuário não autenticado']);
                return;
            }

            $data = json_decode(file_get_contents("php://input"), true);

            if (
                empty($data['cod']) ||
                empty($data['tipo']) ||
                empty($data['nome']) ||
                empty($data['um'])
            ) {
                http_response_code(400);
                echo json_encode(['erro' => 'Dados obrigatórios não enviados']);
                return;
            }

            $usuarioId = (int) $_SESSION['usuario_id'];
            $cod = trim($data['cod']);
            $nome = trim($data['nome']);
            $tipo = (int) $data['tipo'];
            $um = trim($data['um']);
            $desc = $data['desc'] ?? null;
            $preco = (float) $data['preco'];

            if ($this->ProdutoDAO->existeProdutoComMesmoNomeOuCodigo($cod, $nome, $usuarioId)) {
                http_response_code(409);
                echo json_encode(['erro' => 'Já existe um produto com esse código ou nome']);
                return;
            }

            $Produto = new Produto();
            $Produto->setIdUsuProd($usuarioId);
            $Produto->setCodProd($cod);
            $Produto->setTipoProd($tipo);
            $Produto->setNomeProd($nome);
            $Produto->setUmProd($um);
            $Produto->setDescProd($desc);
            $Produto->setPrecoProd($preco);
            $Produto->setAtivProd(1);

            $id = $this->ProdutoDAO->criarProduto($Produto);

            if ($id > 0) {
                http_response_code(201);
                echo json_encode([
                    'mensagem' => 'Produto cadastrado com sucesso',
                    'id' => $id
                ]);
            } else {
                http_response_code(500);
                echo json_encode(['erro' => 'Erro ao cadastrar produto']);
            }

        } catch (Throwable $e) {
            http_response_code(500);
            echo json_encode(['erro' => 'Erro interno do servidor']);
        }
    }
}