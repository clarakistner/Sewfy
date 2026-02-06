<?php

require_once __DIR__ . '/../../model/config/BancoDeDados.php';
require_once __DIR__ . '/../../model/DAOs/UsuarioDAO.php';
require_once __DIR__ . '/../../model/entidades/Usuario.php';

class CadastroController {

    private UsuarioDAO $usuarioDAO;

    public function __construct() {
        $conn = conecta_bd();
        $this->usuarioDAO = new UsuarioDAO($conn);
    }

    public function cadastrar() {

        // Só aceita POST
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo "Método não permitido";
            return;
        }

        if (
            empty($_POST['email']) ||
            empty($_POST['senha']) ||
            empty($_POST['numero'])
        ) {
            http_response_code(400);
            echo "Dados obrigatórios não enviados";
            return;
        }

        // Evita duplicidade
        if ($this->usuarioDAO->buscarUsuarioPorEmail($_POST['email'])) {
            http_response_code(409);
            echo "E-mail já cadastrado";
            return;
        }

        // Criação do objeto
        $usuario = new Usuario();
        $usuario->setEmail($_POST['email']);
        $usuario->setSenha($_POST['senha']);
        $usuario->setNumero($_POST['numero']);

        try {
            $this->usuarioDAO->criarUsuario($usuario);
            echo "Usuário cadastrado com sucesso";
        } catch (Exception $e) {
            http_response_code(500);
            echo "Erro ao cadastrar usuário";
        }
    }
}

$controller = new CadastroController();
$controller->cadastrar();

?>
        