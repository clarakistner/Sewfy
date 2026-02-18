<?php

require_once __DIR__ . '/../../model/config/BancoDeDados.php';
require_once __DIR__ . '/../../model/DAOs/ProdutoDAO.php';

class ListarProdutosController
{

    public function listar(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if (empty($_SESSION['usuario_id'])) {
            http_response_code(401);
            echo json_encode(["erro" => "Usuário não autenticado"]);
            return;
        }

        try {

            $conn = conecta_bd();
            $produtoDAO = new ProdutoDAO($conn);

            $usuarioId = (int) $_SESSION['usuario_id'];

            $termo = isset($_GET['termo']) ? trim($_GET['termo']) : null;
            $tipo  = isset($_GET['tipo']) ? (int) $_GET['tipo'] : null;

            // Decide aqui se filtra ou lista tudo
            if (!empty($termo) || !empty($tipo)) {
                $produtos = $produtoDAO->listarComFiltro($usuarioId, $termo, $tipo);
            } else {
                $produtos = $produtoDAO->buscarProdutos($usuarioId);
            }

            $resultado = [];

            foreach ($produtos as $produto) {
                $resultado[] = [
                    'id'    => $produto->getIdProd(),
                    'cod'   => $produto->getCodProd(),
                    'nome'  => $produto->getNomeProd(),
                    'tipo'  => match ((int) $produto->getTipoProd()) {
                        1 => 'Insumo',
                        2 => 'Produto Acabado',
                        default => 'Desconhecido',
                    },
                    'um'    => $produto->getUmProd(),
                    'preco' => $produto->getPrecoProd(),
                    'ativo' => $produto->getAtivProd(),
                ];
            }

            echo json_encode($resultado);

        } catch (Throwable $e) {

            http_response_code(500);
            echo json_encode([
                "erro" => $e->getMessage(),
                "linha" => $e->getLine(),
                "arquivo" => $e->getFile()
            ]);
            }
    }
}