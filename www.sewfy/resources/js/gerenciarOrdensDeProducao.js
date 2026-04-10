import "../js/menu.js";
import "../js/configmenu.js";
import "../js/modalOrdemDeProducao.js";
import "../js/edicaoOrdemDeProducao.js";
import "../js/API_JS/api.js";

let cacheOPs = null;
let cacheProdutosOPs = null;
let timeout;
let carregando = false;

document.addEventListener("input", handleInput);
document.addEventListener("change", handleChange);
document.addEventListener("click", (e) => {
    if (e.target.closest(".icone-adicionar-ordem") || e.target.closest(".botao-criar-ordem")) {
        window.location.href = "../criar-ordemdeproducao";
    }
});
document.addEventListener("DOMContentLoaded", () => listarOrdensProducao(null, null));

function handleInput(e) {
    if (e.target.closest("#barraPesquisa")) {
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
            limparLista();
            await listarOrdensProducao(String(e.target.value), null);
        }, 300);
    }
}

function handleChange(e) {
    if (e.target.closest("#tipos-filtro")) {
        limparLista();
        listarOrdensProducao(null, String(e.target.value));
    }
}

async function buscarEOrganizarOPs() {
    const listaOPsBanco = await window.api.get("/ordemdeproducao/listar");
    return listaOPsBanco.ordensProducao.sort((a, b) => {
        const getNum = (str) => parseInt(str.match(/(\d+)$/)[1], 10);
        return getNum(a.idOP) - getNum(b.idOP);
    });
}

function filtrarOPs(listaOPs, valorPesquisa, filtro) {
    if (valorPesquisa) {
        listaOPs = listaOPs.filter((op) => op.idOP.includes(String(valorPesquisa)));
    }
    if (filtro) {
        listaOPs = listaOPs.filter((op) => {
            if (filtro === "abertas") return !op.datae;
            if (filtro === "fechadas") return op.datae;
            return op;
        });
    }
    return listaOPs;
}

function criarCardOP(op, mapaProdutos) {
    const nomeProduto = mapaProdutos.get(op.prodIDOP) || "Sem Nome";
    const dataAbertura = new Date(op.dataa).toLocaleDateString("pt-BR", { timeZone: "UTC" });
    const dataFechamento = op.datae ? new Date(op.datae).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : "------";
    const statusClass = !op.datae ? "aberta" : "fechada";
    const statusTexto = !op.datae ? "Aberta" : "Fechada";
    const quantidade = op.qtdeOP ? parseInt(op.qtdeOP).toLocaleString("pt-BR") : parseInt(op.qtdOP).toLocaleString("pt-BR");
    const ordemFechadaClass = op.datae ? "ordem-fechada" : "";

    const card = document.createElement("div");
    card.className = "card-ordem";
    card.innerHTML = `
        <div class="content-ordem ${ordemFechadaClass}">
            <div class="ordem-codigo-status">
                <div class="label-ordem">Ordem de Produção</div>
                <div class="codigo-ordem">${op.idOP}</div>
                <div class="status-ordem ${statusClass}">
                    <span class="icone-status">⏱</span>
                    ${statusTexto}
                </div>
            </div>
            <div class="info-ordem">
                <span class="material-symbols-outlined icone">package_2</span>
                <div><div class="label-info">Produto</div><div class="valor-info">${nomeProduto}</div></div>
            </div>
            <div class="info-ordem">
                <span class="material-symbols-outlined icone">package_2</span>
                <div><div class="label-info">Quantidade</div><div class="valor-info">${quantidade}</div></div>
            </div>
            <div class="info-ordem">
                <span class="material-symbols-outlined icone">calendar_month</span>
                <div><div class="label-info">Data de Abertura</div><div class="valor-info">${dataAbertura}</div></div>
            </div>
            <div class="info-ordem">
                <span class="material-symbols-outlined icone">calendar_month</span>
                <div><div class="label-info">Data de Fechamento</div><div class="valor-info">${dataFechamento}</div></div>
            </div>
            <div class="verop" id="${op.idOP}">
                <button class="btn-verop" id="${op.idOP}">Ver Ordem de Produção</button>
            </div>
        </div>
    `;
    return card;
}

function criaCardSemOPs() {
    const card = document.createElement("div");
    card.className = "card-ordem";
    card.style.cssText = "font-size:27px;font-weight:bold;display:flex;justify-content:center;align-items:center;";
    card.textContent = "Não há Ordens de Produção";
    return card;
}

export async function listarOrdensProducao(valorPesquisa = null, filtro = null) {
    if (carregando) return;
    carregando = true;
    try {
        limparLista();
        const listaOrdensDOM = document.querySelector(".lista-ordens");

        if (!cacheOPs) {
            cacheOPs = await buscarEOrganizarOPs();
        }

        let listaOPs = filtrarOPs(cacheOPs, valorPesquisa, filtro);

        if (!cacheProdutosOPs || cacheProdutosOPs.size === 0) {
            const ids = [...new Set(listaOPs.map((op) => op.prodIDOP))];
            const produtos = await window.api.get(`/produtos?ids=${ids.join(",")}`);
            cacheProdutosOPs = new Map(produtos.map((p) => [p.id, p.nome]));
        }

        if (listaOPs.length === 0) {
            listaOrdensDOM.appendChild(criaCardSemOPs());
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
    cacheOPs = null;
    cacheProdutosOPs = null;
}