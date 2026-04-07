@extends('layouts.app')

@section('titulo', 'Cadastrar Funcionário')
@push('styles')
@vite(['resources/css/cadastrousuario.css','resources/css/configmenu.css'])
@endpush
@section('conteudo')


<div class="containerConfigOwner">
    <div class="cadastrarUsuario">

        <div class="tituloPagina">
            <h1>
                Cadastrar Funcionário
            </h1>
            <p>Preencha os dados para adicionar um novo funcionário ao sistema</p>
        </div>

        <!-- Seção de Dados do Funcionário -->
        <div class="secao-card">
            <h2 class="secao-titulo">Dados do Funcionário</h2>

            <div class="form-grid">
                <div class="campo">
                    <label>Nome *</label>
                    <input type="text" placeholder="Nome do funcionário" id="nome" />
                </div>
                <div class="campo">
                    <label>Telefone *</label>
                    <input type="text" placeholder="(99) 99999-9999" id="telefone" />
                </div>
                <div class="campo">
                    <label>Email *</label>
                    <input type="email" placeholder="funcionario@gmail.com" id="email" />
                </div>
                <div class="campo">
                    <label>Confirme o Email *</label>
                    <input type="email" placeholder="Digite o email novamente" id="confirmarEmail" />
                </div>

            </div>
        </div>

        <div class="secao-card">
            <h2 class="secao-titulo">Módulos da Empresa</h2>
            <div class="modulos-grid">
            </div>
        </div>

        <div class="containerButton">
            <button class="botaoCadastrar">Cadastrar Funcionário</button>
        </div>

    </div>
</div>

@endsection

@section('scripts')
@vite(['resources/js/cadastrousuario.js', 'resources/js/configmenu.js'])
@endsection