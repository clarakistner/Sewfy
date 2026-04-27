<div class="produtomodal">
    <div class="modal-container">

    <!-- Header -->
    <div class="modal-header">
      <h2 class="modal-title">Detalhes do Produto</h2>
      <button class="material-symbols-outlined modal-close">close</button>
    </div>

    <!-- Content -->
    <div class="modal-content">
      <div class="details-grid">

        <div class="detail">
          <span class="label">Código *</span>
          <span class="value" id="modal-cod" data-field="codigo"></span>
        </div>

        <div class="detail">
          <span class="label">Tipo *</span>
          <span class="value" id="modal-tipo" data-field="tipo"></span>
        </div>

        <div class="detail">
          <span class="label">Nome *</span>
          <span class="value" id="modal-nome" data-field="nome"></span>
        </div>

        <div class="detail">
          <span class="label">Unidade de Medida *</span>
          <span class="value" id="modal-um" data-field="um"></span>
        </div>

        <div class="detail">
          <span class="label">Preço</span>
          <span class="value" id="modal-preco" data-field="preco"></span>
        </div>

        <div class="detail">
          <span class="label">Cadastro *</span>
          <span class="value" id="modal-cadastro" data-field="ativo"></span>
        </div>

         <!-- Necessita de fornecedor -->
        <div class="preco-field">
          <div class="clifor-label-row">
            <label>Necessita de fornecedor?</label>
            <div class="info-tip">
              <span class="info-icon">i</span>
              <div class="info-tooltip">
                Produtos caracterizados como serviços necessitam de fornecedor.
              </div>
            </div>
          </div>

          <span id="modal-clifor"></span>

          <!-- Modo edição (oculto por padrão) -->
          <div class="toggle-wrapper" id="toggle-clifor-wrapper" style="display:none">
            <label class="toggle">
              <input type="checkbox" id="checkCliFor" />
              <span class="toggle-track">
                <span class="toggle-thumb"></span>
              </span>
              <span class="toggle-label">Não</span>
            </label>
          </div>
        </div>

        <div class="detail">
          <div class="select-pesquisa-wrapper">
            <div class="select-pesquisa-trigger" id="triggerOPs">
              <span id="labelOPs">Ordens de Produção em aberto</span>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            <div class="select-pesquisa-dropdown" id="dropdownOPs">
              <div class="select-pesquisa-input-wrapper">
                <span class="select-pesquisa-input-icon">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="#9ca3af" fill="none" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </span>
                <input type="text" class="select-pesquisa-input" placeholder="Pesquisar ordem..." />
              </div>
              <ul class="select-pesquisa-lista" id="listaOPs"></ul>
            </div>
          </div>
        </div>

        <div class="detail col-span-2">
          <span class="label">Descrição</span>
          <span class="value" id="modal-desc" data-field="descricao"></span>
        </div>

        <!-- Ordens de Produção — mesma linha que necessita fornecedor -->
        

          <!-- Modo visualização -->
          

        <div class="detail col-span-2">
          <button class="btn-editar-produto">
            Editar Produto
          </button>
        </div>

      </div>
    </div>
  </div>
</div>