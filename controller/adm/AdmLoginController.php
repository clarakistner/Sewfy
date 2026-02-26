<?php

require_once __DIR__ . '/../../model/config/BancoDeDados.php';
require_once __DIR__ . '/../../model/DAOs/SewfyAdmDAO.php';


class AdmLoginController {

    private SewfyAdmDAO $sewfyAdmDAO;

    public function __construct() {
        $conn = conecta_bd();
        $this->sewfyAdmDAO = new SewfyAdmDAO($conn);
    }

    public function fazerLogin() {

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

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
        $adm = $this->sewfyAdmDAO->buscarAdmPorEmail($email);

        if (!$adm) {
            http_response_code(401);
            echo 'Email ou senha inválidos';
            return;
        }

        if (!$adm->getADM_ATIV()) {
            http_response_code(403);
            echo 'Conta inativa';
            return;
        }

        // Verifica senha
        if (!password_verify($senha, $adm->getADM_SENHA())) {
            http_response_code(401);
            echo 'Email ou senha inválidos';
            return;
        }

        // Login OK, cria sessão
        $_SESSION['ADM_ID'] = $adm->getADM_ID();
        $_SESSION['ADM_EMAIL'] = $adm->getADM_EMAIL();

        http_response_code(200);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['sucesso' => true]);
    }
}

?>