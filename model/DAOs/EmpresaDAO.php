<?php

require_once __DIR__ . '/../config/BancoDeDados.php';
require_once __DIR__ . '/../entidades/Empresa.php';


class EmpresaDAO{
     private PDO $conn;

    public function __construct(PDO $conn) {
        $this->conn = $conn;
    }


    //Criar Empresa
    function criarEmpresa(Empresa $empresa): int
    {
        $sql = "INSERT INTO EMPRESAS(EMP_NOME, EMP_RAZ,EMP_CNPJ, EMP_EMAIL, EMP_NUM, EMP_ATIV, ADM_ID) VALUES (:nome, :razao, :cnpj, :email, :numero, :ativ, :idadm) ";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':nome', $empresa->getEMP_NOME());
        $stmt->bindValue(':razao', $empresa->getEMP_RAZ());
        $stmt->bindValue(':cnpj', $empresa->getEMP_CNPJ());
        $stmt->bindValue(':email', $empresa->getEMP_EMAIL());
        $stmt->bindValue(':numero', $empresa->getEMP_NUM());
        $stmt->bindValue(':ativ', $empresa->getEMP_ATIV());
        $stmt->bindValue(':idadm', $empresa->getADM_ID());
        $stmt->execute();
        return $this->conn->lastInsertId();
    }


    // Buscar Empresas
    function buscarEmpresas(): array
    {
        $sql = "SELECT * FROM EMPRESAS";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        $empresas = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $empresa = new Empresa();

            $empresa->setEMP_ID($row['EMP_ID']);
            $empresa->setEMP_NOME($row['EMP_NOME']);
            $empresa->setEMP_RAZ($row['EMP_RAZ']);
            $empresa->setEMP_CNPJ($row['EMP_CNPJ']);
            $empresa->setEMP_EMAIL($row['EMP_EMAIL']);
            $empresa->setEMP_NUM($row['EMP_NUM']);
            $empresa->setEMP_ATIV($row['EMP_ATIV']);
            $empresa->setEMP_DATAC($row['EMP_DATAC']);
            $empresa->setADM_ID($row['ADM_ID']);

            $empresas[] = $empresa;
        }

        return $empresas;
    }

    //Busca empresa pelo id
    public function buscarEmpresaPorID($idEmpresa)
    {
        $sql = 'SELECT * FROM EMPRESAS WHERE EMP_ID = :idempresa';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(":idempresa", $idEmpresa);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            return null;
        }

        $empresa = new Empresa();

        $empresa->setEMP_ID($row['EMP_ID']);
        $empresa->setEMP_NOME($row['EMP_NOME']);
        $empresa->setEMP_RAZ($row['EMP_RAZ']);
        $empresa->setEMP_CNPJ($row['EMP_CNPJ']);
        $empresa->setEMP_EMAIL($row['EMP_EMAIL']);
        $empresa->setEMP_NUM($row['EMP_NUM']);
        $empresa->setEMP_ATIV($row['EMP_ATIV']);
        $empresa->setEMP_DATAC($row['EMP_DATAC']);
        $empresa->setADM_ID($row['ADM_ID']);

        return $empresa;
    }

    // Editar Empresa
    function editarEmpresa(Empresa $empresa): bool{
         $sql = "UPDATE EMPRESAS SET EMP_NOME = :nome,
                    EMP_RAZ = :razao,
                    EMP_CNPJ = :cnpj,
                    EMP_EMAIL = :email,
                    EMP_NUM = :numero,
                    EMP_ATIV = :ativ WHERE EMP_ID = :id";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':nome', $empresa->getEMP_NOME());
            $stmt->bindValue(':razao', $empresa->getEMP_RAZ());
            $stmt->bindValue(':cnpj', $empresa->getEMP_CNPJ());
            $stmt->bindValue(':email', $empresa->getEMP_EMAIL());
            $stmt->bindValue(':numero', $empresa->getEMP_NUM());
            $stmt->bindValue(':ativ', $empresa->getEMP_ATIV(), PDO::PARAM_INT);
            $stmt->bindValue(':id', $empresa->getEMP_ID(), PDO::PARAM_INT);

            return $stmt->execute();
    }

}
?>