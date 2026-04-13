@extends('layouts.admin')

@section('titulo', 'Cadastro Empresa')
@push('styles')
    @vite(['resources/css/cadastroempresa.css', 'resources/css/menuadm.css'])
@endpush

@section('conteudo')
    <main class="content">

        <div class="page-header">
            <h1>Cadastrar Nova Empresa</h1>
            <p>Preencha os dados para adicionar uma nova empresa ao sistema</p>
        </div>

        <div class="secao-card">
            <h2 class="secao-titulo">Dados da Empresa</h2>
            <div class="form-grid">
                <div class="campo">
                    <label>CNPJ *</label>
                    <input type="text" placeholder="99.999.999/9999-99" id="cnpj"/>
                </div>
                <div class="campo">
                    <label>Nome *</label>
                    <input type="text" placeholder="Nome da empresa" id="nome"/>
                </div>
                <div class="campo">
                    <label>Email *</label>
                    <input type="email" placeholder="contato@empresa.com" id="email"/>
                </div>
                <div class="campo">
                    <label>Telefone *</label>
                    <input type="text" placeholder="(99) 99999-9999" id="telefone"/>
                </div>
                <div class="campo campo-full">
                    <label>Razão Social *</label>
                    <input type="text" placeholder="Razão social completa" id="razao-social"/>
                </div>
            </div>
        </div>

        <div class="secao-card">
            <h2 class="secao-titulo">Módulos do Sistema</h2>
            <div class="modulos-grid">
                <label class="modulo-item"><input type="checkbox" value="2"/><span>Faturamento</span></label>
                <label class="modulo-item"><input type="checkbox" value="1"/><span>Financeiro</span></label>
                <label class="modulo-item"><input type="checkbox" value="5"/><span>Compras</span></label>
                <label class="modulo-item"><input type="checkbox" value="4"/><span>Produção</span></label>
                <label class="modulo-item"><input type="checkbox" value="6"/><span>Relatórios</span></label>
                <label class="modulo-item"><input type="checkbox" value="3"/><span>Recursos Humanos</span></label>
            </div>
        </div>

        <div class="secao-card">
            <h2 class="secao-titulo">Usuário Principal</h2>
            <div class="form-grid">
                <div class="campo">
                    <label>Nome *</label>
                    <input type="text" placeholder="Nome do usuário principal" id="usuario"/>
                </div>
                <div class="campo">
                    <label>Email *</label>
                    <input type="email" placeholder="usuario@empresa.com" id="email-usuario"/>
                </div>
                <div class="campo">
                    <label>Número do Usuário Principal *</label>
                    <input type="text" placeholder="(99) 99999-9999" id="num"/>
                </div>
                <div class="campo">
                    <label>Confirme o Email *</label>
                    <input type="email" placeholder="usuario@empresa.com" id="email-usuario-confirma"/>
                </div>
            </div>
        </div>

        <button class="btn-cadastrar" id="btn-cadastrar-empresa">Cadastrar Empresa</button>

    </main>
@endsection

@section('scripts')
@vite('resources/js/cadastroempresa.js')
@endsection