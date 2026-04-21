import "../js/menu.js";
import "../js/configmenu.js";
import "../js/modalOrdemDeProducao.js";
import "../js/edicaoOrdemDeProducao.js";
import "../js/API_JS/api.js";
import { mostrarToast } from "./toast/toast.js";
import { aplicarMascaraMoeda, converterMoedaParaNumero } from "../js/assets/mascaras.js";

let cacheOPs         = null;
let cacheProdutosOPs = null;
let timeout;
let carregando       = false;

document.addEventListener("input",  handleInput);
document.addEventListener("change", handleChange);
document.addEventListener("click",  handleClick);

document.addEventListener("DOMContentLoaded", async () => {
    const toast = sessionStorage.getItem("toast");
    if (toast) {
        mostrarToast(toast);
        sessionStorage.removeItem("toast");
    }
    inicializarFiltrosExtras();
    await listarOrdensProducao();
});

function handleClick(e) {
    if (e.target.closest(".icone-adicionar-ordem") || e.target.closest(".botao-criar-ordem")) {
        window.location.href = "../criar-ordemdeproducao";
    }
}

function handleInput(e) {
    if (e.target.closest("#barraPesquisa")) {
        clearTimeout(timeout);
        timeout = setTimeout(() => executarBuscaComFiltros(), 300);
    }
}

function handleChange(e) {
    if (e.target.closest("#tipos-filtro")) {
        executarBuscaComFiltros();
    }
}

// ─── FILTROS ──────────────────────────────────────────────────────────────────

function executarBuscaComFiltros() {
    const valorPesquisa = document.getElementById("barraPesquisa")?.value.trim() ?? "";
    const filtroStatus  = document.getElementById("tipos-filtro")?.value ?? "todas";
    const dataInicial   = document.querySelector(".input-data-inicial")?.value ?? "";
    const dataFinal     = document.querySelector(".input-data-final")?.value   ?? "";
    const valorMinRaw   = document.querySelector(".input-valor-min")?.value    ?? "";
    const valorMaxRaw   = document.querySelector(".input-valor-max")?.value    ?? "";
    const valorMin      = valorMinRaw ? converterMoedaParaNumero(valorMinRaw) : "";
    const valorMax      = valorMaxRaw ? converterMoedaParaNumero(valorMaxRaw) : "";

    listarOrdensProducao(valorPesquisa, filtroStatus, dataInicial, dataFinal, valorMin, valorMax);
}

