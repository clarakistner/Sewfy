<?php
require_once __DIR__ . '/../model/config/BancoDeDados.php';
require_once __DIR__ . '/../model/DAOs/ProdutoDAO.php';
require_once __DIR__ . '/../model/entidades/Produto.php';
session_start();
class ProdutoController
{
    private ProdutoDAO $produtoDAO;

    public function __construct()
    {
         $conn = conecta_bd();
        $this->produtoDAO = new ProdutoDAO($conn);

    }
    public function criarProduto()
    {
        try {
            $json = file_get_contents('php://input');
            $dados = json_decode($json, true);

            if (!$dados) {
                http_response_code(400);
                echo json_encode([
                    'sucesso' => false,
                    'erro' => "Dados inválidos ou ausentes"
                ]);
                return;
            }
            $prodCod = $dados['PROD_COD'] ?? null;
            $prodNome = $dados['PROD_NOME'] ?? null;
            $prodDesc = $dados['PROD_DESC'] ?? null;
            $prodUm = $dados['PROD_UM'] ?? null;
            $prodAtiv = $dados['PROD_ATIV'] ?? null;
            $prodPreco = $dados['PROD_PRECO'] ?? null;
            $prodTipo = $dados['PROD_TIPO'] ?? null;
            $idUsuario = $_SESSION['usuario_id'] ?? null;


            $produto = new Produto($prodCod, $prodNome, $prodDesc, $prodTipo, $prodUm, $prodPreco, $prodAtiv, $idUsuario);

            $this->produtoDAO->criarProduto($produto);
        $response = [
            "status"=> "sucesso",
            "resposta" => "Produto criado!",
            "erro" => "false"
        ];
        echo json_encode($response);

        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'status' => "erro",
                'erro' => $e->getMessage()
            ]);
        }
    }
}
?>