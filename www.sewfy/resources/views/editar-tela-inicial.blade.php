<div class="containerConfigOwner">
  <div class="editarTelaInicial">

    <div class="tituloPagina">
      <h1>Editar Tela Inicial</h1>
      <p>Escolha o que será exibido na home da sua empresa</p>
    </div>

    <!-- Contas a Pagar -->
    <div class="secao-card">
      <div class="secao-header">
        <div class="secao-header-info">
          <h2 class="secao-titulo">Contas a Pagar</h2>
          <p class="secao-desc">Exibe as contas a pagar na tela inicial</p>
        </div>
        <label class="toggle">
          <input type="checkbox" id="toggle-contas-pagar" />
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="secao-filtro" id="filtro-contas-pagar">
        <p class="filtro-label">Exibir contas com status:</p>
        <div class="filtro-opcoes">
          <label class="filtro-item">
            <input type="radio" name="filtro-contas-pagar" value="pendente" />
            <span>Pendentes</span>
          </label>
          <label class="filtro-item">
            <input type="radio" name="filtro-contas-pagar" value="pago" />
            <span>Pagas</span>
          </label>
          <label class="filtro-item">
            <input type="radio" name="filtro-contas-pagar" value="todos" />
            <span>Todas</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Ordens de Produção -->
    <div class="secao-card">
      <div class="secao-header">
        <div class="secao-header-info">
          <h2 class="secao-titulo">Ordens de Produção</h2>
          <p class="secao-desc">Exibe as ordens de produção na tela inicial</p>
        </div>
        <label class="toggle">
          <input type="checkbox" id="toggle-ordens" />
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="secao-filtro" id="filtro-ordens">
        <p class="filtro-label">Exibir ordens com status:</p>
        <div class="filtro-opcoes">
          <label class="filtro-item">
            <input type="radio" name="filtro-ordens" value="aberta" />
            <span>Abertas</span>
          </label>
          <label class="filtro-item">
            <input type="radio" name="filtro-ordens" value="fechada" />
            <span>Fechadas</span>
          </label>
          <label class="filtro-item">
            <input type="radio" name="filtro-ordens" value="todas" />
            <span>Todas</span>
          </label>
        </div>
      </div>
    </div>

    <div class="containerBtnSalvar">
      <button class="botao">Salvar Alterações</button>
    </div>

  </div>
</div>