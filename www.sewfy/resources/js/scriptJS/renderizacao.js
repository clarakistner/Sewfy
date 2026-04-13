import {
    getListaDOM,
    getListaInsumos,
    getListaFornecedores,
    atualizaOPINs,
    getInsumosDeletados,
} from "./estado.js";
import { getOrdemProducao, getInsumosBanco, retornaNomeProduto} from "../modalOrdemDeProducao.js";
import { resgataProdutoPeloID } from "./banco.js";
import { criarInsumo, criaOptionInsumo } from "./dom.js";
import { insereOptionsFornecedores } from "./dom.js";
import { mostrarToast } from "../toast/toast.js";
import { converterMoedaParaNumero, formatarMoeda } from "../assets/mascaras.js";

const PROD_TIPO = {
    INSUMO: "insumo",
    FINAL: "produto acabado",
    CONJUNTO: "conjunto",
};

export async function organizaDadosTela() {
    await Promise.all([
        defineNomeIdDOM(),
        colocaQuatidadeOP(),
        definiDivsInsumos(),
    ]);
    await insereOptionsFornecedores("[data-field='fornecedor']");
    organizaDivNovoInsumo();
}

export function organizaCardsTopo() {
    const listaInsumosInseridos = getListaDOM();
    const op = getOrdemProducao();
    const cardsValor = document.querySelectorAll(".summary-card__value");
    const insumoCount = document.querySelector("#insumosCount");
    if (!cardsValor) return;
    const total = listaInsumosInseridos.size || listaInsumosInseridos.length || 0;
    cardsValor.forEach((card) => {
        switch (card.id) {
            case "cardTotalInsumos":
                card.textContent = total;
                break;
            case "cardQtdProd":
                card.textContent = op.qtdOP;
                break;
            case "cardCustoTotal":
                card.textContent = parseFloat(op.custot).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
                break;
        }
    });
    insumoCount.textContent = `${total} ${total !== 1 ? "itens" : "item"}`;
}

export function atualizaCardsTopo() {
    const cardsValor = document.querySelectorAll(".summary-card__value");
    const insumoCount = document.querySelector("#insumosCount");
    const precos = document.querySelectorAll(".preco");
    let qtds = [...document.querySelectorAll(".qtd")].filter((qtd) => qtd.id !== "qtdOP");
    const totalAtualizado = Array.from(precos).reduce((total, preco, i) => {
        return total + (parseFloat(converterMoedaParaNumero(preco.value)) * parseInt(qtds[i].value));
    }, 0);
    const qtdOP = document.querySelector("#qtdOP");
    const listaInsumosInseridos = getListaDOM();
    const total = listaInsumosInseridos.size || listaInsumosInseridos.length || 0;
    cardsValor.forEach((card) => {
        switch (card.id) {
            case "cardCustoTotal":
                card.textContent = isNaN(totalAtualizado) ? "R$ 0,00" : totalAtualizado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
                break;
            case "cardQtdProd":
                card.textContent = qtdOP.value || 0;
                break;
            case "cardTotalInsumos":
                card.textContent = total;
                break;
        }
    });
    insumoCount.textContent = `${total} ${total !== 1 ? "itens" : "item"}`;
}

async function defineNomeIdDOM() {
    try {
        const campo = document.querySelector("#idNome");
        if (!campo) return;
        const op = getOrdemProducao();
        campo.textContent = `${op.idOP} — ${op.nome_produto}`;
    } catch (error) {
        console.error(`Erro ao busca nome e código da OP: ${error}`);
        mostrarToast("Erro ao busca nome e código da OP", "erro");
    }
}

function colocaQuatidadeOP() {
    try {
        const op = getOrdemProducao();
        const campoQTD = document.querySelector("#qtdOP");
        if (!campoQTD) return;
        campoQTD.value = op.qtdOP;
    } catch (error) {
        console.error(`Erro ao preencher quantidade da OP: ${error}`);
        mostrarToast("Erro ao preencher quantidade da OP", "erro");
    }
}

