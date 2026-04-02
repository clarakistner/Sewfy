import { API } from "../js/API_JS/api.js";
import { mostrarToast } from "./toast/toast.js";
import { formatarData, aplicarMascaraMoeda, converterMoedaParaNumero } from "../js/assets/mascaras.js";
import "../css/visualizarContas.css";
import "../css/todasContas.css";
import "../css/menu.css";
import "../css/configmenu.css";
import "../js/visualizarContas.js";
import "../js/menu.js";
import "../js/configmenu.js";

if (!window.api) {
    window.api = new API();
}

document.addEventListener("DOMContentLoaded", () => {
    carregarContas();
    inicializarPesquisa();
    inicializarFiltrosExtras();
});

// PESQUISA
function inicializarPesquisa() {
    const inputPesquisa = document.querySelector(".input-pesquisa input");
    const selectTipo    = document.getElementById("tipos-filtro");

    if (!inputPesquisa || !selectTipo) {
        console.warn("[WARN] Campo de pesquisa ou filtro não encontrado");
        return;
    }

    let timeout = null;

    window.executarBuscaComFiltros = function () {
        const termo       = inputPesquisa.value.trim();
        const status      = selectTipo.value === "todas" ? "" : selectTipo.value;
        const dataInicial = document.querySelector(".input-data-inicial")?.value ?? "";
        const dataFinal   = document.querySelector(".input-data-final")?.value   ?? "";
        const valorMinRaw = document.querySelector(".input-valor-min")?.value    ?? "";
        const valorMaxRaw = document.querySelector(".input-valor-max")?.value    ?? "";
        const valorMin    = valorMinRaw ? converterMoedaParaNumero(valorMinRaw) : "";
        const valorMax    = valorMaxRaw ? converterMoedaParaNumero(valorMaxRaw) : "";

        const temFiltro = termo || status || dataInicial || dataFinal || valorMin || valorMax;

        if (!temFiltro) {
            carregarContas();
            return;
        }

        pesquisarContas({ termo, status, dataInicial, dataFinal, valorMin, valorMax });
    };

    inputPesquisa.addEventListener("input", () => {
        clearTimeout(timeout);
        timeout = setTimeout(window.executarBuscaComFiltros, 300);
    });

    selectTipo.addEventListener("change", window.executarBuscaComFiltros);
}

// LISTAR TODAS
async function carregarContas() {
    const tbody = document.getElementById("contas-table");

    if (!tbody) {
        console.warn("[WARN] Tabela de contas não encontrada");
        return;
    }

    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="mensagem-vazia">Carregando...</td>
        </tr>
    `;

    try {
        const contas = await window.api.get("/contas-pagar");
        renderizarTabela(contas);
    } catch (erro) {
        console.error("[ERRO] Falha ao carregar contas:", erro);
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="mensagem-vazia">Erro ao carregar contas</td>
            </tr>
        `;
        mostrarToast("Erro ao carregar contas", "erro");
    }
}

