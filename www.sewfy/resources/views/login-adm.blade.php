@extends('layouts.app')

@section('titulo', 'Login ADM')
@push('styles')
    @vite(['resources/css/loginadm.css'])
@endpush
@section('conteudo')
    <div class="pagina">
        <div class="container">

            <div class="box-login">

                <h2>Painel Administrativo</h2>
                <p>Sistema Sewfy</p>

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
                    <button type="submit">Entrar</button>
                </form>
                
            </div>

            <div class="copyright">
                © 2026 Sewfy. Todos os direitos reservados.
            </div>
        </div>

    </div>
  @endsection

@section('scripts')
@vite('resources/js/loginadm.js')
@endsection