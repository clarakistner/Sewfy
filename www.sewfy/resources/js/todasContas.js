import { API } from "../js/API_JS/api.js";
import { mostrarToast } from "./toast/toast.js";
import { formatarData, aplicarMascaraMoeda, converterMoedaParaNumero } from "../js/assets/mascaras.js";
import "../css/visualizarContas.css";
import "../css/todasContas.css";
import "../css/menu.css";
import "../css/configmenu.css";
import "../css/cadastrocontapagar.css";
import "../js/visualizarContas.js";
import "../js/menu.js";
import "../js/configmenu.js";
import "../js/cadastrocontapagar.js";
import "../css/modalModoEdicao.css";
import "../css/modalordemdeproducao.css";
import "../css/edicaoOrdemDeProducao.css";

if (!window.api) {
    window.api = new API();
}

// cache das contas para filtrar localmente
let cacheContas = null;

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

        const temFiltro = termo || status || dataInicial || dataFinal || valorMin !== "" || valorMax !== "";

        if (!temFiltro) {
            if (cacheContas) {
                renderizarTabela(cacheContas);
            } else {
                carregarContas();
            }
            return;
        }

        filtrarContas({ termo, status, dataInicial, dataFinal, valorMin, valorMax });
    };

    inputPesquisa.addEventListener("input", () => {
        clearTimeout(timeout);
        timeout = setTimeout(window.executarBuscaComFiltros, 300);
    });

    selectTipo.addEventListener("change", window.executarBuscaComFiltros);
}

// LISTAR TODAS — busca do backend e salva no cache
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
        contas.sort((a, b) => {
            const ordem = { atrasada: 0, pendente: 1, paga: 2 };
            return (ordem[a.status] ?? 1) - (ordem[b.status] ?? 1);
        });
        cacheContas = contas;
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

// FILTRAR — termo e status vão ao backend, valor e data filtram localmente no cache
async function filtrarContas({ termo, status, dataInicial, dataFinal, valorMin, valorMax }) {
    const tbody = document.getElementById("contas-table");

    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="mensagem-vazia">Carregando...</td>
        </tr>
    `;

    try {
        // busca no backend apenas por termo e status (não têm problema de timing)
        const params = new URLSearchParams();
        if (termo)  params.append("termo",  termo);
        if (status) params.append("status", status);
        if (dataInicial) params.append("data_inicial", dataInicial);
        if (dataFinal)   params.append("data_final",   dataFinal);

        const url = params.toString() ? `/contas-pagar?${params.toString()}` : "/contas-pagar";
        const contas = await window.api.get(url);

        // filtra valor localmente — sem depender de timing de máscara
        let resultado = contas;
        if (valorMin !== "") resultado = resultado.filter(c => parseFloat(c.valor) >= valorMin);
        if (valorMax !== "") resultado = resultado.filter(c => parseFloat(c.valor) <= valorMax);

        resultado.sort((a, b) => {
            const ordem = { atrasada: 0, pendente: 1, paga: 2 };
            return (ordem[a.status] ?? 1) - (ordem[b.status] ?? 1);
        });

        renderizarTabela(resultado);
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
            'paga':     'badge-pa',
            'atrasada': 'badge-at',
        }[conta.status] ?? 'badge-pe';

        const td = document.createElement("td");
        td.className = "table-cell";

        const btn = document.createElement("button");
        btn.type      = "button";
        btn.className = "botao-visualizar-conta";

        btn.dataset.id          = conta.id          ?? '';
        btn.dataset.fornecedor  = conta.fornecedor   ?? '';
        btn.dataset.status      = conta.status       ?? '';
        btn.dataset.valor       = conta.valor        ?? '';
        btn.dataset.vencimento  = conta.vencimento   ?? '';
        btn.dataset.pagamento   = conta.pagamento    ?? '';
        btn.dataset.emissao     = conta.emissao      ?? '';
        btn.dataset.telefone    = conta.telefone     ?? '';
        btn.dataset.op          = conta.op_id        ?? '';
        btn.dataset.historico   = conta.historico    ?? '';
        btn.dataset.ocorrencia  = conta.ocorrencia   ?? '';
        btn.dataset.grupo       = conta.grupo_id     ?? '';
        btn.dataset.parcelaNum  = conta.parcela_num  ?? '';
        btn.dataset.parcelaTot  = conta.parcela_tot  ?? '';

        btn.innerHTML = `<span class="material-symbols-outlined icone-visualizar-conta">visibility</span>`;
        td.appendChild(btn);

        tr.innerHTML = `
            <td class="table-cell">
                <span class="${badgeClass}">${conta.status}</span>
            </td>
            <td class="table-cell">${conta.id}</td>
            <td class="table-cell">${conta.fornecedor}</td>
            <td class="table-cell">${formatarData(conta.vencimento)}</td>
            <td class="table-cell">${formatarData(conta.pagamento)}</td>
        `;
        tr.appendChild(td);
        tbody.appendChild(tr);
    });
}

let filtrosInicializados = false;

function inicializarFiltrosExtras() {
    if (filtrosInicializados) return;
    filtrosInicializados = true;

    const btnMaisFiltros   = document.getElementById("btn-mais-filtros");
    const dropdown         = document.getElementById("dropdown-filtros");
    const containerFiltros = document.getElementById("container-filtros");

    if (!btnMaisFiltros || !dropdown || !containerFiltros) {
        console.warn("[WARN] Elementos de filtros extras não encontrados");
        return;
    }

    btnMaisFiltros.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("aberto");
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest("#btn-mais-filtros")) {
            dropdown.classList.remove("aberto");
        }
    });

    dropdown.addEventListener("click", (e) => {
        e.stopPropagation();

        const botao = e.target.closest("button");
        if (!botao) return;

        const tipoFiltro = botao.dataset.filtro;
        if (tipoFiltro === "tempo") inserirFiltroTempo(containerFiltros);
        if (tipoFiltro === "valor") inserirFiltroValor(containerFiltros);

        dropdown.classList.remove("aberto");
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

    filtro.querySelector(".input-data-inicial").addEventListener("change", () => window.executarBuscaComFiltros?.());
    filtro.querySelector(".input-data-final").addEventListener("change",   () => window.executarBuscaComFiltros?.());
    filtro.querySelector(".btn-remover-filtronovo").addEventListener("click", () => {
        filtro.remove();
        window.executarBuscaComFiltros?.();
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

    // usa blur — dispara quando o usuário sai do campo, com o valor já formatado pela máscara
    inputMin.addEventListener("blur", () => window.executarBuscaComFiltros?.());
    inputMax.addEventListener("blur", () => window.executarBuscaComFiltros?.());

    filtro.querySelector(".btn-remover-filtronovo").addEventListener("click", () => {
        filtro.remove();
        window.executarBuscaComFiltros?.();
    });
}

// FUNÇÃO GLOBAL
window.atualizarListaContas = () => {
    cacheContas = null;
    carregarContas();
};