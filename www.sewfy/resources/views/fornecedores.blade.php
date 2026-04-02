@extends('layouts.app')

@section('titulo', 'Fornecedores')
@push('styles')
    @vite(['resources/css/todosFornecedores.css', 'resources/css/menu.css', 'resources/css/configmenu.css', 'resources/css/cadastroFornecedores.css', 'resources/css/visualizarFornecedores.css'])
@endpush
@section('conteudo')

  <body>
    <div class="layout">
      <!-- Parte da lista/pesquisa/botão de criação dos fornecedores -->
      <main class="principal">
        <div class="cabecalho-principal">
          <h1>Fornecedores</h1>

          <button class="botao-criar-fornecedor">
            <span class="material-symbols-outlined icone-adicionar-fornecedor"
              >add</span
            >
            Novo Fornecedor
          </button>
        </div>

        <div class="filtros">
          <div class="input-pesquisa">
            <svg
              class="icone-lupa"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
              type="text"
              placeholder="Pesquisar por nome ou CPF/CNPJ..."
            />
          </div>
        </div>

        <!-- Lista de fornecedores -->
        <div id="listaFornecedores" class="lista-fornecedores">
          <table class="table">
            <thead class="table-head">
              <tr class="table-head-row">
                <th class="table-head-cell">Nome</th>
                <th class="table-head-cell">Telefone</th>
                <th class="table-head-cell">Ações</th>
              </tr>
            </thead>

            <tbody id="fornecedores-table" class="table-body">
              <!-- Linhas de fornecedores serão inseridas aqui dinamicamente -->
            </tbody>
          </table>
        </div>
      </main>
    </div>

@endsection

@section('scripts')
@vite('resources/js/todosFornecedores.js')
@endsection
