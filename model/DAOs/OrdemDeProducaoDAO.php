<?php
require_once __DIR__ . '/../config/BancoDeDados.php';
require_once __DIR__ . "/Sewfy/model/entidades/OrdemDeProducao.php";

class OrdemDeProducaoDAO
{
    private $conn;
    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    // CRIA A ORDEM DE PRODUÇÃO
    public function criarOP(OrdemDeProducao $op): int
    {
        $sql = "INSERT INTO ORDEM_PRODUCAO(OP_QTD, OP_DATAA, USUARIOS_USU_ID, PRODUTOS_PROD_ID) VALUES (:qtd, :dataa, :idusuario, :idprod) ";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':qtd', $op->getOP_QTD());
        $stmt->bindValue(':dataa', $op->getOP_DATAA());
        $stmt->bindValue(':idusuario', $op->getUSUARIOS_USU_ID());
        $stmt->bindValue(':idprod', $op->getPRODUTOS_PROD_ID());
        $stmt->execute();
        return $this->conn->lastInsertId();
    }

    // TRAZ TODAS AS OPS
    public function buscarOPs(): array
    {
        $sql = "SELECT * FROM ORDEM_PRODUCAO";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        $ops = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $op = new OrdemDeProducao();

            $op->setOP_ID($row['OP_ID']);
            $op->setOP_DATAA($row['OP_DATAA']);
            $op->setOP_DATAE($row['OP_DATAE']);
            $op->setOP_CUSTOT($row['OP_CUSTOT']);
            $op->setOP_CUSTOU($row['OP_CUSTOU']);
            $op->setOP_CUSTOUR($row['OP_CUSTOUR']);
            $op->setOP_QTD($row['OP_QTD']);
            $op->setOP_QTDE($row['OP_QTDE']);
            $op->setPRODUTOS_PROD_ID($row['PRODUTOS_PROD_ID']);
            $op->setUSUARIOS_USU_ID($row['USUARIOS_USU_ID']);
            $op->setOP_QUEBRA($row['OP_QUEBRA']);


            $ops[] = $op;
        }

        return $ops;
    }

    // ATUALIZA A DATA DE ENTREGA DA ORDEM DE PRODUÇÃO

    public function atualizaDataEntrega(OrdemDeProducao $op)
    {
        $sql = "UPDATE ORDEM_PRODUCAO SET OP_DATAE = :datae WHERE OP_ID = :idop";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(":datae", $op->getOP_DATAE());
        $stmt->bindValue(":idop", $op->getOP_ID());
        $stmt->execute();
        return $this->conn->lastInsertId();
    }
}

?>