@extends('layouts.app')

@section('titulo', 'Ordens de Produção')
@push('styles')
    @vite(['resources/css/menu.css', 'resources/css/gerenciarOrdensDeProducao.css', 'resources/css/configmenu.css', 'resources/css/modalOrdemDeProducao.css', 'resources/css/edicaoOrdemDeProducao.css'])
@endpush

@section('conteudo')
    <main class="principal">
        <div class="cabecalho-principal">
            <h1>Ordem de Produção</h1>
            <button class="botao-criar-ordem">
                <span class="material-symbols-outlined icone-adicionar-ordem">add</span>
                Nova Ordem
            </button>
        </div>

        <div class="filtros" id="filtros">
            <div class="linha-filtros-topo">
                <div class="input-pesquisa">
                    <svg class="icone-lupa" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input type="text" id="barraPesquisa" placeholder="Pesquisar por código ou produto...">
                </div>

                <div class="box-filtro">
                    <span class="material-symbols-outlined icone-filtro">filter_alt</span>
                    <select id="tipos-filtro">
                        <option value="todas">Todas</option>
                        <option value="abertas">Abertas</option>
                        <option value="fechadas">Fechadas</option>
                    </select>
                </div>

                <div class="mais-filtros" id="mais-filtros">
                    <button class="material-symbols-outlined btn-filtro-extra" id="btn-mais-filtros">add</button>
                    <div class="dropdown-filtros" id="dropdown-filtros">
                        <button data-filtro="tempo">
                            <span class="material-symbols-outlined icone-calendario">calendar_today</span>
                            Adicionar intervalo de tempo
                        </button>
                        <button data-filtro="valor">
                            <span class="material-symbols-outlined icone-dinheiro">attach_money</span>
                            Adicionar intervalo de custo
                        </button>
                    </div>
                </div>
            </div>

            <div id="container-filtros"></div>
        </div>

        <div id="listaOrdens" class="lista-ordens"></div>
    </main>
@endsection

@section('scripts')
@vite('resources/js/gerenciarOrdensDeProducao.js')
@endsection