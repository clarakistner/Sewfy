<?php

// teste basica de conexão com o banco de dados
require_once __DIR__ . '/BancoDeDados.php';

try {
    $conn = conecta_bd();
    echo "Conexão OK";
} catch (PDOException $e) {
    echo "Erro: " . $e->getMessage();
}

?>