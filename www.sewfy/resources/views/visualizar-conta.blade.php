<div id="conta-modal" class="modal">
  <div class="modal-container">

    <!-- Header -->
    <div class="modal-header">
      <h2 class="modal-titulo">Detalhes da Conta</h2>
      <button class="material-symbols-outlined modal-fecha">close</button>
    </div>

    <!-- Conteúdo -->
    <div class="modal-conteudo">
      <div class="grid-detalhes">

        <!-- Linha 1: Fornecedor | Telefone -->
        <div class="detalhe col-half">
          <span class="label">Fornecedor</span>
          <span class="value" id="modal-fornecedor" data-field="fornecedor"></span>
        </div>

        <div class="detalhe col-half">
          <span class="label">Número do Fornecedor</span>
          <span class="value" id="modal-telefone"></span>
        </div>

        <!-- Linha 2: Valor | Status -->
        <div class="detalhe col-half">
          <span class="label">Valor</span>
          <span class="value strong" id="modal-valor" data-field="valor"></span>
        </div>

        <div class="detalhe col-half">
          <span class="label">Status</span>
          <span class="value" id="modal-status"></span>
        </div>

        <!-- Linha 3: Ocorrência | Parcela (só para avulsas com recorrência) -->
        <div class="detalhe col-half" id="detalhe-ocorrencia" style="display:none">
          <span class="label">Ocorrência</span>
          <span class="value" id="modal-ocorrencia"></span>
        </div>

        <div class="detalhe col-half" id="detalhe-parcela" style="display:none">
          <span class="label">Parcela</span>
          <span class="value" id="modal-parcela"></span>
        </div>

        <!-- Linha 4: Emissão | Vencimento | Pagamento -->
        <div class="detalhe col-third">
          <span class="label">Data de Emissão</span>
          <span class="value" id="modal-emissao"></span>
        </div>

        <div class="detalhe col-third">
          <span class="label">Data de Vencimento *</span>
          <span class="value" id="modal-vencimento" data-field="dataVencimento"></span>
        </div>

        <div class="detalhe col-third">
          <span class="label">Data de Pagamento</span>
          <span class="value" id="modal-pagamento" data-field="dataPagamento"></span>
        </div>

        <!-- Histórico — label sempre visível -->
        <div class="detalhe col-full">
          <span class="label">Histórico</span>
          <span class="value" id="modal-historico" data-field="historico"></span>
        </div>

        <!-- OP (só para contas de OP) — clicável -->
        <div class="detalhe col-full" id="detalhe-op" style="display:none">
          <span class="label">Ordem de Produção</span>
          <span class="value op-link" id="modal-op"></span>
        </div>

        <!-- Botão -->
        <div class="modal-acoes">
          <button type="button" class="btn-submit">
            Editar Conta
          </button>
        </div>

      </div>
    </div>

  </div>
</div>