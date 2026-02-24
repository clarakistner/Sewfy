<?php

require_once __DIR__ . '/../config/BancoDeDados.php';

class EmpresaModulosDAO {

    private PDO $conn;

    public function __construct(PDO $conn) {
        $this->conn = $conn;
    }

    // Vincular módulo a uma empresa
    public function vincularModulo(int $empId, int $modId): bool {
        $sql  = "INSERT INTO EMPRESA_MODULOS (EMP_ID, MOD_ID) VALUES (:empid, :modid)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':empid', $empId, PDO::PARAM_INT);
        $stmt->bindValue(':modid', $modId, PDO::PARAM_INT);
        return $stmt->execute();
    }

    // Desvincular módulo de uma empresa
    public function desvincularModulo(int $empId, int $modId): bool {
        $sql  = "DELETE FROM EMPRESA_MODULOS WHERE EMP_ID = :empid AND MOD_ID = :modid";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':empid', $empId, PDO::PARAM_INT);
        $stmt->bindValue(':modid', $modId, PDO::PARAM_INT);
        return $stmt->execute();
    }

    // Buscar todos os módulos de uma empresa
    public function buscarModulosPorEmpresa(int $empId): array {
        $sql  = "SELECT MOD_ID FROM EMPRESA_MODULOS WHERE EMP_ID = :empid";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':empid', $empId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    // Verificar se uma empresa possui determinado módulo
    public function empresaPossuiModulo(int $empId, int $modId): bool {
        $sql  = "SELECT 1 FROM EMPRESA_MODULOS WHERE EMP_ID = :empid AND MOD_ID = :modid";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':empid', $empId, PDO::PARAM_INT);
        $stmt->bindValue(':modid', $modId, PDO::PARAM_INT);
        $stmt->execute();
        return (bool) $stmt->fetch();
    }
}

?>