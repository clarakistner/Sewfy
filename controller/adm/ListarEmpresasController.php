<?php

require_once __DIR__ . '/../../model/config/BancoDeDados.php';
require_once __DIR__ . '/../../model/DAOs/EmpresaDAO.php';
require_once __DIR__ . '/../../model/DAOs/EmpresaModulosDAO.php';

class ListarEmpresasController
{
    
    private EmpresaDAO $empresasDAO;
    private EmpresaModulosDAO $empresaModulosDAO;

    public function __construct()
    {
        $conn = conecta_bd();
        $this->empresasDAO = new EmpresaDAO($conn);
        $this->empresaModulosDAO = new EmpresaModulosDAO($conn);
    }

    public function listar(): void
    {
       
        header('Content-Type: application/json; charset=utf-8');

        try {
            
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }

            if (empty($_SESSION['ADM_ID'])) {
                http_response_code(401);
                echo json_encode(['erro' => 'acesso restrito a administradores']);
                return;
            }
           
            $empresas = $this->empresasDAO->buscarEmpresas();
            
            $resultado = [];

            foreach ($empresas as $empresa) {

                $modulos = $this->empresaModulosDAO->buscarModulosPorEmpresa($empresa->getEMP_ID());

                $resultado[] = [
                    'id'       => $empresa->getEMP_ID(),
                    'nome'     => $empresa->getEMP_NOME(),
                    'razao'    => $empresa->getEMP_RAZ(),
                    'cnpj'     => $empresa->getEMP_CNPJ(),
                    'email'    => $empresa->getEMP_EMAIL(),
                    'numero'   => $empresa->getEMP_NUM(),
                    'ativo'    => $empresa->getEMP_ATIV(),
                    'modulos'  => $modulos
                ];
            }

            http_response_code(200);
            echo json_encode($resultado);

        } catch (Throwable $e) {
            error_log('Erro ao buscar empresas: ' . $e->getMessage());
            http_response_code(500);
            echo json_encode(['erro' => 'Erro interno ao buscar empresas']);
        }
    }
}