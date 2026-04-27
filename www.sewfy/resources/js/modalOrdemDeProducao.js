import { mostrarToast } from "./toast/toast.js";
import { initConfirmarFechamento } from "./confirmar-fechamento.js";
import { getBaseUrl } from "./API_JS/api.js";
import { pushModal, popModal } from "./assets/modalstack.js";

let ordemProducao = null;
let insumosBanco = [];
const cacheNomes = new Map();

const setOrdemProducao = (op) => {
    ordemProducao = op;
};
export const getOrdemProducao = () => ordemProducao;

export const setInsumosBanco = (insumos) => {
    insumosBanco = insumos;
};
export const getInsumosBanco = () => insumosBanco;

document.addEventListener("click", handleClick);

async function handleClick(e) {
    const botao = e.target.closest(".btn-verop");
    if (botao) abrirModal(botao.dataset.id);
    if (e.target.closest(".ver-modal-close")) fecharModal();
    if (e.target.closest(".fecharOP")) initConfirmarFechamento();
}

const url = getBaseUrl();

export async function abrirModal(id) {
    try {
        const [response] = await Promise.all([
            fetch(`${url}/modal-ordem`),
            resgataOPCompletaBanco(id),
        ]);

        const data = await response.text();
        document.body.insertAdjacentHTML("beforeend", data);
        await insereDetalhesNaTela();
        
        const modal = document.querySelector("#detailsModal");
        modal.classList.add("load");
        pushModal(modal);

        ordemAbertah();
    } catch (error) {
        console.error("Erro ao abrir modal:", error);
        mostrarToast("Erro ao abrir modal", "erro");
        throw error;
    }
}

function ordemAbertah() {
    const btnEditar = document.querySelector(".editar");
    const btnFecharOP = document.querySelector(".fecharOP");
    const op = getOrdemProducao();

    if (!btnEditar || !btnFecharOP) return;
    if (!!op.datae) {
        btnEditar.remove();
        btnFecharOP.remove();
    }
}

export function fecharModal() {
    popModal();
}

async function resgataOPCompletaBanco(id) {
    try {
        const busca = await window.api.get(`/ordemdeproducao/detalhes/${id}`);
        setInsumosBanco(busca.opinS);
        setOrdemProducao(busca.op);
    } catch (error) {
        console.log(`Erro ao buscar OP: ${error}`);
        mostrarToast("Erro ao buscar OP", "erro");
        throw error;
    }
}

export async function retornaNomeProduto(id) {
    if (cacheNomes.has(id)) return cacheNomes.get(id);
    const promise = window.api.get(`/produtos/${id}`).then((p) => {
        cacheNomes.set(id, p.nome);
        return p.nome;
    });
    cacheNomes.set(id, promise);
    return promise;
}

async function insereInsumosTabela() {
    const tabelaDOM = document.querySelector(".tabelaInsumos");
    if (!tabelaDOM) return;

    const fragment = document.createDocumentFragment();

    getInsumosBanco().forEach((insumo) => {
        const custou = parseFloat(insumo.custouOPIN);
        const custot = parseFloat(insumo.custotOPIN);
        const artigo = insumo.umOPIN === "UN" ? "a" : "o";
        const custoUnitLabel = !isNaN(custou) && custou > 0
            ? `${custou.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} ${artigo} ${insumo.umOPIN}`
            : null;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
              <div class="detalhes-insumo-card">
                <div>
                  <p class="detalhes-insumo-nome">${insumo.nome_insumo}</p>
                  <p class="detalhes-insumo-qtd">${insumo.qtdOPIN} ${insumo.umOPIN}</p>
                </div>
                <div class="detalhes-insumo-valores">
                  <p class="detalhes-insumo-valor">
                    ${custot.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                  ${custoUnitLabel ? `<p class="detalhes-insumo-custo-unit">${custoUnitLabel}</p>` : ""}
                </div>
              </div>
            </td>
        `;
        fragment.appendChild(tr);
    });

    tabelaDOM.appendChild(fragment);
}

async function insereDetalhesNaTela() {
    const op = getOrdemProducao();
    const campoNome = document.querySelector("#nomeProd");
    const campoQuant = document.querySelector("#quantProd");
    const campoCustou = document.querySelector("#custou");
    const campoQuebra = document.querySelector("#quebraProd");
    const campoQuante = document.querySelector("#quanteProd");
    const campoCustoR = document.querySelector("#custour");
    const campoCustot = document.querySelector("#custot");
    const labelCustou = document.querySelector("#labelcustou");
    const labelQtd = document.querySelector("#labelquantProd");
    const noneds = document.querySelectorAll(".noned");
    const campoIdOP = document.querySelector("#modal-idOP");

    if (campoIdOP) campoIdOP.textContent = op.idOP;

    if (!op || !campoNome || !campoQuant) return;

    if (op.status === "fechada") {
        campoCustoR.textContent = `${parseFloat(op.custour).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL",
            },
        )}`;
        campoQuante.textContent = `${parseInt(op.qtdeOP).toLocaleString("pt-BR")}`;
        campoQuebra.textContent = `${parseFloat(op.quebra)}%`;
        noneds.forEach((noned) => (noned.style.display = "flex"));
    } else {
        noneds.forEach((noned) => (noned.style.display = "none"));
    }

    

    campoNome.textContent = op.nome_produto || "Sem Nome";
    campoQuant.textContent = parseInt(op.qtdOP).toLocaleString("pt-BR");
    campoCustou.textContent = parseFloat(op.custou).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
    campoCustot.textContent = parseFloat(op.custot).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
    await insereInsumosTabela();
}
