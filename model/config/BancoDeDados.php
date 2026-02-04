<?php

// Configuração da conexão com o banco de dados usando PDO
function conecta_bd(): PDO {
    $host = "localhost";
    $port = "3306";
    $dbname = "sewfy";
    $username = "root";
    $password = 'deixesuasenhaaqui';

    $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";

    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    return $pdo;
}


?>