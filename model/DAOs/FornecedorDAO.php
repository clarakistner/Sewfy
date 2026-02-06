<?php

require_once __DIR__ . '/../config/BancoDeDados.php';
require_once __DIR__ . '/../entidades/Fornecedor.php';

class FornecedorDAO {

    private PDO $conn;

    public function __construct(PDO $conn) {
        $this->conn = $conn;
    }

    // Cria um novo fornecedor no banco de dados
    public function criarFornecedor(Fornecedor $fornecedor): int {
        try {
            $sql = "INSERT INTO FORNECEDORES 
                (USUARIOS_USU_ID, CLIFOR_NOME, CLIFOR_CPFCNPJ, CLIFOR_NUM, CLIFOR_END, CLIFOR_ATIV) 
                VALUES 
                (:usuarioId, :nome, :cpfCnpj, :telefone, :endereco, :ativo)";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':usuarioId', $fornecedor->getUsuarioId(), PDO::PARAM_INT);
            $stmt->bindValue(':nome', $fornecedor->getNome());
            $stmt->bindValue(':cpfCnpj', $fornecedor->getCpfCnpj());
            $stmt->bindValue(':telefone', $fornecedor->getTelefone());
            $stmt->bindValue(':endereco', $fornecedor->getEndereco());
            $stmt->bindValue(':ativo', $fornecedor->getAtivo(), PDO::PARAM_INT);

            $stmt->execute();

            return (int) $this->conn->lastInsertId();

        } catch (PDOException $e) {
            error_log('Erro ao criar fornecedor: ' . $e->getMessage());
            return 0;
        }
    }

    // Busca todos os fornecedores do usuário
    public function buscarFornecedores(int $usuarioId): array {
        try {
            $sql = "SELECT * FROM FORNECEDORES WHERE USUARIOS_USU_ID = :usuarioId ORDER BY CLIFOR_ATIV DESC, CLIFOR_NOME ASC";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':usuarioId', $usuarioId, PDO::PARAM_INT);
            $stmt->execute();

            $fornecedores = [];

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $fornecedor = new Fornecedor();
                $fornecedor->setId($row['CLIFOR_ID']);
                $fornecedor->setUsuarioId($row['USUARIOS_USU_ID']);
                $fornecedor->setNome($row['CLIFOR_NOME']);
                $fornecedor->setCpfCnpj($row['CLIFOR_CPFCNPJ']);
                $fornecedor->setTelefone($row['CLIFOR_NUM']);
                $fornecedor->setEndereco($row['CLIFOR_END']);
                $fornecedor->setAtivo((int)$row['CLIFOR_ATIV']);

                $fornecedores[] = $fornecedor;
            }

