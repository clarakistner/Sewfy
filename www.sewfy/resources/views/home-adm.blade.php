@extends('layouts.app')

@section('titulo', 'Home ADM')
@push('styles')
    @vite(['resources/css/homeadm.css', 'resources/css/menuadm.css'])
@endpush
@section('conteudo')

    <div class="layout">
        <!-- sidebar injetada pelo JS -->

        <main class="content">

            <div class="page-header">
                <h1>Empresas Cadastradas</h1>
                <p>Gerencie todas as empresas do sistema ERP</p>
            </div>

            <!-- Barra de pesquisa + filtro -->
            <div class="barra-filtros">
                <div class="campo-busca">
                    <span class="material-symbols-outlined icone-busca">search</span>
                    <input
                        type="text"
                        id="input-busca"
                        placeholder="Buscar por nome ou CNPJ..."
                    />
                </div>

                <select id="select-status">
                    <option value="todas">Todas</option>
                    <option value="ativa">Ativas</option>
                    <option value="inativa">Inativas</option>
                </select>
            </div>

            <!-- Lista de empresas -->
            <div class="empresas-lista" id="empresas-lista">

                
            </div>

            <!-- Mensagem sem resultados -->
            <p class="sem-resultados" id="sem-resultados">Nenhuma empresa encontrada.</p>

        </main>
    </div>

@endsection

@section('scripts')
@vite('resources/js/homeadm.js')
@endsection