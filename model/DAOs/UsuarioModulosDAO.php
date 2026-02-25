<?php
require_once __DIR__ . '/../config/BancoDeDados.php';
require_once __DIR__ . '/../entidades/UsuarioModulos.php';
class UsuarioModulosDAO
{
    private $conn;
    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    public function criaUsuModulo(UsuarioModulos $usuMod)
    {
        try {

            $sql = 'INSERT INTO USUARIO_MODULOS VALUES(:idUsu, :idEmp, :idMod, :concedidoPor)';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(":idUsu", $usuMod->getUSU_ID());
            $stmt->bindValue(":idEmp", $usuMod->getEMP_ID());
            $stmt->bindValue(":idMod", $usuMod->getMOD_ID());
            $stmt->bindValue(":concedidoPor", $usuMod->getCONCEDIDO_POR());
            $stmt->execute();

            return $this->conn->lastInsertId();
        } catch (PDOException $e) {
            error_log('Erro ao tentar criar modulo do usuario: ' . $e->getMessage());
            return 0;
        }
    }
    public function buscaTodosModulosUsu($idUsu, $idEmp)
    {
        try {
            $sql = 'SELECT * FROM USUARIO_MODULOS WHERE EMP_ID = :idEmp AND USU_ID = :idUsu';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(":idUsu", $idUsu);
            $stmt->bindValue(":idEmp", $idEmp);
            $stmt->execute();

            $modulos = [];

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $mod = new UsuarioModulos();
                $mod->setCONCEDIDO_POR($row['CONCEDIDO_POR']);
                $mod->setEMP_ID($row['EMP_ID']);
                $mod->setMOD_ID($row['MOD_ID']);
                $mod->setUSU_ID($row['USU_ID']);

                $modulos[] = $mod;
            }

            return $modulos;
        } catch (PDOException $e) {
            error_log('Erro ao tentar buscar todos os modulos do usuario: ' . $e->getMessage());
            return [];
        }
    }
}