async function getTipoOP() {
    const op = getOrdemProducao();
    const produto = await resgataProdutoPeloID(op.prodIDOP);
    return produto?.tipo ?? null;
}

async function definiDivsInsumos() {
    try {
        const campoDivs = document.querySelector("#insumosContainer");
        if (!campoDivs) return;
        const insumosOP = getListaDOM();
        atualizaOPINs.length = 0;

        

        const fragment = document.createDocumentFragment();
        insumosOP.forEach((insumo) => {
            atualizaOPINs.push(insumo);
            fragment.appendChild(
                criarInsumo(
                    insumo.idOPIN,
                    insumo.nome_insumo,
                    insumo.qtdOPIN,
                    parseFloat(insumo.custouOPIN),
                    insumo.umOPIN,
                    insumo.forOPIN,
                    insumo.forOPIN != null,
                )
            );
        });
        campoDivs.appendChild(fragment);
    } catch (error) {
        console.error(`Erro ao definir divs de insumos: ${error}`);
        mostrarToast("Erro ao carregar insumos da Ordem de Produção", "erro");
    }
}

export async function organizaDivNovoInsumo() {
    limpaSelectInsumos();
    try {
        const selectInsumo = document.querySelector("#novoInsumo");
        if (!selectInsumo) return;
        const listaDeInsumos = getListaInsumos();
        const listaDOM = getListaDOM();
        const insumosDeletados = getInsumosDeletados();
        const listaProdIds = listaDOM.map((idProd) => idProd.prodIdOPIN);
        const listaDeletados = insumosDeletados.map((idDel) => idDel.prodIdOPIN);

        const tipoOP = await getTipoOP();
        const tipoFiltro = tipoOP === PROD_TIPO.CONJUNTO ? PROD_TIPO.FINAL : PROD_TIPO.INSUMO;

        const fragment = document.createDocumentFragment();
        listaDeInsumos.forEach((insumo) => {
            if (
                insumo.tipo === tipoFiltro &&
                !listaProdIds.includes(insumo.id) &&
                !listaDeletados.includes(insumo.id)
            ) {
                fragment.appendChild(criaOptionInsumo(insumo));
            }
        });
        selectInsumo.appendChild(fragment);
    } catch (error) {
        console.error(`Erro ao organizar div de novo insumo: ${error}`);
        mostrarToast("Erro ao carregar lista de insumos disponíveis", "erro");
    }
}

export function defineDisplayBoxForNovoInsumo(idInsumo) {
    try {
        const boxForNovoInsumo = document.querySelector("#boxForNovoInsumo");
        const selectUN = document.querySelector("#unidadeNovoInsumo");
        const lista = getListaInsumos();
        const insumo = lista.find((insumo) => insumo.id === idInsumo);
        if (!boxForNovoInsumo || !selectUN) return;
        if (!insumo) {
            selectUN.value = "";
            boxForNovoInsumo.style.display = "none";
            const select = document.querySelector("#fornecedorNovoInsumo");
            if (select) select.innerHTML = "";
            return;
        }
        selectUN.value = insumo.um;
        if (insumo.necessita_clifor) {
            boxForNovoInsumo.style.display = "flex";
            insereOptionsFornecedores("#fornecedorNovoInsumo");
        } else {
            boxForNovoInsumo.style.display = "none";
            const select = document.querySelector("#fornecedorNovoInsumo");
            if (select) select.innerHTML = "";
        }
    } catch (error) {
        console.error(`Erro ao definir display do box de fornecedor: ${error}`);
        mostrarToast("Erro ao carregar fornecedores", "erro");
    }
}

export function limpaDivInsumos() {
    const campoDivs = document.querySelector("#insumosContainer");
    if (campoDivs) campoDivs.innerHTML = "";
}

export function limpaSelectInsumos() {
    const campoDivs = document.querySelector("#novoInsumo");
    if (campoDivs) campoDivs.innerHTML = "<option value=''>Insumo</option>";
}