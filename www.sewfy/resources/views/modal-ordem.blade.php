<div id="detailsModal" class="modal hidden">
  <div class="modal-container modal-large">

    <div class="modal-header">
      <div>
        <h2>Detalhes da Ordem</h2>
        <p class="modal-header-idop" id="modal-idOP"></p>
      </div>
      <button type="button" class="ver-modal-close">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    <div id="detailsContent" class="modal-content">
      <div class="detalhes-tela-grid">

        <div class="detalhes-tela-col-esquerda">

          <div class="detalhes-tela-campo">
            <label class="detalhes-tela-label" id="labelnomeProd">Produto:</label>
            <h3 class="detalhes-tela-valor-grande" id="nomeProd"></h3>
          </div>

          <div class="camposQtdQtdeQuebra">
            <div class="detalhes-tela-campo">
              <label class="detalhes-tela-label">Quantidade Inicial</label>
              <h3 class="detalhes-tela-valor-medio" id="quantProd"></h3>
            </div>
            <div class="detalhes-tela-campo noned">
              <label class="detalhes-tela-label">Quantidade Final Produzida</label>
              <h3 class="detalhes-tela-valor-medio noned" id="quanteProd"></h3>
            </div>
            <div class="detalhes-tela-campo noned">
              <label class="detalhes-tela-label">
                Percentual de Quebra
                <span class="tooltip-icone" data-tooltip="Percentual de peças perdidas em relação à quantidade inicial. Calculado como: (quebra ÷ quantidade inicial) × 100">?</span>
              </label>
              <h3 class="detalhes-tela-valor-medio noned" id="quebraProd"></h3>
            </div>
          </div>

          <div class="camposCustouRCustou">
            <div class="detalhes-tela-campo detalhes-tela-divider">
              <label class="detalhes-tela-label">
                Custo Unitário por Peça
                <span class="tooltip-icone" data-tooltip="Custo total dos insumos dividido pela quantidade inicial de peças planejadas.">?</span>
              </label>
              <h3 class="detalhes-tela-valor-pequeno" id="custou"></h3>
            </div>
            <div class="detalhes-tela-campo detalhes-tela-divider noned">
              <label class="detalhes-tela-label">
                Custo Unitário Real por Peça Produzida
                <span class="tooltip-icone" data-tooltip="Custo total dividido pela quantidade real de peças produzidas após a quebra. Representa o custo efetivo de cada peça entregue.">?</span>
              </label>
              <h3 class="detalhes-tela-valor-pequeno noned" id="custour"></h3>
            </div>
          </div>

          <div class="detalhes-tela-campo detalhes-tela-divider">
            <label class="detalhes-tela-label">Custo Total da Ordem</label>
            <h3 class="detalhes-tela-valor-grande" id="custot"></h3>
          </div>

        </div>

        <div class="detalhes-tela-col-direita">
          <h3 class="detalhes-tela-subtitulo" id="tituloTabela">Insumos</h3>
          <div class="boxTabela">
            <table class="tabelaInsumos"></table>
          </div>
        </div>

      </div>

      <div class="box-botoes">
        <button type="button" class="botao fecharOP">Fechar Ordem de Produção</button>
        <button type="button" class="botao editar">Editar</button>
      </div>
    </div>

  </div>
</div>