<?php

require_once __DIR__ . '/../config/BancoDeDados.php';
require_once __DIR__ . '/../entidades/Usuario.php';

class UsuarioDAO {

    private PDO $conn;

    public function __construct(PDO $conn) {
        $this->conn = $conn;
    }

    // =========================================================
    // HELPERS
    // =========================================================

    private function mapear(array $row): Usuario {
        $usuario = new Usuario();
        $usuario->setId($row['USU_ID']);
        $usuario->setNome($row['USU_NOME']);
        $usuario->setEmail($row['USU_EMAIL']);
        $usuario->setSenha($row['USU_SENHA']);
        $usuario->setNumero($row['USU_NUM']);
        $usuario->setAtivo($row['USU_ATIV']);
        return $usuario;
    }

    // =========================================================
    // CRIAR
    // =========================================================

    public function criarUsuario(Usuario $usuario): int {
        $sql = "INSERT INTO USUARIOS (USU_NOME, USU_EMAIL, USU_SENHA, USU_NUM)
                VALUES (:nome, :email, :senha, :numero)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':nome',   $usuario->getNome());
        $stmt->bindValue(':email',  $usuario->getEmail());
        $stmt->bindValue(':senha',  password_hash($usuario->getSenha(), PASSWORD_BCRYPT));
        $stmt->bindValue(':numero', $usuario->getNumero());
        $stmt->execute();

        return (int) $this->conn->lastInsertId();
    }

    // =========================================================
    // BUSCAR
    // =========================================================

    public function buscarUsuarios(): array {
        $sql  = "SELECT * FROM USUARIOS";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        $usuarios = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $usuarios[] = $this->mapear($row);
        }

        return $usuarios;
    }

    public function buscarUsuarioPorEmail(string $email): ?Usuario {
        $sql  = "SELECT * FROM USUARIOS WHERE USU_EMAIL = :email";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':email', $email);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? $this->mapear($row) : null;
    }

    /**
     * Busca o usuário proprietário (USU_E_PROPRIETARIO = 1) de uma empresa.
     * Usado pelo VisualizarEmpresaController para retornar usuarioNome e usuarioEmail.
     */
    public function buscarProprietarioPorEmpresa(int $empId): ?Usuario {
        $sql = "SELECT u.*
                FROM USUARIOS u
                INNER JOIN EMPRESA_USUARIOS eu ON eu.USU_ID = u.USU_ID
                WHERE eu.EMP_ID = :empId
                  AND eu.USU_E_PROPRIETARIO = 1
                LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':empId', $empId, PDO::PARAM_INT);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? $this->mapear($row) : null;
    }

    // =========================================================
    // ATUALIZAR
    // =========================================================

    public function atualizarUsuario(Usuario $usuario): bool {
        $sql = "UPDATE USUARIOS SET
                    USU_NOME  = :nome,
                    USU_EMAIL = :email,
                    USU_NUM   = :numero,
                    USU_ATIV  = :ativo
                WHERE USU_ID = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':nome',   $usuario->getNome());
        $stmt->bindValue(':email',  $usuario->getEmail());
        $stmt->bindValue(':numero', $usuario->getNumero());
        $stmt->bindValue(':ativo',  $usuario->getAtivo(), PDO::PARAM_INT);
        $stmt->bindValue(':id',     $usuario->getId(),    PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function atualizarSenha(int $id, string $novaSenha): bool {
        $sql  = "UPDATE USUARIOS SET USU_SENHA = :senha WHERE USU_ID = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':senha', password_hash($novaSenha, PASSWORD_BCRYPT));
        $stmt->bindValue(':id',    $id, PDO::PARAM_INT);

        return $stmt->execute();
    }
}