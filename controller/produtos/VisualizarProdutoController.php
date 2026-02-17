<?php

require_once __DIR__ . '/../../model/config/BancoDeDados.php';
require_once __DIR__ . '/../../model/DAOs/ProdutoDAO.php';

class VisualizarProdutoController
{
    public function visualizar(int $id): void
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

            $produto = $produtoDAO->buscarProdutoPorId(
                $id,
                $_SESSION['usuario_id']
            );

            if (!$produto) {
                http_response_code(404);
                echo json_encode(['erro' => 'Produto não encontrado']);
                return;
            }

            echo json_encode([
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
                'desc'  => $produto->getDescProd(), 
            ]);

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