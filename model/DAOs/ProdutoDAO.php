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

   
     // atualiza produto
    public function atualizaProduto(Produto $produto)
    {
        $sql = "UPDATE PRODUTOS SET PROD_COD = :prodCod, PROD_NOME = :prodNome, PROD_DESC= :prodDesc, PROD_TIPO = :prodTipo, PROD_UM= :prodUm, PROD_ATIV = :prodAtiv, PROD_PRECO = :prodPreco WHERE PROD_ID = :idProd AND USUARIOS_USU_ID = :usuario";
        $stmt = $this->conn->prepare($sql);

        return $stmt->execute([
            ':prodCod'   => $produto->getCodProd(),
            ':prodNome'  => $produto->getNomeProd(),
            ':prodDesc'  => $produto->getDescProd(),
            ':prodTipo'  => $produto->getTipoProd(),
            ':prodUm'    => $produto->getUmProd(),
            ':prodAtiv'  => $produto->getAtivProd(),
            ':prodPreco' => $produto->getPrecoProd(),
            ':idProd'    => $produto->getIdProd(),
            ':usuario'   => $produto->getIdUsuProd()
        ]);
    }


    // busca produtos por nome ou código
    public function existeProdutoComMesmoNomeOuCodigo(string $codigo, string $nome, int $usuarioId): bool {
        $sql = " SELECT 1 FROM PRODUTOS WHERE USUARIOS_USU_ID = :usuarioId AND ( PROD_COD = :codigo
                OR PROD_NOME = :nome) LIMIT 1";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            ':usuarioId' => $usuarioId,
            ':codigo'    => $codigo,
            ':nome'      => $nome
        ]);

        return $stmt->fetchColumn() !== false;
    }

    // busca todos os produtos
    public function buscarProdutos( int $usuarioId): array {
        try{
            $sql = " SELECT * FROM PRODUTOS WHERE USUARIOS_USU_ID = :usuarioId ORDER BY PROD_ATIV DESC";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':usuarioId', $usuarioId, PDO::PARAM_INT);
            $stmt->execute();
            $produtos = [];
        
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $produto = new Produto();
                    $produto->setIdUsuProd($row['USUARIOS_USU_ID']);
                    $produto->setIdProd($row['PROD_ID']);
                    $produto->setCodProd($row['PROD_COD']);
                    $produto->setTipoProd($row['PROD_TIPO']);
                    $produto->setNomeProd($row['PROD_NOME']);
                    $produto->setUmProd($row['PROD_UM']);
                    $produto->setDescProd($row['PROD_DESC']);
                    $produto->setPrecoProd($row['PROD_PRECO']);
                    $produto->setAtivProd($row['PROD_ATIV']);

                    $produtos[] = $produto;
                }

                return $produtos;

        } catch (PDOException $e) {
                error_log('Erro ao buscar fornecedores: ' . $e->getMessage());
                return [];
        }

    }

    //busca 1 produto por id
    public function buscarProdutoPorId(int $id, int $usuarioId): ?Produto{
        $sql = "SELECT * FROM PRODUTOS WHERE PROD_ID = :id  AND USUARIOS_USU_ID = :usuarioId";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':usuarioId', $usuarioId, PDO::PARAM_INT);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            return null;
        }

        $produto = new Produto();
        $produto->setIdUsuProd($row['USUARIOS_USU_ID']);
        $produto->setIdProd($row['PROD_ID']);
        $produto->setCodProd($row['PROD_COD']);
        $produto->setTipoProd($row['PROD_TIPO']);
        $produto->setNomeProd($row['PROD_NOME']);
        $produto->setUmProd($row['PROD_UM']);
        $produto->setDescProd($row['PROD_DESC']);
        $produto->setPrecoProd($row['PROD_PRECO']);
        $produto->setAtivProd($row['PROD_ATIV']);

        return $produto;
    }

    //verifica se não existe o novo nome ou código em outro produto
    public function existeCodigoOuNomeOutroProduto( string $codigo, string $nome, int $usuarioId, int $produtoIdAtual): bool {
        $sql = "SELECT 1 FROM PRODUTOS WHERE USUARIOS_USU_ID = :usuarioId  AND PROD_ID <> :produtoId AND (
                    PROD_COD = :codigo OR PROD_NOME = :nome ) LIMIT 1 ";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            ':usuarioId' => $usuarioId,
            ':produtoId'=> $produtoIdAtual,
            ':codigo'   => $codigo,
            ':nome'     => $nome
        ]);

        return $stmt->fetchColumn() !== false;
    }

    //barra de filtros
    public function listarComFiltro(int $usuarioId, ?string $termo = null, ?int $tipo = null): array
    {
        $sql = "SELECT * FROM PRODUTOS WHERE USUARIOS_USU_ID = :usuarioId";

        $params = [
            ':usuarioId' => $usuarioId
        ];

        // Filtro por termo
        if ($termo !== null && $termo !== '') {
            $sql .= " AND (PROD_NOME LIKE :termo OR PROD_COD LIKE :termo)";
            $params[':termo'] = "%{$termo}%";
        }

        // Filtro por tipo
        if ($tipo !== null) {
            $sql .= " AND PROD_TIPO = :tipo";
            $params[':tipo'] = (int) $tipo;
        }

        $sql .= " ORDER BY PROD_ATIV DESC, PROD_NOME ASC";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchAll(PDO::FETCH_CLASS, Produto::class);
    }

}

?>