<?php

require_once __DIR__ . '/../../model/config/BancoDeDados.php';
require_once __DIR__ . '/../../model/DAOs/UsuarioDAO.php';

session_start();

class LoginController {

    private UsuarioDAO $usuarioDAO;

    public function __construct() {
        $conn = conecta_bd();
        $this->usuarioDAO = new UsuarioDAO($conn);
    }

    public function fazerLogin() {

        // Só aceita POST
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo 'Método não permitido';
            return;
        }

        $email = trim($_POST['email'] ?? '');
        $senha = trim($_POST['senha'] ?? '');

        if (empty($email) || empty($senha)) {
            http_response_code(400);
            echo 'Preencha email e senha';
            return;
        }

        // Busca usuário
        $usuario = $this->usuarioDAO->buscarUsuarioPorEmail($email);

        if (!$usuario) {
            http_response_code(401);
            echo 'Email ou senha inválidos';
            return;
        }

        // Verifica senha
        if (!password_verify($senha, $usuario->getSenha())) {
            http_response_code(401);
            echo 'Email ou senha inválidos';
            return;
        }

        // Login OK, cria sessão
        $_SESSION['usuario_id'] = $usuario->getId();
        $_SESSION['usuario_email'] = $usuario->getEmail();

        http_response_code(200);
        echo 'Login realizado com sucesso';
    }
}


$controller = new LoginController();
$controller->fazerLogin();

?>