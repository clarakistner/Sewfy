import "../js/menu.js";
import "../js/modalOrdemDeProducao.js";
import "../js/visualizarContas.js";
import "../js/configmenu.js";
import "../js/edicaoOrdemDeProducao.js";
import { abrirModal } from "../js/modalOrdemDeProducao.js";
import { getCookie, setCookie, deleteCookie, popCookie } from "./API_JS/api.js";
import { API, getBaseUrl } from "./API_JS/api.js";

if (!window.api) {
    window.BASE_URL = getBaseUrl();
    window.api = new API();
}
window.addEventListener("load", () => {
    const urlAnterior = getCookie("url_anterior") ?? "";

    deleteCookie("url_anterior");

    const urlSegura = urlAnterior.startsWith(window.location.origin)
        ? urlAnterior
        : "";

    if (urlSegura && urlSegura !== window.location.href) {
        window.location.replace(urlSegura);
    }
});

export async function carregarHome() {
    try {
        const res = await window.api.get("/home/config");
        const config = res.config;
        const main = document.querySelector("main");
        main.innerHTML = "";

        if(config.EXIBIR_ORDENS && config.EXIBIR_CONTAS_PAGAR){
          await Promise.all([
            renderizarOrdens(main, config.FILTRO_ORDENS),
            renderizarContasPagar(main, config.FILTRO_CONTAS_PAGAR)
          ]);
          return;
        }
        if (config.EXIBIR_ORDENS) {
            await renderizarOrdens(main, config.FILTRO_ORDENS);
        }

        if (config.EXIBIR_CONTAS_PAGAR) {
            await renderizarContasPagar(main, config.FILTRO_CONTAS_PAGAR);
        }
    } catch (error) {
        console.error("Erro ao carregar home:", error);
    }
}

