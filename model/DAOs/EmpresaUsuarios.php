<?php
require_once __DIR__ . '/../entidades/EmpresaUsuarios.php';
require_once __DIR__ . '/../config/BancoDeDados.php';
class EmpresaUsuarios{
    private $conn;
    public function __construct($conn)
    {
        $this->conn = $conn;
    }
    public function criarNovoUsuarioEmpresa(EmpresaUsuarios $ea){
        
    }
}