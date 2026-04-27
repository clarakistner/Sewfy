<div id="contaPagarModal" class="modal">
  <div class="modal-container">
    <div class="modal-header">
      <h2 class="modal-title">Cadastrar Conta a Pagar</h2>
      <button class="fechar-modal">
        <span class="material-symbols-outlined icone-fechar-modal">close</span>
      </button>
    </div>

    <form id="ContaPagar" class="modal-form">
      <div class="form-grid cp-grid">

        <div class="area-cp-fornecedor">
          <label>Fornecedor *</label>
          <div class="select-pesquisa-wrapper">
            <div class="select-pesquisa-trigger" id="triggerFornecedor">
              <span id="labelFornecedor">Selecione um fornecedor</span>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            <div class="select-pesquisa-dropdown" id="dropdownFornecedor">
              <div class="select-pesquisa-input-wrapper">
                <span class="select-pesquisa-input-icon">
                  <svg viewBox="0 0 24 24" width="14" height="14" stroke="#9ca3af" fill="none" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </span>
                <input type="text" class="select-pesquisa-input" placeholder="Pesquisar fornecedor..." />
              </div>
              <ul class="select-pesquisa-lista" id="listaFornecedor"></ul>
            </div>
            <input type="hidden" id="fornecedorValor" />
          </div>
        </div>

        <div class="area-cp-valor">
          <label>Valor *</label>
          <input type="text" id="cpValor" required placeholder="R$ 0,00" />
        </div>

        <div class="area-cp-emissao">
          <label>Data de Emissão *</label>
          <input type="date" id="cpEmissao" required />
        </div>

        <div class="area-cp-vencimento">
          <label>Data de Vencimento *</label>
          <input type="date" id="cpVencimento" required />
        </div>

        <div class="area-cp-ocorrencia">
          <label>Ocorrência</label>
          <select id="cpOcorrencia">
            <option value="">Sem recorrência</option>
            <option value="semanal">Semanal</option>
            <option value="quinzenal">Quinzenal</option>
            <option value="mensal">Mensal</option>
            <option value="bimestral">Bimestral</option>
            <option value="trimestral">Trimestral</option>
            <option value="semestral">Semestral</option>
            <option value="anual">Anual</option>
          </select>
        </div>

        <div class="area-cp-historico">
          <label>Histórico</label>
          <input type="text" id="cpHistorico" placeholder="Descrição ou observação da conta..." maxlength="255" />
        </div>

      </div>

      <div class="modal-actions">
        <button type="button" class="btn-cancel">Cancelar</button>
        <button type="button" class="btn-submit btn-cadastrar-pagar">Cadastrar e Pagar</button>
        <button type="submit" class="btn-submit">Cadastrar</button>
      </div>
    </form>
  </div>
</div>