<?php
//arquivo temporário para gerar hash de senha para o banco de dados
$senha = 'N0v@S&nHa!2026';

$hash = password_hash($senha, PASSWORD_DEFAULT);

echo '<h3>Senha original:</h3>';
echo '<p>' . htmlspecialchars($senha) . '</p>';

echo '<h3>Hash gerado:</h3>';
echo '<p>' . $hash . '</p>';

?>