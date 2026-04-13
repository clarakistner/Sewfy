@extends('layouts.guest')

@section('titulo', 'Redefinir Senha')

@section('style')
    @vite('resources/css/redefinirSenha.css')
@endsection

@section('conteudo')
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
 @endsection
