<?php

require_once __DIR__ . '/../config/BancoDeDados.php';
require_once __DIR__ . '/../entidades/SewfyAdm.php';
class SewfyAdmDAO{
    private PDO $conn;

    public function __construct(PDO $conn) {
        $this->conn = $conn;
    }

    //Busca adm por email
    public function buscarAdmPorEmail($email): ?SewfyAdm {
        $sql = "SELECT * FROM SEWFY_ADMINS WHERE ADM_EMAIL = :email";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':email', $email);
        $stmt->execute();
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($resultado) {
            $adm= new SewfyAdm();
            $adm->setADM_ID($resultado['ADM_ID']);
            $adm->setADM_EMAIL($resultado['ADM_EMAIL']);
            $adm->setADM_SENHA($resultado['ADM_SENHA']);
            $adm->setADM_ATIV($resultado['ADM_ATIV']); 

            return $adm;
        }

        return null;
    }


}
?>