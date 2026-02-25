<?php
require_once __DIR__ . '/../entidades/Convite.php';
require_once __DIR__ . '/../../model/config/BancoDeDados.php';
class ConvitesDAO
{
    private $conn;
    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    public function criarConvite(Convite $convite)
    {
        try {
            $sql = 'INSERT INTO CONVITES (EMP_ID, CONV_EMAIL, CONV_TOKEN, CONV_EXPIRA, CONV_USADO, CONVIDADO_POR) VALUES (:idEmp, :email, :token, :expira, :foiUsado, :convidadoPor)';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(":idEmp", $convite->getEMP_ID());
            $stmt->bindValue(":email", $convite->getCONV_EMAIL());
            $stmt->bindValue(":token", $convite->getCONV_TOKEN());
            $stmt->bindValue(":expira", $convite->getCONV_EXPIRA());
            $stmt->bindValue(":foiUsado", $convite->getCONV_USADO());
            $stmt->bindValue(":convidadoPor", $convite->getCONVIDADO_POR());
            $stmt->execute();

            return (int) $this->conn->lastInsertId();
        } catch (PDOException $e) {
            error_log('Erro ao tentar criar um convite: ' . $e->getMessage());
            return 0;
        }
    }
    public function confirmarConvite($idConvite, $idEmp)
    {
        try {
            $sql = 'UPDATE CONVITES
                    SET CONV_USADO = 1
                    WHERE EMP_ID = :idEmp  AND CONV_ID = :idConvite';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(":idEmp", $idEmp);
            $stmt->bindValue(":idConvite", $idConvite);
            $stmt->execute();

            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            error_log("Erro ao tentar confirmar convite: " . $e->getMessage());
            return false;
        }
    }
    public function buscaConvite($idConvite, $idEmp)
    {
        try {
            $sql = 'SELECT * FROM CONVITES WHERE EMP_ID = :idEmp  AND CONV_ID = :idConvite';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(":idEmp", $idEmp);
            $stmt->bindValue(":idConvite", $idConvite);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if(!$row){
                return null;
            }
            $convite = new Convite();

            $convite->setCONV_EMAIL($row['CONV_EMAIL']);
            $convite->setCONV_EXPIRA($row['CONV_EXPIRA']);
            $convite->setCONV_ID($row['CONV_ID']);
            $convite->setCONV_TOKEN($row['CONV_TOKEN']);
            $convite->setCONV_USADO($row['CONV_USADO']);
            $convite->setCONVIDADO_POR($row['CONVIDADO_POR']);
            $convite->setEMP_ID($row['EMP_ID']);

            return $convite;
        } catch (PDOException $e) {
            error_log("Erro ao tentar buscar convite: " . $e->getMessage());
            return null;
        }
    }
    public function buscaTodosConvitesEmpresa($idEmp)
    {
        try {
            $sql = 'SELECT * FROM CONVITES WHERE EMP_ID = :idEmp ';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(":idEmp", $idEmp);
            $stmt->execute();
            
            $convites =[];

            while($row = $stmt->fetch(PDO::FETCH_ASSOC)){

            $convite = new Convite();

            $convite->setCONV_EMAIL($row['CONV_EMAIL']);
            $convite->setCONV_EXPIRA($row['CONV_EXPIRA']);
            $convite->setCONV_ID($row['CONV_ID']);
            $convite->setCONV_TOKEN($row['CONV_TOKEN']);
            $convite->setCONV_USADO($row['CONV_USADO']);
            $convite->setCONVIDADO_POR($row['CONVIDADO_POR']);
            $convite->setEMP_ID($row['EMP_ID']);

            $convites[] = $convite;
            }
            

            return $convites;
        } catch (PDOException $e) {
            error_log("Erro ao tentar buscar convite: " . $e->getMessage());
            return [];
        }
    }
    public function retornaDataExpira($idConvite, $idEmp)
    {
        try {
            $sql = 'SELECT CONV_EXPIRA FROM CONVITES WHERE EMP_ID = :idEmp  AND CONV_ID = :idConvite';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(":idEmp", $idEmp);
            $stmt->bindValue(":idConvite", $idConvite);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if(!$row){
                return null;
            }
            
            return $row['CONV_EXPIRA'];
        } catch (PDOException $e) {
            error_log("Erro ao tentar data de expiração convite: " . $e->getMessage());
            return null;
        }
    }
}