export async function renderizarOrdens(main, filtro) {
    const secao = document.createElement("section");
    secao.classList.add("secao-ordens");

    const titulo = filtro === "aberta"
        ? "Ordens de Produção Abertas"
        : filtro === "fechada"
            ? "Ordens de Produção Fechadas"
            : "Ordens de Produção";

    secao.innerHTML = `
        <div class="titulo-secao">
            <div class="barra"></div>
            <h2>${titulo}</h2>
        </div>
        <div class="lista-ordens-home"></div>
    `;
    main.appendChild(secao);

    try {
        const res = await window.api.get("/ordemdeproducao/listar");
        let ordens = res.ordensProducao ?? [];

        if (filtro === "aberta")  ordens = ordens.filter((op) => !op.datae);
        if (filtro === "fechada") ordens = ordens.filter((op) => !!op.datae);

        const lista = secao.querySelector(".lista-ordens-home");

        if (ordens.length === 0) {
            lista.innerHTML = `<div class="vazio">Nenhuma ordem encontrada</div>`;
            return;
        }

        // Abertas primeiro, fechadas por último
        ordens.sort((a, b) => {
            if (!a.datae && b.datae) return -1;
            if (a.datae && !b.datae) return 1;
            return 0;
        });

        ordens.forEach((op) => {
            const dataAbertura = op.dataa
                ? new Date(op.dataa).toLocaleDateString("pt-BR", { timeZone: "UTC" })
                : "-";
            const dataFechamento = op.datae
                ? new Date(op.datae).toLocaleDateString("pt-BR", { timeZone: "UTC" })
                : null;

            const statusClass = !op.datae ? "aberta" : "fechada";
            const statusIcone = !op.datae
                ? `<span class="material-symbols-outlined" style="font-size:13px;">sync</span>`
                : `<span class="material-symbols-outlined" style="font-size:13px;">check_circle</span>`;
            const statusTexto = !op.datae ? "Aberta" : "Fechada";

            const card = document.createElement("div");
            card.classList.add("card");
            if (!!op.datae) card.classList.add("ordem-fechada");
            card.style.cursor = "pointer";

            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-barra ${statusClass}"></div>
                    <div class="card-conteudo">
                        <div class="card-identificacao">
                            <div>
                                <p class="card-codigo">${op.idOP}</p>
                                <p class="card-sublabel">Ordem de Produção</p>
                            </div>
                            <span class="card-badge ${statusClass}">${statusIcone} ${statusTexto}</span>
                        </div>
                        <div class="card-divisor"></div>
                        <div class="card-infos">
                            <div class="card-info-item">
                                <p>Produto</p>
                                <p>${op.nome_produto ?? "-"}</p>
                            </div>
                            <div class="card-info-item centralizado">
                                <p>Quantidade</p>
                                <p>${parseInt(op.datae ? (op.qtdeOP ?? op.qtdOP) : op.qtdOP).toLocaleString("pt-BR")}</p>
                            </div>
                            <div class="card-info-item">
                                <p>Data de abertura</p>
                                <p>${dataAbertura}</p>
                            </div>
                            ${dataFechamento ? `
                            <div class="card-info-item">
                                <p>Data de fechamento</p>
                                <p class="valor-fechamento">${dataFechamento}</p>
                            </div>` : ""}
                        </div>
                    </div>
                </div>
            `;

            card.addEventListener("click", async () => {
                await abrirModal(op.idOP);
            });

            lista.appendChild(card);
        });
    } catch (error) {
        console.error("Erro ao buscar ordens:", error);
    }
}

export async function renderizarContasPagar(main, filtro) {
    const secao = document.createElement("section");
    secao.classList.add("secao-contas");

    const titulo = filtro === "pendente"
        ? "Contas a Pagar Pendentes"
        : filtro === "pago"
            ? "Contas a Pagar Pagas"
            : "Contas a Pagar";

    secao.innerHTML = `
        <div class="titulo-secao">
            <div class="barra"></div>
            <h2>${titulo}</h2>
        </div>
        <div class="lista-contas-home"></div>
    `;
    main.appendChild(secao);

    try {
        const params = filtro !== "todos" ? `?status=${filtro}` : "";
        const contas = await window.api.get(`/contas-pagar${params}`);
        const lista = secao.querySelector(".lista-contas-home");

        if (!Array.isArray(contas) || contas.length === 0) {
            lista.innerHTML = `<div class="vazio">Nenhuma conta encontrada</div>`;
            return;
        }

        contas.sort((a, b) => {
            if (a.status === "pendente" && b.status !== "pendente") return -1;
            if (a.status !== "pendente" && b.status === "pendente") return 1;
            return 0;
        });

        contas.forEach((cp) => {
            const statusClass = cp.status === "pendente" ? "pendente" : cp.status === "atrasada" ? "atrasada" : "pago";
            const statusTexto = cp.status === "pendente" ? "Pendente" : cp.status === "atrasada" ? "Atrasada" : "Pago";

            const card = document.createElement("div");
            card.classList.add("card", "botao-visualizar-conta");
            if (cp.status === "pago") card.style.opacity = "0.75";
            card.style.cursor = "pointer";

            // dataset completo
            card.dataset.id         = cp.id          ?? "";
            card.dataset.fornecedor = cp.fornecedor  ?? "";
            card.dataset.status     = cp.status      ?? "";
            card.dataset.valor      = cp.valor       ?? "";
            card.dataset.vencimento = cp.vencimento  ?? "";
            card.dataset.pagamento  = cp.pagamento   ?? "";
            card.dataset.emissao    = cp.emissao     ?? "";
            card.dataset.telefone   = cp.telefone    ?? "";
            card.dataset.op         = cp.op_id       ?? "";
            card.dataset.servico    = cp.servico      ?? "";
            card.dataset.historico  = cp.historico   ?? "";
            card.dataset.grupo      = cp.grupo_id    ?? "";
            card.dataset.ocorrencia = cp.ocorrencia  ?? "";
            card.dataset.parcelaNum = cp.parcela_num ?? "";
            card.dataset.parcelaTot = cp.parcela_tot ?? "";

            // Define o tipo e monta as colunas variáveis
            const ehOP          = !!cp.op_id;
            const ehRecorrente  = !!cp.grupo_id && !cp.op_id;

            let colunasVariaveis = "";

            if (ehOP) {
                colunasVariaveis = `
                    <div class="card-conta-col card-conta-op">
                        <p class="card-op-label">OP</p>
                        <p class="card-op-codigo">${cp.op_id}</p>
                    </div>
                    <div class="card-conta-col">
                        <p class="card-info-label">Serviço</p>
                        <p class="card-info-valor">${cp.servico ?? "-"}</p>
                    </div>
                `;
            } else if (ehRecorrente) {
                colunasVariaveis = `
                    <div class="card-conta-col card-conta-op">
                        <p class="card-op-label">Parcela</p>
                        <p class="card-op-codigo">${cp.parcela_num} / ${cp.parcela_tot}</p>
                    </div>
                    <div class="card-conta-col">
                        <p class="card-info-label">Ocorrência</p>
                        <p class="card-info-valor">${cp.ocorrencia ?? "-"}</p>
                    </div>
                `;
            }
            // avulsa: colunasVariaveis fica vazio, card mais simples

            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-barra ${statusClass}"></div>
                    <div class="card-conteudo card-conteudo-conta">
                        ${colunasVariaveis}
                        <div class="card-conta-col">
                            <p class="card-info-label">Fornecedor</p>
                            <p class="card-info-valor">${cp.fornecedor ?? "-"}</p>
                        </div>
                        <div class="card-conta-col">
                            <p class="card-info-label">Vencimento</p>
                            <p class="card-info-valor">${formatarData(cp.vencimento)}</p>
                        </div>
                        <div class="card-conta-col">
                            <p class="card-info-label">Pagamento</p>
                            <p class="card-info-valor ${cp.pagamento ? 'valor-pago' : ''}">${formatarData(cp.pagamento)}</p>
                        </div>
                        <span class="card-badge-status ${statusClass}">${statusTexto}</span>
                    </div>
                </div>
            `;

            lista.appendChild(card);
        });
    } catch (error) {
        console.error("Erro ao buscar contas:", error);
    }
}

async function retornaNomeProduto(id) {
    try {
        const produto = await window.api.get(`/produtos/${parseInt(id)}`);
        return produto.nome;
    } catch (error) {
        console.error("Erro ao buscar produto:", error);
        return "-";
    }
}

function formatarData(data) {
    if (!data) return "-";
    return new Date(data).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

document.addEventListener("DOMContentLoaded", () => {
    carregarHome();
    window.atualizarListaContas = () => carregarHome();
    window.atualizarListaOrdens = () => carregarHome();
});
