
<div class="modal-edicao" id="modalEdicao">
  <div class="modal-container">

    <!-- HEADER -->
    <div class="modal-header">
      <div>
        <h2>Editar Ordem de Produção </h2>
        <p id="idNome"></p>
      </div>
      <button class="close-btn" onclick="">✕</button>
    </div>

    <div class="modal-body">

      <!-- CARDS DE RESUMO -->
      <div class="summary-grid">
        <div class="summary-card summary-card--blue">
          <div class="summary-card__top">
            <span class="summary-card__icon">🛍</span>
            <span class="summary-card__badge badge--blue">Produção</span>
          </div>
          <div class="summary-card__value" id="cardQtdProd">0</div>
          <div class="summary-card__label">Quantidade Total</div>
        </div>

        <div class="summary-card summary-card--purple">
          <div class="summary-card__top">
            <span class="summary-card__icon">◈</span>
            <span class="summary-card__badge badge--purple">Insumos</span>
          </div>
          <div class="summary-card__value" id="cardTotalInsumos">0</div>
          <div class="summary-card__label">Total de Itens</div>
        </div>

        <div class="summary-card summary-card--green">
          <div class="summary-card__top">
            <span class="summary-card__icon">$</span>
            <span class="summary-card__badge badge--green">Custo</span>
          </div>
          <div class="summary-card__value" id="cardCustoTotal">R$ 0,00</div>
          <div class="summary-card__label">Custo Total Insumos</div>
        </div>
      </div>

      <!-- INFORMAÇÕES -->
      <section>
        <div class="section-heading">
          <div class="section-heading__icon section-heading__icon--blue">📦</div>
          <h3>Informações da Ordem</h3>
        </div>

        <div class="grid-2">
          <div class="field">
            <label>
              <span class="label-icon label-icon--blue">↗</span>
              Quantidade de Produção
            </label>
            <input type="number" value="" id="qtdOP" class="qtd" oninput="" />
          </div>
        </div>
      </section>

      <!-- INSUMOS -->
      <section>
        <div class="divInsumos">
          <div class="section-heading">
            <div class="section-heading__icon section-heading__icon--purple">◈</div>
            <h3>Insumos e Serviços</h3>
            <span class="insumos-count" id="insumosCount">0 itens</span>
          </div>
          
        </div>

        <!-- TABELA -->
        <div class="table-wrap">
          <div class="table-header">
            <span class="th th--name">NOME DO INSUMO</span>
            <span class="th th--qty">QUANTIDADE</span>
            <span class="th th--price">PREÇO UNIT.</span>
            <span class="th th--unit">UNIDADE</span>
            <span class="th th--supplier">FORNECEDOR</span>
            <span class="th th--action"></span>
          </div>
          <div id="insumosContainer"></div>
        </div>

        <!-- NOVO INSUMO -->
        <div class="novo-insumo">
          <h4>+ Adicionar Novo Insumo</h4>

          <div class="novo-insumo__grid">
            <div class="field">
              <label>Nome do Insumo</label>
              <select id="novoInsumo">
                <option value="">Selecione o insumo</option>
              </select>
            </div>
            <div class="field">
              <label>Quantidade</label>
              <input type="number" placeholder="1000" id="quatidadeNovoInsumo" />
            </div>
            <div class="field" id="boxPreco">
              <label>Preço Unitário</label>
              <div class="price-wrap">
                <input type="text"  placeholder="R$ 10,50" id="precoNovoInsumo" />
              </div>
            </div>
            <div class="field">
              <label>Unidade</label>
              <select id="unidadeNovoInsumo" disabled>
                <option value=""></option>
                <option value="UN">UN</option>
                <option value="KG">KG</option>
                <option value="MT">MT</option>
              </select>
            </div>
            <div class="field" id="boxForNovoInsumo">
              <label>Fornecedor</label>
              <select id="fornecedorNovoInsumo">
                <option value="">Selecione</option>
                
              </select>
            </div>
            <div class="field field--btn">
              <button class="add" onclick="">+ Adicionar</button>
            </div>
          </div>
        </div>
      </section>

      <!-- AÇÕES -->
      <div class="actions">
        <button class="cancel" onclick="">Cancelar</button>
        <button class="save" onclick="">Salvar Alterações</button>
      </div>

    </div>
  </div>
</div>

