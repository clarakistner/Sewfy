@extends('layouts.app')

@section('titulo', 'Produtos')
@push('styles')
    @vite(['resources/css/todosProdutos.css', 'resources/css/menu.css', 'resources/css/configmenu.css', 'resources/css/visualizarProdutos.css', 'resources/css/cadastroProdutos.css'])
@endpush
@section('conteudo')

        <!-- Parte da lista/pesquisa/botão de criação dos produtos -->
        <main class="principal">
            <div class="cabecalho-principal">
                <h1>Produtos</h1>

                <button class="botao-criar-produto">
                    <span class="material-symbols-outlined icone-adicionar-produto">add</span>
                    Novo Produto
                </button>

            </div>

            <div class="filtros">

                <div class="input-pesquisa">
                    <svg class="icone-lupa" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>

                    <input type="text" placeholder="Pesquisar por nome ou código...">
                </div>

                <div class="box-filtro">
                    <span class="material-symbols-outlined icone-filtro">filter_alt</span>
                    <select id="tipos-filtro">
                        <option value="">Todos os Tipos</option>
                        <option value="insumo">Insumos</option>
                        <option value="produto acabado">Produtos Acabados</option>
                        <option value="conjunto">Conjuntos</option>
                    </select>
                </div>

            </div>

            <!-- Lista de Produtos -->
            <div id="listaProdutos" class="lista-produtos">

                <table class="table">

                    <thead class="table-head">
                        <tr class="table-head-row">
                            <th class="table-head-cell">Código</th>
                            <th class="table-head-cell">Nome</th>
                            <th class="table-head-cell">Tipo</th>
                            <th class="table-head-cell">Unidade de Medida</th>
                            <th class="table-head-cell">Ações</th>
                        </tr>
                    </thead>

                    <tbody id="products-table" class="table-body">

                    </tbody>
                </table>
            </div>
        </main>
    
        
 @endsection

@section('scripts')
@vite('resources/js/todosProdutos.js')
@endsection