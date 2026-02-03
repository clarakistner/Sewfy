<?php

require_once __DIR__ . '/../config/BancoDeDados.php';
require_once __DIR__ . '/../entidades/Produto.php';

$conn = conecta_bd();

class ProdutoDAO
{
    private $conn;
    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    // CRIA UM NOVO PRODUTO
    public function criarProduto(Produto $produto): int
    {
        $sql = "INSERT INTO PRODUTOS(PROD_COD, PROD_NOME,PROD_DESC, PROD_TIPO, PROD_UM, PROD_PRECO, PROD_ATIV, USUARIOS_USU_ID) VALUES (:cod, :nome,:descricao, :tipo, :um,:preco, :ativ, :idusuario) ";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':cod', $produto->getCodProd());
        $stmt->bindValue(':nome', $produto->getNomeProd());
        $stmt->bindValue(':tipo', $produto->getTipoProd());
        $stmt->bindValue(':um', $produto->getUmProd());
        $stmt->bindValue(':ativ', $produto->getAtivProd());
        $stmt->bindValue(':idusuario', $produto->getIdUsuProd());
        $stmt->bindValue(':preco', $produto->getPrecoProd());
        $stmt->bindValue(':descricao', $produto->getDescProd());
        $stmt->execute();
        return $this->conn->lastInsertId();
    }

    // BUSCA TODOS OS PRODUTOS
     public function buscarProdutos(): array {
        $sql = "SELECT * FROM PRODUTOS";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        $produtos = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $produto = new Produto($row['PROD_COD'],$row['PROD_NOME'], $row['PROD_DESC'], $row['PROD_TIPO'], $row['PROD_UM'], $row['PROD_PRECO'], $row['PROD_ATIV'], $row['USUARIOS_USU_ID']);
            

            $produtos[] = $produtos;
        }
       
        return $produtos;
    }
}

?>