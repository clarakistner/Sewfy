@extends('layouts.guest')

@section('titulo', 'Login')
@push('styles')
    @vite(['resources/css/login.css'])
@endpush
@section('conteudo')
    <div class="pagina">
        <div class="container">


            <div class="logo">
                <h1 id="titulo">Sewfy</h1>
            </div>


            <div class="box-login">
                <h2>Login</h2>

                <form method="POST" action="">
                    <div class="campo-formulario">
                        <label for="email">Email</label>
                        <input id="email" name="email" type="email" placeholder="seu@email.com" required>
                    </div>

                    <div class="campo-formulario">
                        <label for="senha">Senha</label>
                        <div class="campo-senha">
                            <input id="senha" name="senha" type="password" placeholder="••••••••" required>
                            <span class="material-symbols-outlined botao-senha">
                                visibility
                            </span>
                        </div>

                    </div>
                    <button type="submit">Login</button>
                </form>
                <div class="esqueceu-senha">
                    <a href="" id="link-redefinir-senha">Esqueceu a senha?</a>
                </div>
            </div>

            <div class="copyright">
                © 2026 Sewfy. Todos os direitos reservados.
            </div>
        </div>

    </div>
  @endsection

@section('scripts')
@vite('resources/js/login.js')
@endsection