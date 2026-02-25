<?php

require_once __DIR__ . "/../entidades/OPInsumo.php";
require_once __DIR__ . "/../config/BancoDeDados.php";
class OPInsumoDAO
{

    private $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    public function criarOpInsumo(OPInsumo $opin)
    {
        try {
            $sql = "INSERT INTO OP_INSUMOS(OPIN_UM, OPIN_QTD, OPIN_CUSTOU, OPIN_CUSTOT, PRODUTOS_PROD_ID, ORDEM_PRODUCAO_OP_ID, FORNECEDORES_CLIFOR_ID) VALUES (:um, :qtd, :custou, :custot, :prodid, :opid, :forid)";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(":um", $opin->getOPIN_UM());
            $stmt->bindValue(":qtd", $opin->getOPIN_QTD());
            $stmt->bindValue(":custou", $opin->getOPIN_CUSTOU());
            $stmt->bindValue(":custot", $opin->getOPIN_CUSTOT());
            $stmt->bindValue(":prodid", $opin->getPRODUTOS_PROD_ID());
            $stmt->bindValue(":opid", $opin->getORDEM_PRODUCAO_OP_ID());
            $stmt->bindValue(":forid", $opin->getFORNECEDORES_CLIFOR_ID());
            $stmt->execute();
            return $this->conn->lastInsertId();
        } catch (PDOException $e) {
            error_log("Erro ao tentar criar insumo: " . $e->getMessage());
            return 0;
        }
    }

    public function buscaInsumos($idOP)
    {
        try {
            $sql = 'SELECT * FROM OP_INSUMOS WHERE ORDEM_PRODUCAO_OP_ID = :idop';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(":idop", $idOP);
            $stmt->execute();
            $opins = [];
            while (($row = $stmt->fetch(PDO::FETCH_ASSOC))) {
                $opin = new OPInsumo();
                $opin->setFORNECEDORES_CLIFOR_ID($row['FORNECEDORES_CLIFOR_ID']);
                $opin->setOPIN_CUSTOT($row['OPIN_CUSTOT']);
                $opin->setOPIN_CUSTOU($row['OPIN_CUSTOU']);
                $opin->setOPIN_ID($row['OPIN_ID']);
                $opin->setOPIN_QTD($row['OPIN_QTD']);
                $opin->setOPIN_UM($row['OPIN_UM']);
                $opin->setORDEM_PRODUCAO_OP_ID($row['ORDEM_PRODUCAO_OP_ID']);
                $opin->setPRODUTOS_PROD_ID($row['PRODUTOS_PROD_ID']);

                $opins[] = $opin;
            }

            return $opins;
        } catch (PDOException $e) {
            error_log("Erro ao tentar buscar todos os insumos da OP: " . $e->getMessage());
            return [];
        }
    }

    public function buscarInsumo($idOPIN)
    {
        try {
            $sql = 'SELECT * FROM OP_INSUMOS WHERE OPIN_ID = :idopin';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(":idopin", $idOPIN);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$row) {
                return null;
            }

            $opin = new OPInsumo();
            $opin->setFORNECEDORES_CLIFOR_ID($row['FORNECEDORES_CLIFOR_ID']);
            $opin->setOPIN_CUSTOT($row['OPIN_CUSTOT']);
            $opin->setOPIN_CUSTOU($row['OPIN_CUSTOU']);
            $opin->setOPIN_ID($row['OPIN_ID']);
            $opin->setOPIN_QTD($row['OPIN_QTD']);
            $opin->setOPIN_UM($row['OPIN_UM']);
            $opin->setORDEM_PRODUCAO_OP_ID($row['ORDEM_PRODUCAO_OP_ID']);
            $opin->setPRODUTOS_PROD_ID($row['PRODUTOS_PROD_ID']);

            return $opin;
        } catch (PDOException $e) {
            error_log("Erro ao tentar buscar insumo: " . $e->getMessage());
            return null;
        }
    }

    public function editarInsumo($qtd, $custot, $idFor, $idOPIN)
    {
        try {
            $sql = 'UPDATE OP_INSUMOS
            SET OPIN_QTD = :qtd,
            OPIN_CUSTOT = :custot,
            FORNECEDORES_CLIFOR_ID = :idFornecedor
            WHERE OPIN_ID = :idOPIN;';

            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(":qtd", $qtd);
            $stmt->bindValue(":custot", $custot);
            $stmt->bindValue(":idFornecedor", $idFor);
            $stmt->bindValue(":idOPIN", $idOPIN);
            $stmt->execute();

            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            error_log("Erro ao tentar editar insumo: " . $e->getMessage());
            return false;
        }
    }

    public function deletarInsumo($idOPIN)
    {
        try {
            $sql = 'DELETE FROM OP_INSUMOS WHERE OPIN_ID = :idOPIN';

            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(":idOPIN", $idOPIN);
            $stmt->execute();

            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            error_log("Erro ao tentar deletar insumo: " . $e->getMessage());
            return false;
        }
    }

    public function somaCustotInsumos($idOP)
    {
        try {
            $sql = 'SELECT SUM(OPIN_CUSTOT) AS SOMA FROM OP_INSUMOS WHERE ORDEM_PRODUCAO_OP_ID = :idop';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(":idop", $idOP);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$row) {
                return null;
            }

            $soma = $row['SOMA'];

            return $soma;
        } catch (PDOException $e) {
            error_log("Erro ao tentar somar insumos: " . $e->getMessage());
            return null;
        }
    }
}