// PESQUISAR
async function pesquisarContas({ termo, status, dataInicial, dataFinal, valorMin, valorMax }) {
    const tbody = document.getElementById("contas-table");

    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="mensagem-vazia">Carregando...</td>
        </tr>
    `;

    try {
        const params = new URLSearchParams();
        if (termo)       params.append("termo",        termo);
        if (status)      params.append("status",       status);
        if (dataInicial) params.append("data_inicial", dataInicial);
        if (dataFinal)   params.append("data_final",   dataFinal);
        if (valorMin)    params.append("valor_min",    valorMin);
        if (valorMax)    params.append("valor_max",    valorMax);

        const contas = await window.api.get(`/contas-pagar?${params.toString()}`);
        renderizarTabela(contas);
    } catch (erro) {
        console.error("[ERRO BUSCA]", erro);
        mostrarToast("Erro ao pesquisar contas", "erro");
    }
}

// RENDERIZAÇÃO
function renderizarTabela(contas) {
    const tbody = document.getElementById("contas-table");
    tbody.innerHTML = "";

    if (!Array.isArray(contas) || !contas.length) {
        tbody.innerHTML = `
            <tr class="linha-vazia">
                <td colspan="6" class="mensagem-vazia">Nenhuma conta encontrada</td>
            </tr>
        `;
        return;
    }

    contas.forEach(conta => {
        const tr = document.createElement("tr");
        tr.classList.add("table-row");

        const badgeClass = {
            'pendente': 'badge-pe',
            'pago':     'badge-pa',
        }[conta.status] ?? 'badge-pe';

        tr.innerHTML = `
            <td class="table-cell">
                <span class="${badgeClass}">${conta.status}</span>
            </td>
            <td class="table-cell">${conta.id}</td>
            <td class="table-cell">${conta.fornecedor}</td>
            <td class="table-cell">${formatarData(conta.vencimento)}</td>
            <td class="table-cell">${formatarData(conta.pagamento)}</td>
            <td class="table-cell">
                <button type="button" class="botao-visualizar-conta"
                    data-id="${conta.id}"
                    data-fornecedor="${conta.fornecedor}"
                    data-status="${conta.status}"
                    data-valor="${conta.valor}"
                    data-vencimento="${conta.vencimento}"
                    data-pagamento="${conta.pagamento ?? ''}"
                    data-telefone="${conta.telefone ?? ''}"
                    data-op="${conta.op_id ?? ''}">
                    <span class="material-symbols-outlined icone-visualizar-conta">visibility</span>
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// FILTROS EXTRAS (tempo e valor)
function inicializarFiltrosExtras() {
    const btnMaisFiltros   = document.getElementById("btn-mais-filtros");
    const dropdown         = document.getElementById("dropdown-filtros");
    const containerFiltros = document.getElementById("container-filtros");

    if (!btnMaisFiltros || !dropdown || !containerFiltros) {
        console.warn("[WARN] Elementos de filtros extras não encontrados");
        return;
    }

    dropdown.style.display = "none";

    btnMaisFiltros.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".mais-filtros")) {
            dropdown.style.display = "none";
        }
    });

    dropdown.addEventListener("click", (e) => {
        const botao = e.target.closest("button");
        if (!botao) return;

        const tipoFiltro = botao.dataset.filtro;
        if (tipoFiltro === "tempo") inserirFiltroTempo(containerFiltros);
        if (tipoFiltro === "valor") inserirFiltroValor(containerFiltros);

        dropdown.style.display = "none";
    });
}

function inserirFiltroTempo(container) {
    if (document.getElementById("filtro-tempo")) return;

    const filtro = document.createElement("div");
    filtro.classList.add("filtro-extra");
    filtro.id = "filtro-tempo";
    filtro.innerHTML = `
        <span class="material-symbols-outlined icone-novo-calendario">calendar_month</span>
        <input type="date" class="input-data-inicial">
        <span>até</span>
        <input type="date" class="input-data-final">
        <button class="material-symbols-outlined btn-remover-filtronovo">close</button>
    `;

    container.appendChild(filtro);

    filtro.querySelector(".input-data-inicial").addEventListener("change", window.executarBuscaComFiltros);
    filtro.querySelector(".input-data-final").addEventListener("change", window.executarBuscaComFiltros);
    filtro.querySelector(".btn-remover-filtronovo").addEventListener("click", () => {
        filtro.remove();
        window.executarBuscaComFiltros();
    });
}

function inserirFiltroValor(container) {
    if (document.getElementById("filtro-valor")) return;

    const filtro = document.createElement("div");
    filtro.classList.add("filtro-extra");
    filtro.id = "filtro-valor";
    filtro.innerHTML = `
        <span class="material-symbols-outlined icone-novo-dinheiro">attach_money</span>
        <input type="text" placeholder="R$ 00,00" class="input-valor-min">
        <span>até</span>
        <input type="text" placeholder="R$ 00,00" class="input-valor-max">
        <button class="material-symbols-outlined btn-remover-filtronovo">close</button>
    `;

    container.appendChild(filtro);

    const inputMin = filtro.querySelector(".input-valor-min");
    const inputMax = filtro.querySelector(".input-valor-max");

    aplicarMascaraMoeda(inputMin);
    aplicarMascaraMoeda(inputMax);

    inputMin.addEventListener("change", window.executarBuscaComFiltros);
    inputMax.addEventListener("change", window.executarBuscaComFiltros);
    filtro.querySelector(".btn-remover-filtronovo").addEventListener("click", () => {
        filtro.remove();
        window.executarBuscaComFiltros();
    });
}

// FUNÇÃO GLOBAL
window.atualizarListaContas = () => {
    carregarContas();
};