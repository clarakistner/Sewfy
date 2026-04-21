<div class="fundo" id="fundo-confirmar-fechamento">
    <div class="modal-container" id="modal-confirmar-fechamento">

        <div class="cf-header">
            <div>
                <h2 class="cf-titulo">Fechar Ordem de Produção</h2>
                <p class="cf-subtitulo">Preencha os dados antes de prosseguir</p>
            </div>
            <button class="cf-fechar" id="btnFecharCF">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>

        <div class="cf-body">

            <div class="cf-campo">
                <label class="cf-label" for="quantidadeQuebra">Quantidade de Quebra</label>
                <input type="number" id="quantidadeQuebra" name="quantidadeQuebra" class="cf-input" placeholder="0" min="0"/>
                <span class="cf-campo-hint">Informe quantas unidades não foram aproveitadas</span>
            </div>

            <div class="cf-aviso">
                <span class="material-symbols-outlined cf-aviso-icone">warning</span>
                <p>Tem certeza que deseja fechar esta ordem de produção? Esta ação não poderá ser desfeita.</p>
            </div>

            <div class="cf-botoes">
                <button id="cancelClose" class="cf-btn cf-btn-cancelar">Cancelar</button>
                <button id="confirmClose" class="cf-btn cf-btn-confirmar">Sim, Fechar</button>
            </div>

        </div>
    </div>
</div>