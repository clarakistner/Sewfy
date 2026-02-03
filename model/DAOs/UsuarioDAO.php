<?php

require_once __DIR__ . '/../config/BancoDeDados.php';
require_once __DIR__ . '/../entidades/Usuario.php';

$conn = conecta_bd();

class UsuarioDAO {

    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }


    // Cria um novo usuário no banco de dados
    public function criarUsuario(Usuario $usuario): int {
        $sql = "INSERT INTO USUARIOS (USU_EMAIL, USU_SENHA, USU_NUM) VALUES (:email, :senha, :numero)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':email', $usuario->getEmail());
        $stmt->bindValue(':senha', password_hash($usuario->getSenha(), PASSWORD_BCRYPT));
        $stmt->bindValue(':numero', $usuario->getNumero()); 
        $stmt->execute();

        return $this->conn->lastInsertId();
    }


    // Busca todos os usuários no banco de dados
    public function buscarUsuarios(): array {
        $sql = "SELECT * FROM USUARIOS";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        $usuarios = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $usuario = new Usuario();
            $usuario->setId($row['USU_ID']);
            $usuario->setEmail($row['USU_EMAIL']);
            $usuario->setSenha($row['USU_SENHA']);
            $usuario->setNumero($row['USU_NUM']);

            $usuarios[] = $usuario;
        }

        return $usuarios;
    }


    // Busca um usuário pelo email
    public function buscarUsuarioPorEmail($email): ?Usuario {
        $sql = "SELECT * FROM USUARIOS WHERE USU_EMAIL = :email";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':email', $email);
        $stmt->execute();
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($resultado) {
            $usuario = new Usuario();
            $usuario->setId($resultado['USU_ID']);
            $usuario->setEmail($resultado['USU_EMAIL']);
            $usuario->setSenha($resultado['USU_SENHA']);
            $usuario->setNumero($resultado['USU_NUM']); 

            return $usuario;
        }

        return null;
    }

    
    // Deleta um usuário pelo ID
    function deletarUsuario($id): bool {
        $sql = "DELETE FROM USUARIOS WHERE USU_ID = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':id', $id);

        return $stmt->execute();
    }


    // Atualiza a senha de um usuário
    function atualizarSenha($id, $novaSenha): bool {
        $sql = "UPDATE USUARIOS SET USU_SENHA = :senha WHERE USU_ID = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':senha', password_hash($novaSenha, PASSWORD_BCRYPT));
        $stmt->bindValue(':id', $id);

        return $stmt->execute();
    }


    // Atualiza o email de um usuário
    function atualizarEmail($id, $novoEmail): bool {
        $sql = "UPDATE USUARIOS SET USU_EMAIL = :email WHERE USU_ID = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':email', $novoEmail);
        $stmt->bindValue(':id', $id);

        return $stmt->execute();
    }

}