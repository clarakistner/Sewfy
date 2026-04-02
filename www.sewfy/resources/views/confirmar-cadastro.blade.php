@extends('layouts.app')

@section('titulo', 'Configrmar Cadastro')
@push('styles')
    @vite('resources/css/confirmarcadastro.css')
@endpush
@section('conteudo')
    <div class="pagina">
        <div class="container">


            <div class="logo">
                <h1 id="titulo">Sewfy</h1>
            </div>


            <div class="box-confirmacao">
                <h2>Definir Senha</h2>

                <form method="POST" action="">

                    <div class="campo-formulario">
                        <label for="senha">Senha</label>
                        <box class="campo-senha">
                            <input id="senha" name="senha" type="password" placeholder="••••••••" required>
                            <span class="material-symbols-outlined botao-senha">
                                visibility
                            </span>
                        </box>

                    </div>

                    <div class="campo-formulario">
                        <label for="confirma-senha">Confirmar senha</label>
                        <box class="campo-confirma-senha">
                            <input id="confirma-senha" name="confirma-senha" type="password" placeholder="••••••••"
                                required>
                            <span class="material-symbols-outlined botao-senha">
                                visibility
                            </span>
                        </box>
                    </div>

                    <button type="submit">Salvar Informações</button>
                </form>
            </div>

            <div class="copyright">
                © 2026 Sewfy. Todos os direitos reservados.
            </div>
        </div>


    </div>
@endsection

@section('scripts')
@vite('resources/js/confirmarcadastro.js')
@endsection