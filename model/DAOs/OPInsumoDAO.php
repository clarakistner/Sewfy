<?php

require_once __DIR__."/../entidades/OPInsumo.php";
require_once __DIR__."/../config/BancoDeDados.php";
class OPInsumoDAO{

private $conn;

public function __construct($conn){
    $this->conn= $conn;
}

public function criarOpInsumo(OPInsumo $opin){
    $sql = "INSERT INTO OP_INSUMOS(OPIN_UM, OPIN_QTD, OPIN_CUSTOU, OPIN_CUSTOT, PRODUTOS_PROD_ID, ORDEM_PRODUCAO_OP_ID, FORNECEDORES_CLIFOR_ID) VALUES (:um, :qtd, :custou, :custot, :prodid, :opid, :forid)";
    $stmt = $this->conn->prepare($sql);
    $stmt->bindValue(":um", $opin->getOPIN_UM());
    $stmt->bindValue(":qtd", $opin->getOPIN_QTD());
    $stmt->bindValue(":custou",$opin->getOPIN_CUSTOU());
    $stmt->bindValue(":custot", $opin->getOPIN_CUSTOT());
    $stmt->bindValue(":prodid", $opin->getPRODUTOS_PROD_ID());
    $stmt->bindValue(":opid", $opin->getORDEM_PRODUCAO_OP_ID());
    $stmt->bindValue(":forid", $opin->getFORNECEDORES_CLIFOR_ID());
    $stmt->execute();
    return $this->conn->lastInsertId();
}

}

?>