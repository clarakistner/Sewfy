<?php

require_once __DIR__ . '/config/BancoDeDados.php';
require_once __DIR__ . '/entidades/Usuario.php';
require_once __DIR__ . '/DAOs/UsuarioDAO.php';

// conexão com o banco de dados
$conn = conecta_bd();

// instancia o DAO
$usuarioDAO = new UsuarioDAO($conn);

// cria um novo usuário
$usuario = new Usuario();
$usuario->setEmail("teste@email.com");
$usuario->setSenha("123456");
$usuario->setNumero("47999999999");

// insere o usuário no banco de dados
$id = $usuarioDAO->criarUsuario($usuario);

// exibe o ID do novo usuário
echo "Usuário criado com ID: $id <br>";

// busca todos os usuários
$usuarios = $usuarioDAO->buscarUsuarios();
foreach ($usuarios as $usu) {
    echo "ID: " . $usu->getId() . " - Email: " . $usu->getEmail() . " - Número: " . $usu->getNumero() . "<br>";
}

// busca um usuário pelo email
$usuarioBuscado = $usuarioDAO->buscarUsuarioPorEmail("clarabkistner@gmail.com");
if ($usuarioBuscado) {
    echo "Usuário encontrado: ID " . $usuarioBuscado->getId() . " - Email: " . $usuarioBuscado->getEmail() . " - Número: " . $usuarioBuscado->getNumero() . "<br>";
} else {
    echo "Usuário não encontrado.<br>";
}

// atualiza a senha do usuário
$usuarioDAO->atualizarSenha($id, "novaSenha123");
echo "Senha atualizada para o usuário com ID: $id <br>";

// atualiza o email do usuário
$usuarioDAO->atualizarEmail($id, "novoemail@email.com");
echo "Email atualizado para o usuário com ID: $id <br>";

// deleta o usuário
$usuarioDAO->deletarUsuario($id = 1);
echo "Usuário com ID: $id deletado.<br>";

//listar novamente todos os usuários
$usuarios = $usuarioDAO->buscarUsuarios();
foreach ($usuarios as $usu) {
    echo "ID: " . $usu->getId() . " - Email: " . $usu->getEmail() . " - Número: " . $usu->getNumero() . "<br>";
}

?>