            return $fornecedores;

        } catch (PDOException $e) {
            error_log('Erro ao buscar fornecedores: ' . $e->getMessage());
            return [];
        }
    }

    // Busca fornecedor pelo nome ou CPF/CNPJ
    public function buscarFornecedoresPorNomeOuCpfCnpj(string $termo, int $usuarioId): array {
        try {
            $sql = "SELECT * FROM FORNECEDORES
                    WHERE USUARIOS_USU_ID = :usuarioId
                    AND (CLIFOR_NOME LIKE :termo OR CLIFOR_CPFCNPJ LIKE :termo)";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':usuarioId', $usuarioId, PDO::PARAM_INT);
            $stmt->bindValue(':termo', "%$termo%");
            $stmt->execute();

            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $fornecedores = [];

            foreach ($rows as $row) {
                $fornecedor = new Fornecedor();
                $fornecedor->setId($row['CLIFOR_ID']);
                $fornecedor->setUsuarioId($row['USUARIOS_USU_ID']);
                $fornecedor->setNome($row['CLIFOR_NOME']);
                $fornecedor->setCpfCnpj($row['CLIFOR_CPFCNPJ']);
                $fornecedor->setTelefone($row['CLIFOR_NUM']);
                $fornecedor->setEndereco($row['CLIFOR_END']);
                $fornecedor->setAtivo((int)$row['CLIFOR_ATIV']);

                $fornecedores[] = $fornecedor;
            }

            return $fornecedores;

        } catch (PDOException $e) {
            error_log('Erro ao buscar fornecedores: ' . $e->getMessage());
            return [];
        }
    }


    // Deleta um fornecedor pelo ID (e usuário)
    public function deletarFornecedor(int $id, int $usuarioId): bool {
        try {
            $sql = "DELETE FROM FORNECEDORES 
                    WHERE CLIFOR_ID = :id AND USUARIOS_USU_ID = :usuarioId";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            $stmt->bindValue(':usuarioId', $usuarioId, PDO::PARAM_INT);

            return $stmt->execute();

        } catch (PDOException $e) {
            error_log('Erro ao deletar fornecedor: ' . $e->getMessage());
            return false;
        }
    }

    // Atualiza um fornecedor existente
    public function atualizarFornecedor(Fornecedor $fornecedor): bool {
        try {
            $sql = "UPDATE FORNECEDORES 
                    SET CLIFOR_NOME = :nome,
                        CLIFOR_CPFCNPJ = :cpfCnpj,
                        CLIFOR_NUM = :telefone,
                        CLIFOR_END = :endereco,
                        CLIFOR_ATIV = :ativo
                    WHERE CLIFOR_ID = :id
                      AND USUARIOS_USU_ID = :usuarioId";

            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':nome', $fornecedor->getNome());
            $stmt->bindValue(':cpfCnpj', $fornecedor->getCpfCnpj());
            $stmt->bindValue(':telefone', $fornecedor->getTelefone());
            $stmt->bindValue(':endereco', $fornecedor->getEndereco());
            $stmt->bindValue(':ativo', $fornecedor->getAtivo(), PDO::PARAM_INT);
            $stmt->bindValue(':id', $fornecedor->getId(), PDO::PARAM_INT);
            $stmt->bindValue(':usuarioId', $fornecedor->getUsuarioId(), PDO::PARAM_INT);

            return $stmt->execute();

        } catch (PDOException $e) {
            error_log('Erro ao atualizar fornecedor: ' . $e->getMessage());
            return false;
        }
    }

    // Busca um fornecedor pelo ID
    public function buscarFornecedorPorId(int $id, int $usuarioId): ?Fornecedor{
        $sql = "SELECT * FROM FORNECEDORES 
                WHERE CLIFOR_ID = :id 
                AND USUARIOS_USU_ID = :usuarioId";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->bindValue(':usuarioId', $usuarioId, PDO::PARAM_INT);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            return null;
        }

        $fornecedor = new Fornecedor();
        $fornecedor->setId($row['CLIFOR_ID']);
        $fornecedor->setUsuarioId($row['USUARIOS_USU_ID']);
        $fornecedor->setNome($row['CLIFOR_NOME']);
        $fornecedor->setCpfCnpj($row['CLIFOR_CPFCNPJ']);
        $fornecedor->setTelefone($row['CLIFOR_NUM']);
        $fornecedor->setEndereco($row['CLIFOR_END']);
        $fornecedor->setAtivo((int)$row['CLIFOR_ATIV']);

        return $fornecedor;
    }


    // Verifica se CPF/CNPJ já existe para outro fornecedor do mesmo usuário
    public function cpfCnpjJaExiste(
        string $cpfCnpjNumerico,
        int $usuarioId
    ): bool {
        $sql = "
            SELECT 1
            FROM fornecedores
            WHERE CLIFOR_CPFCNPJ = :cpf
            AND USUARIOS_USU_ID = :usuario
            LIMIT 1
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':cpf', $cpfCnpjNumerico);
        $stmt->bindValue(':usuario', $usuarioId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch() !== false;
    }

    public function cpfCnpjJaExisteParaOutroFornecedor(
        string $cpfCnpjNumerico,
        int $usuarioId,
        int $fornecedorId
    ): bool {
        $sql = "
            SELECT 1
            FROM fornecedores
            WHERE CLIFOR_CPFCNPJ = :cpf
            AND USUARIOS_USU_ID = :usuario
            AND CLIFOR_ID <> :id
            LIMIT 1
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':cpf', $cpfCnpjNumerico);
        $stmt->bindValue(':usuario', $usuarioId, PDO::PARAM_INT);
        $stmt->bindValue(':id', $fornecedorId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch() !== false;
    }


}
