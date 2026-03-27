<div id="produtoModal" class="modal">
  <div class="modal-container">
    <div class="modal-header">
      <h2 class="modal-title">Cadastrar Novo Produto</h2>
      <button class="fechar-modal">
        <span class="material-symbols-outlined icone-fechar-modal">close</span>
      </button>
    </div>

    <form id="Produto" class="modal-form">
      <div class="form-grid">

        <div class="area-cod">
          <label>Código *</label>
          <input type="text" id="pCode" required placeholder="EX: MAL-00" />
        </div>

        <div class="area-tipo">
          <label>Tipo *</label>
          <select id="pTipo">
            <option value="insumo">Insumo</option>
            <option value="produto acabado">Produto Acabado</option>
            <option value="conjunto">Conjunto</option>
          </select>
        </div>

        <div class="area-nome">
          <label>Nome *</label>
          <input type="text" id="pNome" required placeholder="Nome do produto" />
        </div>

        <div class="area-um">
          <label>Unidade de Medida *</label>
          <select id="pUm">
            <option value="UN">UN</option>
            <option value="KG">KG</option>
            <option value="MT">MT</option>
          </select>
        </div>

        <div class="area-descricao">
          <label for="pDesc">Descrição</label>
          <input id="pDesc" placeholder="Descreva o produto..." />
        </div>

        <div class="area-preco">
          <div class="preco-row">

            <div class="preco-field">
              <label>Preço Unitário</label>
              <input type="text" id="pPreco" placeholder="R$ 0.00" />
            </div>

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
              <div class="toggle-wrapper">
                <label class="toggle">
                  <input type="checkbox" id="checkCliFor" />
                  <span class="toggle-track">
                    <span class="toggle-thumb"></span>
                  </span>
                  <span class="toggle-label">Não</span>
                </label>
              </div>
            </div>

          </div>
        </div>

      </div>

      <div class="modal-actions">
        <button type="button" class="btn-cancel">Cancelar</button>
        <button type="submit" class="btn-submit">Cadastrar</button>
      </div>
    </form>
  </div>
</div>