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
    organizaCardsTopo,
    atualizaCardsTopo,
} from "./renderizacao.js";
import { salvaAlteracoes } from "./persistencia.js";
import { insereDadosOPAtualizados } from "./persistencia.js";
import { deletarInsumoDOM, criaNovoInsumoDOM } from "./dom.js";
import { formatarMoeda, converterMoedaParaNumero } from "../assets/mascaras.js";
import { getOrdemProducao } from "../modalOrdemDeProducao.js";
// EVENTOS

document.addEventListener("click", handleClick);
document.addEventListener("change", handleChange);
document.addEventListener("input", (e) => {
    if (document.activeElement.classList.contains("preco")) {
        let valor = e.target.value.replace(/\D/g, "");
        valor = (Number(valor) / 100).toFixed(2);
        const campoPreco = e.target;
        campoPreco.value = formatarMoeda(valor);

        atualizaCardsTopo();
    }
    if (e.target.id === "precoNovoInsumo") {
        let valor = e.target.value.replace(/\D/g, "");
        valor = (Number(valor) / 100).toFixed(2);
        const campoPreco = e.target;
        campoPreco.value = formatarMoeda(valor);
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
    // Botao editar: fecha o modal de detalhes e abre o modal de edicao
    if (e.target.closest(".editar")) {
        colocaBlur();
        const { initTelaCarregamento, removeTelaCarregamento } = await import("../telacarregamento.js");
       
        await fechaModalDetalhes();
        await initTelaCarregamento();
        await abreModal();
        removeTelaCarregamento();
    }

    // Botao fechar (X): fecha o modal de edicao e remove o blur
    if (e.target.closest(".close-btn")) {
        fechaModal();
        removeBlur();
    }

    // Botao cancelar: fecha o modal de edicao e reabre o modal de detalhes
    if (e.target.closest(".cancel")) {
        const op = getOrdemProducao();
        await fechaModal();
        setTimeout(() => {
            abreModalDetalhes(op.idOP);
        }, 50);
    }

    // Botao salvar: coleta os dados atualizados e persiste no banco
    if (e.target.closest(".save")) {
        insereDadosOPAtualizados();
        salvaAlteracoes();
    }

    // Botao deletar insumo: remove o insumo da OP e recarrega a lista na tela
    if (e.target.closest(".icone-remover, .delete")) {
        const idOPIN = e.target.closest(".icone-remover")?.id;
        console.log("ID do insumo a ser deletado:", idOPIN);
        if (!idOPIN) return;
        deletarInsumoDOM(idOPIN);
        limpaDivInsumos();
        limpaSelectInsumos();
        await organizaDadosTela();
        atualizaCardsTopo();
    }

    // Botao adicionar: adiciona novo insumo na OP
    if (e.target.closest(".add")) {
        criaNovoInsumoDOM();
        atualizaCardsTopo();
    }
}

function handleChange(e) {
    // Checkbox que controla se o novo insumo requer fornecedor
    if (e.target.closest("#novoInsumo")) {
        const insumoId = e.target.closest("#novoInsumo").value;
        defineDisplayBoxForNovoInsumo(parseInt(insumoId));
    }
}
