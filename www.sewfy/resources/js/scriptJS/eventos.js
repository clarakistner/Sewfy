import { abrirModal as abreModalDetalhes } from "../modalOrdemDeProducao.js";
import {
    abreModal,
    fechaModal,
    fechaModalDetalhes,
    colocaBlur,
    removeBlur,
} from "./modal.js";
import {
    organizaDadosTela,
    limpaDivInsumos,
    limpaSelectInsumos,
    defineDisplayBoxForNovoInsumo,
    atualizaCardsTopo,
} from "./renderizacao.js";
import { salvaAlteracoes, insereDadosOPAtualizados } from "./persistencia.js";
import { deletarInsumoDOM, criaNovoInsumoDOM } from "./dom.js";
import { formatarMoeda, converterMoedaParaNumero } from "../assets/mascaras.js";
import { getOrdemProducao } from "../modalOrdemDeProducao.js";
import { initTelaCarregamento, removeTelaCarregamento } from "../telacarregamento.js";

document.addEventListener("click", handleClick);
document.addEventListener("change", handleChange);
document.addEventListener("input", (e) => {
    if (document.activeElement.classList.contains("preco")) {
        let valor = e.target.value.replace(/\D/g, "");
        valor = (Number(valor) / 100).toFixed(2);
        e.target.value = formatarMoeda(valor);
        atualizaCardsTopo();
    }
    if (e.target.id === "precoNovoInsumo") {
        let valor = e.target.value.replace(/\D/g, "");
        valor = (Number(valor) / 100).toFixed(2);
        e.target.value = formatarMoeda(valor);
    }
    if (document.activeElement.classList.contains("qtd")) {
        atualizaCardsTopo();
    }
    if (e.target.id === "qtdOP") {
        atualizaCardsTopo();
    }
    if (e.target.id === "quebraOP") {
        atualizaCardsTopo();
    }
});

async function handleClick(e) {
    if (e.target.closest(".editar")) {
        colocaBlur();
        await fechaModalDetalhes();
        await initTelaCarregamento();
        await abreModal();
        removeTelaCarregamento();
    }

    if (e.target.closest(".close-btn")) {
        fechaModal();
        removeBlur();
    }

    if (e.target.closest(".cancel")) {
        const op = getOrdemProducao();
        await fechaModal();
        setTimeout(() => {
            abreModalDetalhes(op.idOP);
        }, 50);
    }

    if (e.target.closest(".save")) {
        insereDadosOPAtualizados();
        salvaAlteracoes();
    }

    if (e.target.closest(".icone-remover, .delete")) {
        const idOPIN = e.target.closest(".icone-remover")?.id;
        if (!idOPIN) return;
        deletarInsumoDOM(idOPIN);
        limpaDivInsumos();
        limpaSelectInsumos();
        await organizaDadosTela();
        atualizaCardsTopo();
    }

    if (e.target.closest(".add")) {
        criaNovoInsumoDOM();
        atualizaCardsTopo();
    }
}

function handleChange(e) {
    if (e.target.closest("#novoInsumo")) {
        const insumoId = e.target.closest("#novoInsumo").value;
        defineDisplayBoxForNovoInsumo(parseInt(insumoId));
    }
}