function inicializarFiltrosExtras() {
    const btnMaisFiltros   = document.getElementById("btn-mais-filtros");
    const dropdown         = document.getElementById("dropdown-filtros");
    const containerFiltros = document.getElementById("container-filtros");

    if (!btnMaisFiltros || !dropdown || !containerFiltros) return;

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
        if (botao.dataset.filtro === "tempo")  inserirFiltroTempo(containerFiltros);
        if (botao.dataset.filtro === "valor")  inserirFiltroValor(containerFiltros);
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

    filtro.querySelector(".input-data-inicial").addEventListener("change", executarBuscaComFiltros);
    filtro.querySelector(".input-data-final").addEventListener("change",   executarBuscaComFiltros);
    filtro.querySelector(".btn-remover-filtronovo").addEventListener("click", () => {
        filtro.remove();
        executarBuscaComFiltros();
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

    inputMin.addEventListener("change", executarBuscaComFiltros);
    inputMax.addEventListener("change", executarBuscaComFiltros);
    filtro.querySelector(".btn-remover-filtronovo").addEventListener("click", () => {
        filtro.remove();
        executarBuscaComFiltros();
    });
}

// ─── BUSCA / ORGANIZAÇÃO ──────────────────────────────────────────────────────

async function buscarEOrganizarOPs() {
    const listaOPsBanco = await window.api.get("/ordemdeproducao/listar");
    const listaOPs = listaOPsBanco.ordensProducao.sort((a, b) => {
        // Abertas primeiro, fechadas por último
        if (!a.datae && b.datae) return -1;
        if (a.datae && !b.datae) return 1;
        // Dentro de cada grupo, mais recentes primeiro
        const getNum = (str) => parseInt(str.match(/(\d+)$/)[1], 10);
        return getNum(b.idOP) - getNum(a.idOP);
    });

    const ids      = [...new Set(listaOPs.map((op) => op.prodIDOP))];
    const produtos = ids.length > 0
        ? await window.api.get(`/produtos?ids=${ids.join(",")}`)
        : [];
    const mapaProdutos = new Map(produtos.map((p) => [p.id, p.nome]));

    return { listaOPs, mapaProdutos };
}

// ─── FILTRAR ──────────────────────────────────────────────────────────────────

function filtrarOPs(listaOPs, valorPesquisa, filtroStatus, dataInicial, dataFinal, valorMin, valorMax, mapaProdutos) {
    let lista = [...listaOPs];

    // Filtro por código OU nome do produto
    if (valorPesquisa) {
        const termo = valorPesquisa.toLowerCase();
        lista = lista.filter((op) => {
            const nomeProduto = (mapaProdutos.get(op.prodIDOP) ?? "").toLowerCase();
            return op.idOP.toLowerCase().includes(termo) || nomeProduto.includes(termo);
        });
    }

    // Filtro por status
    if (filtroStatus && filtroStatus !== "todas") {
        lista = lista.filter((op) => {
            if (filtroStatus === "abertas")  return !op.datae;
            if (filtroStatus === "fechadas") return !!op.datae;
            return true;
        });
    }

    // Filtro por intervalo de tempo (data de abertura)
    if (dataInicial) {
        lista = lista.filter((op) => op.dataa && op.dataa >= dataInicial);
    }
    if (dataFinal) {
        lista = lista.filter((op) => op.dataa && op.dataa <= dataFinal);
    }

    // Filtro por custo total (OP_CUSTOT)
    if (valorMin !== "") {
        lista = lista.filter((op) => parseFloat(op.custot ?? 0) >= valorMin);
    }
    if (valorMax !== "") {
        lista = lista.filter((op) => parseFloat(op.custot ?? 0) <= valorMax);
    }

    return lista;
}

// ─── RENDERIZAÇÃO ─────────────────────────────────────────────────────────────

function criarCardOP(op, mapaProdutos) {
    const nomeProduto    = mapaProdutos.get(op.prodIDOP) || "Sem Nome";
    const dataAbertura   = new Date(op.dataa).toLocaleDateString("pt-BR", { timeZone: "UTC" });
    const dataFechamento = op.datae
        ? new Date(op.datae).toLocaleDateString("pt-BR", { timeZone: "UTC" })
        : "------";
    const statusClass = !op.datae ? "aberta"  : "fechada";
    const statusTexto = !op.datae ? "Aberta"  : "Fechada";
    const statusIcone = !op.datae
    ? `<span class="material-symbols-outlined" style="font-size:14px;">sync</span>`
    : `<span class="material-symbols-outlined" style="font-size:14px;">check_circle</span>`;
    const quantidade  = op.qtdeOP
        ? parseInt(op.qtdeOP).toLocaleString("pt-BR")
        : parseInt(op.qtdOP).toLocaleString("pt-BR");

    const card = document.createElement("div");
    card.className = `card-ordem${op.datae ? " ordem-fechada" : ""}`;
    card.innerHTML = `
        <div class="card-ordem-header">
            <div class="card-ordem-identificacao">
                <span class="label-ordem">Ordem de Produção:</span>
                <span class="codigo-ordem">${op.idOP}</span>
                <span class="status-ordem ${statusClass}">${statusIcone} ${statusTexto}</span>
            </div>
            <button class="btn-verop" data-id="${op.idOP}">Ver ordem</button>
        </div>
        <div class="card-ordem-infos">
            <div class="info-card">
                <span class="label-info"><span class="material-symbols-outlined" style="font-size:14px;">box</span> Produto</span>
                <span class="valor-info">${nomeProduto}</span>
            </div>
            <div class="info-card">
                <span class="label-info"><span class="material-symbols-outlined" style="font-size:14px;">box</span> Quantidade</span>
                <span class="valor-info">${quantidade}</span>
            </div>
            <div class="info-card">
                <span class="label-info"><span class="material-symbols-outlined" style="font-size:14px;">calendar_month</span> Data de abertura</span>
                <span class="valor-info">${dataAbertura}</span>
            </div>
            <div class="info-card">
                <span class="label-info"><span class="material-symbols-outlined" style="font-size:14px;">edit_calendar</span> Data de fechamento</span>
                <span class="valor-info">${dataFechamento}</span>
            </div>
        </div>
    `;
    return card;
}

// ─── LISTAR ───────────────────────────────────────────────────────────────────

export async function listarOrdensProducao(
    valorPesquisa = "",
    filtroStatus  = "todas",
    dataInicial   = "",
    dataFinal     = "",
    valorMin      = "",
    valorMax      = "",
) {
    if (carregando) return;
    carregando = true;

    try {
        const listaOrdensDOM = document.querySelector(".lista-ordens");
        listaOrdensDOM.innerHTML = `
            <div class="linha-vazia">
                <span class="mensagem-vazia">Carregando...</span>
            </div>
        `;

        if (!cacheOPs || !cacheProdutosOPs) {
            const resultado  = await buscarEOrganizarOPs();
            cacheOPs         = resultado.listaOPs;
            cacheProdutosOPs = resultado.mapaProdutos;
        }

        const listaOPs = filtrarOPs(
            cacheOPs, valorPesquisa, filtroStatus,
            dataInicial, dataFinal, valorMin, valorMax,
            cacheProdutosOPs
        );

        listaOrdensDOM.innerHTML = "";

        if (listaOPs.length === 0) {
            listaOrdensDOM.innerHTML = `
                <div class="linha-vazia">
                    <span class="mensagem-vazia">Nenhuma ordem encontrada</span>
                </div>
            `;
            return;
        }

        const fragment = document.createDocumentFragment();
        listaOPs.forEach((op) => fragment.appendChild(criarCardOP(op, cacheProdutosOPs)));
        listaOrdensDOM.appendChild(fragment);

    } catch (error) {
        console.log(`Erro ao listar as ordens de produção: ${error}`);
    } finally {
        carregando = false;
    }
}

export function limparLista() {
    const listaOrdensDOM = document.querySelector(".lista-ordens");
    listaOrdensDOM.innerHTML = "";
}

export function invalidarCache() {
    cacheOPs         = null;
    cacheProdutosOPs = null;
}