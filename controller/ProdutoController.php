<?php
require_once __DIR__ . '/../model/config/BancoDeDados.php';
require_once __DIR__ . '/../model/DAOs/ProdutoDAO.php';
require_once __DIR__ . '/../model/entidades/Produto.php';
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
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

            $listaProdutos = $this->produtoDAO->buscarProdutos();

            if (!$prodAtiv || !$prodCod || !$prodTipo || !$prodNome || !$prodPreco || !$prodDesc || !$prodUm) {
                $response = [
                    "status" => "erro",
                    "resposta" => "Campos inválidos ou vazios!",
                    "erro" => "true"
                ];
                echo json_encode($response);
                exit();
            }
            foreach ($listaProdutos as $produto) {
                if ($produto->getIdUsuProd() === $_SESSION['usuario_id']) {
                    if ($produto->getCodProd() === $prodCod || $produto->getNomeProd() === $prodNome) {
                        $response = [
                            "status" => "erro",
                            "resposta" => "Já existe um produto com esse nome ou código!",
                            "erro" => "true"
                        ];
                        echo json_encode($response);
                        exit();
                    }
                }
            }

            $produto = new Produto($prodCod, $prodNome, $prodDesc, $prodTipo, $prodUm, $prodPreco, $prodAtiv, $idUsuario);

            $this->produtoDAO->criarProduto($produto);
            $response = [
                "status" => "sucesso",
                "resposta" => "Produto Cadastrado!",
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
    public function buscarProdutos()
    {
        try {

            $listaProdutos = $this->produtoDAO->buscarProdutos();
            $produtosArray = array_values(array_filter(array_map(function ($produto) {
                if ($produto->getIdUsuProd() === $_SESSION['usuario_id']) {
                    return [
                        'PROD_ID' => $produto->getIdProd(),
                        'PROD_COD' => $produto->getCodProd(),
                        'PROD_NOME' => $produto->getNomeProd(),
                        'PROD_DESC' => $produto->getDescProd(),
                        'PROD_TIPO' => $produto->getTipoProd(),
                        'PROD_UM' => $produto->getUmProd(),
                        'PROD_PRECO' => $produto->getPrecoProd(),
                        'PROD_ATIV' => $produto->getAtivProd()
                    ];
                }
                return;
            }, $listaProdutos)));
            $response = [
                "status" => "sucesso",
                "produtos" => $produtosArray,
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
    public function atualizarProduto()
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
            $listaProdutos = $this->produtoDAO->buscarProdutos();
            $produto = new Produto(null, null, null, null, null, null, null, null);
            foreach ($listaProdutos as $prod) {
                if ($prod->getIdUsuProd() === $_SESSION['usuario_id']) {
                    if ($prod->getIdProd() === $dados['PROD_ID']) {
                        $produto = $prod;
                    } else if ($prod->getCodProd() === $dados['PROD_COD'] || $prod->getNomeProd() === $dados['PROD_NOME']) {
                        if ($prod->getIdProd() !== $dados['PROD_ID']) {
                            $response = [
                                "status" => "erro",
                                "resposta" => "Já existe um produto com esse nome ou código!",
                                "erro" => "true"
                            ];
                            echo json_encode($response);
                            exit();
                        }

                    }
                }
            }

            $prodCod = $dados['PROD_COD'] ?? $produto->getCodProd();
            $prodNome = $dados['PROD_NOME'] ?? $produto->getNomeProd();
            $prodDesc = $dados['PROD_DESC'] ?? $produto->getDescProd();
            $prodUm = $dados['PROD_UM'] ?? $produto->getUmProd();
            $prodAtiv = $dados['PROD_ATIV'] ?? $produto->getAtivProd();
            $prodPreco = $dados['PROD_PRECO'] ?? $produto->getPrecoProd();
            $prodTipo = $dados['PROD_TIPO'] ?? $produto->getTipoProd();
            $prodId = $produto->getIdProd() ?? $dados['PROD_ID'];

            $this->produtoDAO->atualizaProduto($prodId, $prodCod, $prodNome, $prodDesc, $prodTipo, $prodUm, $prodAtiv, $prodPreco);


            $response = [
                "status" => "sucesso",
                "resposta" => "Produto Atualizado!",
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
    public function buscaprodutoPorId($prodId){
        try {
            
            
            $prodId = $prodId ?? null;

            $produto = $this->produtoDAO->buscarProdutoPorId($prodId);

            $produtoResposta = [
                        'PROD_ID' => $produto->getIdProd(),
                        'PROD_COD' => $produto->getCodProd(),
                        'PROD_NOME' => $produto->getNomeProd(),
                        'PROD_DESC' => $produto->getDescProd(),
                        'PROD_TIPO' => $produto->getTipoProd(),
                        'PROD_UM' => $produto->getUmProd(),
                        'PROD_PRECO' => $produto->getPrecoProd(),
                        'PROD_ATIV' => $produto->getAtivProd()
                    ];

            $response = [
                "status" => "sucesso",
                "produto"=> $produtoResposta,
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