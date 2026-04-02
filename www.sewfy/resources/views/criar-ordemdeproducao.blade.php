@extends('layouts.app')

@section('titulo', 'Criar Ordem de Produção')
@push('styles')
@vite(['resources/css/requisicao.css', 'resources/css/menu.css', 'resources/css/configmenu.css'])
@endpush
@section('conteudo')
<div class="layout">
  <main class="principal">
    <div class="modal-header">
      <h2>Nova Ordem</h2>
    </div>

    <!-- Progress Steps -->
    <div class="steps-bar">
      <div class="steps-wrapper">
        <!-- Step 1 -->
        <div class="step-item">
          <div class="step-circle active" id="step-circle-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              viewBox="0 0 24 24">
              <path
                d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l6 3.46a2 2 0 0 0 2 0l6-3.46A2 2 0 0 0 21 16z" />
            </svg>
          </div>
          <span class="step-label active" id="step-label-1">Produto</span>
        </div>

        <div class="step-connector" id="connector-1"></div>

        <!-- Step 2 -->
        <div class="step-item">
          <div class="step-circle" id="step-circle-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              viewBox="0 0 24 24">
              <circle cx="6" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <line x1="20" y1="4" x2="8.12" y2="15.88" />
              <line x1="14.47" y1="14.48" x2="20" y2="20" />
              <line x1="8.12" y1="8.12" x2="12" y2="12" />
            </svg>
          </div>
          <span class="step-label" id="step-label-4">Insumos e Serviços</span>
        </div>

        <div class="step-connector" id="connector-2"></div>

        <!-- Step 3 -->
        <div class="step-item">
          <div class="step-circle" id="step-circle-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span class="step-label" id="step-label-3">Revisão</span>
        </div>
      </div>
    </div>

    <!-- Step 1: Dados do Produto -->
    <div class="boxDadosProduto step-panel active" id="panel-1">
      <form class="modal-form dadosProduto" id="producao-form" novalidate>
        <div class="field-group">
          <select name="product" id="product" class="input-produto">
            <option value="">Produto</option>
          </select>
          <p class="field-error hidden" id="error-product">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Produto é obrigatório
          </p>
        </div>

        <div class="field-group">
          <input
            required
            type="number"
            id="quantity"
            name="quantity"
            placeholder="Quantidade"
            class="input-produto"
            min="1" />
          <p class="field-error hidden" id="error-quantity">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Quantidade é obrigatória e deve ser maior que zero
          </p>
          <p class="field-success hidden" id="success-quantity">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              viewBox="0 0 24 24">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Quantidade válida
          </p>
        </div>

        <div class="boxBotoes">
          <button type="button" class="botao cancelar">Cancelar</button>
          <button
            type="button"
            class="botao proximo dadosProduto"
            id="btn-next">
            Próximo
          </button>
        </div>
      </form>
    </div>

    <!-- Modal de Insumos -->
    <div class="boxDadosInsumos">
      <div class="modalBoxInsumos">
        <!-- Cabeçalho do card -->
        <div class="card-header">
          <div class="card-header-icon">
            <!-- Scissors icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">
              <circle cx="6" cy="6" r="3" />
              <circle cx="6" cy="18" r="3" />
              <line x1="20" y1="4" x2="8.12" y2="15.88" />
              <line x1="14.47" y1="14.48" x2="20" y2="20" />
              <line x1="8.12" y1="8.12" x2="12" y2="12" />
            </svg>
          </div>
          <h2 class="card-title">Insumos e Serviços</h2>
        </div>

        <!-- Selects de Insumo/Serviço e Fornecedor -->
        <form class="modal-form">
          <div class="form-selects">
            <div class="form-group">
              <label class="form-label">Insumo/Serviço *</label>
              <div class="select-wrapper">
                <span class="select-icon-left">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#6b7280"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <circle cx="6" cy="6" r="3" />
                    <circle cx="6" cy="18" r="3" />
                    <line x1="20" y1="4" x2="8.12" y2="15.88" />
                    <line x1="14.47" y1="14.48" x2="20" y2="20" />
                    <line x1="8.12" y1="8.12" x2="12" y2="12" />
                  </svg>
                </span>
                <select class="campoInsumo">
                  <option value="">Selecione um insumo ou serviço</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" id="label-quantidade">Quantidade *</label>
              <div class="input-wrapper">
                <svg
                  class="input-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <line x1="4" y1="9" x2="20" y2="9" />
                  <line x1="4" y1="15" x2="20" y2="15" />
                  <line x1="10" y1="3" x2="8" y2="21" />
                  <line x1="16" y1="3" x2="14" y2="21" />
                </svg>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  class="campoQuant"
                  placeholder="Ex: 5000" />
              </div>
              <p class="field-error hidden" id="quantity-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>Por favor, informe a quantidade.</span>
              </p>
            </div>
            <div class="form-group">
              <label id="label-preco">Preço (R$)*</label>
              <div style="position: relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9ca3af"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  style="
                        position: absolute;
                        left: 1rem;
                        top: 50%;
                        transform: translateY(-50%);
                      ">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path
                    d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <input
                  type="text"
                  name="price"
                  
                  placeholder="Ex: 150.00"
                  class="campoPreco" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Fornecedor</label>
              <div class="select-wrapper fornecedor-select">
                <span class="select-icon-left">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#6b7280"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <select class="campoFornecedor">
                  <option value="">Não aplicável</option>
                </select>
              </div>
            </div>
            <div class="form-group button-group">
              <div class="add-btn-row">
                <button type="button" class="adicionar botao">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  Adicionar Insumo/Serviço
                </button>
              </div>
            </div>

          </div>

          <!-- Box informações -->
          <div class="info-box">
            <div class="info-box-header">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7280"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span class="info-box-title">Informações de Insumos e Serviços</span>
            </div>
            <p class="info-box-desc">
              Selecione o insumo ou serviço necessário para esta ordem de
              produção. Alguns itens como
              <a href="#" class="info-link">"Malha"</a> são insumos próprios
              e não requerem fornecedor externo.
            </p>
            <div class="info-fields">
              <div class="info-field">
                <span class="info-field-label">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9b59b6"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <circle cx="6" cy="6" r="3" />
                    <circle cx="6" cy="18" r="3" />
                    <line x1="20" y1="4" x2="8.12" y2="15.88" />
                    <line x1="14.47" y1="14.48" x2="20" y2="20" />
                    <line x1="8.12" y1="8.12" x2="12" y2="12" />
                  </svg>
                  INSUMO/SERVIÇO
                </span>
                <span class="info-field-value" id="previewInsumo">—</span>
              </div>
              <div class="info-field">
                <span class="info-field-label">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#e74c3c"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  FORNECEDOR
                </span>
                <span class="info-field-value" id="previewFornecedor">—</span>
              </div>
              <div class="info-field">
                <span class="info-field-label">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#27ae60"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  STATUS
                </span>
                <span class="info-field-value status-pendente">Pendente</span>
              </div>
            </div>
          </div>
          <div class="filtros">
            <div class="input-pesquisa">
              <svg
                class="icone-lupa"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>

              <input
                type="text"
                id="barraPesquisa"
                placeholder="Pesquisar por nome do produto..." />
            </div>
          </div>
          <!-- Box itens adicionados -->
          <div class="added-box">
            <div class="added-box-header">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7280"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span class="added-box-title">Insumos e Serviços Adicionados</span>
            </div>
            <p class="added-box-desc">
              Aqui estão os insumos e serviços que você adicionou para esta
              ordem de produção.
            </p>

            <!-- Grid de cards adicionados -->
            <div class="col-2" id="tabelaInsumos"></div>

            <!-- Botão adicionar -->

          </div>
        </form>

        <!-- Rodapé com ações -->
        <div class="card-footer">
          <button type="button" class="botao cancelar">Cancelar</button>
          <div class="footer-right">
            <button type="button" class="botao voltarProduto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Voltar
            </button>
            <button type="button" class="botao finalizar">
              Próximo
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes da Ordem -->
    <!-- Step 4 — Revisão da Ordem -->
    <div class="boxDadosOrdem" style="display: none">
      <div class="card">
        <!-- Grid principal -->
        <div class="revisao-grid">
          <!-- Coluna esquerda — Produto -->
          <div class="revisao-col-esquerda">
            <div class="revisao-campo">
              <p class="revisao-label">Produto:</p>
              <p class="revisao-valor-grande" id="nomeProduto">—</p>
            </div>

            <div class="revisao-campo">
              <p class="revisao-label">Quantidade:</p>
              <p class="revisao-valor-medio" id="quantidadeProduto">—</p>
            </div>

            <div class="revisao-campo revisao-divider">
              <p class="revisao-label">Custo unitário:</p>
              <p class="revisao-valor-medio" id="custou">—</p>
            </div>

            <div class="revisao-campo revisao-divider">
              <p class="revisao-label">Custo total:</p>
              <p class="revisao-valor-grande" id="custot">—</p>
            </div>
          </div>

          <!-- Coluna direita — Insumos -->
          <div class="revisao-col-direita">
            <p class="revisao-subtitulo">Insumos e Serviços</p>
            <div class="lista-insumos-revisao" id="tabelaIN"></div>

            <!-- Placeholder vazio -->
            <div class="insumos-vazio hidden" id="insumosVazio">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round">
                <circle cx="6" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <line x1="20" y1="4" x2="8.12" y2="15.88" />
                <line x1="14.47" y1="14.48" x2="20" y2="20" />
                <line x1="8.12" y1="8.12" x2="12" y2="12" />
              </svg>
              <p>Nenhum insumo ou serviço adicionado</p>
            </div>
          </div>
        </div>

        <!-- Banner "Tudo pronto" -->
        <div class="banner-sucesso">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#16a34a"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            style="flex-shrink: 0; margin-top: 2px">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <div>
            <p class="banner-sucesso-titulo">Tudo pronto!</p>
            <p class="banner-sucesso-desc">
              Confira os dados e clique em "Confirmar" para finalizar a
              criação da ordem.
            </p>
          </div>
        </div>
      </div>
      <!-- /.card -->

      <!-- Footer de ações -->
      <div class="card-footer">
        <button type="button" class="botao cancelar">Cancelar</button>
        <div class="footer-right">
          <button type="button" class="botao voltar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Voltar
          </button>
          <button type="button" class="botao confirmar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Criar Ordem de Produção
          </button>
        </div>
      </div>
    </div>
    <!-- /.boxDadosOrdem -->
  </main>
</div>
@endsection

@section('scripts')
@vite('resources/js/requisicao.js')
@endsection