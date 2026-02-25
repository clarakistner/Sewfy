<?php
require_once __DIR__ . '/../entidades/EmpresaUsuarios.php';
require_once __DIR__ . '/../config/BancoDeDados.php';
class EmpresaUsuariosDAO
{
    private $conn;
    public function __construct($conn)
    {
        $this->conn = $conn;
    }
    public function criarNovoUsuarioEmpresa(EmpresaUsuarios $ea)
    {
        try {
            $sql = 'INSERT INTO EMPRESA_USUARIOS VALUES (:idEmp, :idUsu, :ehProprietario, :ativoUsu)';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(":idEmp", $ea->getEMP_ID());
            $stmt->bindValue(":idUsu", $ea->getUSU_ID());
            $stmt->bindValue(":ehProprietario", $ea->getUSU_E_PROPRIETARIO());
            $stmt->bindValue(":ativoUsu", $ea->getUSU_ATIV());
            $stmt->execute();

            return $this->conn->lastInsertId();
        } catch (PDOException $e) {
            error_log('Erro ao tentar criar novo usuário na empresa: ' . $e->getMessage());
            return 0;
        }
    }
    public function buscaTodosUsuariosDaEmpresa($idEmp)
    {
        try {
            $sql = 'SELECT * FROM EMPRESA_USUARIOS WHERE EMP_ID = :idEmp';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(":idEmp", $idEmp);
            $stmt->execute();

            $usuarios = [];

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $usu = new EmpresaUsuarios();
                $usu->setEMP_ID($row['EMP_ID']);
                $usu->setUSU_ATIV($row['USU_ATIV']);
                $usu->setUSU_E_PROPRIETARIO($row['USU_E_PROPRIETARIO']);
                $usu->setUSU_ID($row['USU_ID']);

                $usuarios[] = $usu;
            }

            return $usuarios;
        } catch (PDOException $e) {
            error_log('Erro ao tentar buscar todos os usuario da empresa: ' . $e->getMessage());
            return [];
        }
    }
    public function buscaEmpresasUsuario($idUsu)
    {
        try {
            $sql = 'SELECT * FROM EMPRESA_USUARIOS WHERE USU_ID = :idUsu';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(":idUsu", $idUsu);
            $stmt->execute();

            $empresas = [];

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $emp = new EmpresaUsuarios();
                $emp->setEMP_ID($row['EMP_ID']);
                $emp->setUSU_ATIV($row['USU_ATIV']);
                $emp->setUSU_E_PROPRIETARIO($row['USU_E_PROPRIETARIO']);
                $emp->setUSU_ID($row['USU_ID']);

                $empresas[] = $emp;
            }

            return $empresas;
        } catch (PDOException $e) {
            error_log('Erro ao tentar buscar as empresas do usuario: ' . $e->getMessage());
            return [];
        }
    }
    public function buscaUsuarioEmEmpresa($idEmp, $idUsu)
    {
        try {
            $sql = 'SELECT * FROM EMPRESA_USUARIOS WHERE EMP_ID = :idEmp AND USU_ID = :idUsu';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(":idEmp", $idEmp);
            $stmt->bindValue(":idUsu", $idUsu);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$row) {
                return null;
            }

            $usuEmp = new EmpresaUsuarios();
            $usuEmp->setEMP_ID($row['EMP_ID']);
            $usuEmp->setUSU_ATIV($row['USU_ATIV']);
            $usuEmp->setUSU_E_PROPRIETARIO($row['USU_E_PROPRIETARIO']);
            $usuEmp->setUSU_ID($row['USU_ID']);
            return $usuEmp;
        } catch (PDOException $e) {
            error_log('Erro ao tentar buscar usuario em empresa: ' . $e->getMessage());
            return null;
        }
    }
    public function editaAtivoUsu($ativo, $idEmp, $idUsu)
    {
        try {
            $sql = 'UPDATE EMPRESA_USUARIOS SET USU_ATIV = :ativo WHERE EMP_ID = :idEmp AND USU_ID = :idUsu';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(":idEmp", $idEmp);
            $stmt->bindValue(":idUsu", $idUsu);
            $stmt->bindValue(":ativo", $ativo);
            $stmt->execute();

            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            error_log('Erro ao tentar editar ativo: ' . $e->getMessage());
            return false;
        }
    }
    public function editaEhProprietario($ehProprietario, $idEmp, $idUsu)
    {
        try {
            $sql = 'UPDATE EMPRESA_USUARIOS SET USU_E_PROPRIETARIO = :ehProprietario WHERE EMP_ID = :idEmp AND USU_ID = :idUsu';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(":idEmp", $idEmp);
            $stmt->bindValue(":idUsu", $idUsu);
            $stmt->bindValue(":ehProprietario", $ehProprietario);
            $stmt->execute();

            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            error_log('Erro ao tentar editar a classificação do usuário: ' . $e->getMessage());
            return false;
        }
    }
}
