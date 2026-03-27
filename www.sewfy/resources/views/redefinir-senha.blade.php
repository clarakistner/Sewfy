<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sewfy</title>

    <link rel="stylesheet" href="redefinirsenha.css?v=1.0.2">
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=visibility" />
</head>

<body>
    <div class="pagina">
        <div class="container">


            <div class="logo">
                <h1 id="titulo">Sewfy</h1>
            </div>


            <div class="box-redefinir">
                <h2>Redefinição Senha</h2>

                <form method="POST" action="">
                    <div class="campo-formulario">
                        <label for="nova-senha">Nova senha</label>
                        <box class="campo-nova-senha">
                            <input id="nova-senha" name="nova-senha" type="password" placeholder="••••••••" required>
                            <span class="material-symbols-outlined botao-senha">
                                visibility
                            </span>
                        </box>

                    </div>

                    <div class="campo-formulario">
                        <label for="confirma-nova-senha">Confirmar nova senha</label>
                        <box class="campo-confirma-nova-senha">
                            <input id="confirma-nova-senha" name="confirma-nova-senha" type="password"
                                placeholder="••••••••" required>
                            <span class="material-symbols-outlined botao-senha">
                                visibility
                            </span>
                        </box>

                    </div>
                    <button type="submit">Redefinir Senha</button>
                </form>
            </div>
            <div class="copyright">
                © 2026 Sewfy. Todos os direitos reservados.
            </div>
        </div>

    </div>
</body>

</html>