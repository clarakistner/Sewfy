<?php

require_once __DIR__ . '/../../model/config/BancoDeDados.php';
require_once __DIR__ . '/../../model/DAOs/EmpresaDAO.php';
require_once __DIR__ . '/../../model/DAOs/EmpresaModulosDAO.php';
require_once __DIR__ . '/../../model/DAOs/UsuarioDAO.php';

class VisualizarEmpresaController
{
    private EmpresaDAO $empresaDAO;
    private EmpresaModulosDAO $empresaModulosDAO;
    private UsuarioDAO $usuarioDAO;

    public function __construct()
    {
        $conn = conecta_bd();
        $this->empresaDAO        = new EmpresaDAO($conn);
        $this->empresaModulosDAO = new EmpresaModulosDAO($conn);
        $this->usuarioDAO        = new UsuarioDAO($conn);
    }

    public function visualizar(int $id): void
    {
        header('Content-Type: application/json; charset=utf-8');

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        if (empty($_SESSION['ADM_ID'])) {
            http_response_code(401);
            echo json_encode(['erro' => 'acesso restrito a administradores']);
            return;
        }

        $empresa = $this->empresaDAO->buscarEmpresaPorId($id);

        if (!$empresa) {
            http_response_code(404);
            echo json_encode(['erro' => 'Empresa não encontrada']);
            return;
        }

        $modulos     = $this->empresaModulosDAO->buscarModulosPorEmpresa($id);
        $proprietario = $this->usuarioDAO->buscarProprietarioPorEmpresa($id);

        $resultado = [
            'id'           => $empresa->getEMP_ID(),
            'nome'         => $empresa->getEMP_NOME(),
            'razao'        => $empresa->getEMP_RAZ(),
            'cnpj'         => $empresa->getEMP_CNPJ(),
            'email'        => $empresa->getEMP_EMAIL(),
            'numero'       => $empresa->getEMP_NUM(),
            'ativo'        => $empresa->getEMP_ATIV(),
            'modulos'      => $modulos,
            'usuarioNome'  => $proprietario?->getNome()  ?? '',
            'usuarioEmail' => $proprietario?->getEmail() ?? '',
        ];

        http_response_code(200);
        echo json_encode($resultado);
    }
}