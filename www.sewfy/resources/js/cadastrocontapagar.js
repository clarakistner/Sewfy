import { mostrarToast } from "./toast/toast.js";
import { formatarMoeda, converterMoedaParaNumero, dataHoje, dataHojeMais } from "../js/assets/mascaras.js";
import { getBaseUrl } from "./API_JS/api.js";
import { criarSelectPesquisa } from "./selectPesquisa.js";

const url = getBaseUrl();

let selectFornecedor = null;

// ABRIR MODAL
document.addEventListener("click", (e) => {
    if (e.target.closest(".botao-criar-conta-pagar")) {
        fetch(url + "/cadastro-conta-pagar")
            .then(res => res.text())
            .then(html => {
                document.body.insertAdjacentHTML("afterbegin", html);
                setTimeout(() => inicializarEventosModal(), 50);
            })
            .catch(err => {
                console.error("[MODAL] Erro ao carregar modal:", err);
                mostrarToast("Erro ao abrir formulário", "erro");
            });
    }
});

// FECHAR MODAL
document.addEventListener("click", (e) => {
    if (e.target.closest(".btn-submit")) return;

    if (
        e.target.classList.contains("icone-fechar-modal") ||
        e.target.closest(".btn-cancel")
    ) {
        document.querySelector("#contaPagarModal")?.remove();
        selectFornecedor = null;
    }
});

// INICIALIZAR EVENTOS
async function inicializarEventosModal() {
    const form = document.querySelector("#ContaPagar");
    if (!form) return;

    const valorInput      = document.getElementById("cpValor");
    const emissaoInput    = document.getElementById("cpEmissao");
    const vencimentoInput = document.getElementById("cpVencimento");
    const ocorrenciaInput = document.getElementById("cpOcorrencia");
    const historicoInput  = document.getElementById("cpHistorico");

    // Datas com fuso correto
    emissaoInput.value    = dataHoje();
    vencimentoInput.value = dataHojeMais(1);

    // Máscara de moeda
    valorInput.addEventListener("input", (e) => {
        let valor = e.target.value.replace(/\D/g, "");
        valor = (Number(valor) / 100).toFixed(2);
        e.target.value = formatarMoeda(valor);
    });

    // Select de fornecedor com pesquisa
    selectFornecedor = criarSelectPesquisa({
        triggerId:   "triggerFornecedor",
        dropdownId:  "dropdownFornecedor",
        listaId:     "listaFornecedor",
        labelId:     "labelFornecedor",
        hiddenId:    "fornecedorValor",
        placeholder: "Selecione um fornecedor",
    });
    selectFornecedor.inicializar();
    await carregarFornecedores();

    // Campo de parcelas dinâmico
    ocorrenciaInput.addEventListener("change", () => {
        const temOcorrencia = ocorrenciaInput.value !== "";
        const jaExiste      = document.getElementById("area-cp-parcelas");
        const cpGrid        = document.querySelector(".cp-grid");

        if (temOcorrencia && !jaExiste) {
            cpGrid.style.gridTemplateAreas = `
                "cp-fornecedor  cp-valor"
                "cp-emissao     cp-vencimento"
                "cp-ocorrencia  cp-parcelas"
                "cp-historico   cp-historico"
            `;
            const div = document.createElement("div");
            div.className = "area-cp-parcelas";
            div.id        = "area-cp-parcelas";
            div.innerHTML = `
                <label>Número de Parcelas *</label>
                <input type="number" id="cpParcelas" min="2" max="360" placeholder="Ex: 12" />
            `;
            ocorrenciaInput.closest(".area-cp-ocorrencia").insertAdjacentElement("afterend", div);
        } else if (!temOcorrencia && jaExiste) {
            cpGrid.style.gridTemplateAreas = `
                "cp-fornecedor  cp-valor"
                "cp-emissao     cp-vencimento"
                "cp-ocorrencia  cp-ocorrencia"
                "cp-historico   cp-historico"
            `;
            jaExiste.remove();
        }
    });

    // Botão cadastrar e pagar
    document.querySelector(".btn-cadastrar-pagar")?.addEventListener("click", async () => {
        await cadastrarConta(valorInput, emissaoInput, vencimentoInput, ocorrenciaInput, historicoInput, true);
    });

    // Botão cadastrar (submit normal)
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await cadastrarConta(valorInput, emissaoInput, vencimentoInput, ocorrenciaInput, historicoInput, false);
    });
}

// CARREGAR FORNECEDORES
async function carregarFornecedores() {
    try {
        const lista = await window.api.get("/clifor/fornecedores");
        selectFornecedor.setOpcoes(
            lista.map(f => ({ id: String(f.id), value: String(f.id), label: f.nome }))
        );
    } catch (erro) {
        mostrarToast("Erro ao carregar fornecedores", "erro");
    }
}

// CADASTRAR
async function cadastrarConta(valorInput, emissaoInput, vencimentoInput, ocorrenciaInput, historicoInput, pagar = false) {
    const fornecedor = selectFornecedor?.getValue();
    const cliforId   = fornecedor?.id ? Number(fornecedor.id) : null;
    const valor      = converterMoedaParaNumero(valorInput.value.trim());
    const emissao    = emissaoInput.value;
    const vencimento = vencimentoInput.value;
    const ocorrencia = ocorrenciaInput.value || null;
    const historico  = historicoInput.value.trim() || null;
    const parcelas   = document.getElementById("cpParcelas")?.value
                        ? Number(document.getElementById("cpParcelas").value)
                        : null;

    if (!cliforId) {
        mostrarToast("Selecione um fornecedor", "erro");
        return;
    }
    if (!valor || valor <= 0) {
        mostrarToast("Informe um valor válido", "erro");
        return;
    }
    if (!emissao) {
        mostrarToast("Informe a data de emissão", "erro");
        return;
    }
    if (!vencimento) {
        mostrarToast("Informe a data de vencimento", "erro");
        return;
    }
    if (vencimento < emissao) {
        mostrarToast("A data de vencimento não pode ser anterior à data de emissão", "erro");
        return;
    }
    if (historico && historico.length > 255) {
        mostrarToast("Histórico deve ter menos de 255 caracteres", "erro");
        return;
    }
    if (ocorrencia && !parcelas) {
        mostrarToast("Informe o número de parcelas", "erro");
        return;
    }
    if (parcelas && (parcelas < 2 || parcelas > 360)) {
        mostrarToast("Número de parcelas deve ser entre 2 e 360", "erro");
        return;
    }

    try {
        const response = await window.api.post("/contas-pagar", {
            clifor_id: cliforId,
            valor,
            emissao,
            vencimento,
            ocorrencia,
            historico,
            parcelas,
            pagamento: pagar ? dataHoje() : null,
        });

        mostrarToast(response.mensagem || "Conta cadastrada com sucesso!", "sucesso");
        document.querySelector("#contaPagarModal")?.remove();
        selectFornecedor = null;
        window.atualizarListaContas?.();

    } catch (erro) {
        console.error("[FETCH ERRO]", erro);
        mostrarToast(erro.message || "Erro ao cadastrar conta", "erro");
    }
}