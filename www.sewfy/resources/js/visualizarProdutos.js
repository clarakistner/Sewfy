import { mostrarToast } from "./toast/toast.js";
import { formatarMoeda, converterMoedaParaNumero } from "../js/assets/mascaras.js";
import { getBaseUrl } from "./API_JS/api.js";


const url = getBaseUrl();
// HELPERS
function exibirTipo(tipo) {
    const mapa = {
        'insumo':          'Insumo',
        'produto acabado': 'Produto Acabado',
        'conjunto':        'Conjunto'
    };
    return mapa[tipo] ?? tipo;
}

function exibirUm(um) {
    const mapa = {
        'UN': 'Unidade',
        'KG': 'Quilograma',
        'MT': 'Metro'
    };
    return mapa[um] ?? um;
}

// PRÉ-CARREGA O HTML DO MODAL
let modalHTMLCache = null;

async function carregarModalHTML() {
    if (modalHTMLCache) return modalHTMLCache;
    modalHTMLCache = await fetch(`${url}/visualizar-produto`)
        .then(res => res.text());
    return modalHTMLCache;
}

document.addEventListener("DOMContentLoaded", () => {
    carregarModalHTML();
});

// ABRIR MODAL
document.addEventListener("click", async (e) => {
    const botao = e.target.closest(".botao-visualizar-produto");
    if (!botao) return;

    window.produtoAtualId = botao.dataset.id;

    try {
        const modalHTML = await carregarModalHTML();
        document.body.insertAdjacentHTML("afterbegin", modalHTML);

        const d = botao.dataset;

        document.getElementById("modal-cod").textContent      = d.cod;
        document.getElementById("modal-tipo").textContent     = exibirTipo(d.tipo);
        document.getElementById("modal-nome").textContent     = d.nome;
        document.getElementById("modal-um").textContent       = exibirUm(d.um);
        document.getElementById("modal-preco").textContent    = d.preco ? formatarMoeda(d.preco) : '';
        document.getElementById("modal-cadastro").textContent = d.ativo === "1" ? "Ativo" : "Inativo";
        document.getElementById("modal-desc").textContent     = d.desc || '';

    } catch (erro) {
        mostrarToast(erro.message || "Erro ao carregar produto", "erro");
    }
});

// ATIVAR EDIÇÃO
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-editar-produto")) {
        ativarModoEdicao();
    }
});

function ativarModoEdicao() {
    document.querySelectorAll(".value").forEach(span => {
        const field = span.dataset.field;
        const valor = span.textContent.trim();
        let el;

        if (field === "ativo") {
            el = document.createElement("select");
            el.innerHTML = `
                <option value="1">Ativo</option>
                <option value="0">Inativo</option>
            `;
            el.value = valor === "Ativo" ? "1" : "0";

        } else if (field === "um") {
            el = document.createElement("select");
            el.innerHTML = `
                <option value="UN">Unidade</option>
                <option value="KG">Quilograma</option>
                <option value="MT">Metro</option>
            `;
            const umReverso = { 'Unidade': 'UN', 'Quilograma': 'KG', 'Metro': 'MT' };
            el.value = umReverso[valor] ?? valor;

        } else if (field === "tipo") {
            el = document.createElement("select");
            el.innerHTML = `
                <option value="insumo">Insumo</option>
                <option value="produto acabado">Produto Acabado</option>
                <option value="conjunto">Conjunto</option>
            `;
            const tipoReverso = { 'Insumo': 'insumo', 'Produto Acabado': 'produto acabado', 'Conjunto': 'conjunto' };
            el.value = tipoReverso[valor] ?? valor.toLowerCase();

        } else if (field === "preco") {
            el = document.createElement("input");
            el.type  = "text";
            el.placeholder = "R$ 0,00";
            el.value = valor;
            el.addEventListener("input", (e) => {
                let v = e.target.value.replace(/\D/g, "");
                v = (Number(v) / 100).toFixed(2);
                e.target.value = formatarMoeda(v);
            });

        } else {
            el = document.createElement("input");
            el.type  = "text";
            el.value = valor;
        }

        el.classList.add("input-edicao");
        el.dataset.field = field;
        el.id = span.id;

        span.replaceWith(el);
    });

    trocarBotaoParaSalvar();
}

function trocarBotaoParaSalvar() {
    const btn = document.querySelector(".btn-editar-produto");
    btn.textContent = "Salvar alterações";
    btn.classList.add("modo-salvar");
    btn.replaceWith(btn.cloneNode(true));
    document.querySelector(".btn-editar-produto")
        .addEventListener("click", salvarProduto);
}

async function salvarProduto() {
    const codInput   = document.querySelector('[data-field="codigo"]');
    const tipoInput  = document.querySelector('[data-field="tipo"]');
    const ativoInput = document.querySelector('[data-field="ativo"]');
    const nomeInput  = document.querySelector('[data-field="nome"]');
    const umInput    = document.querySelector('[data-field="um"]');
    const descInput  = document.querySelector('[data-field="descricao"]');
    const precoInput = document.querySelector('[data-field="preco"]');

    if (!codInput || !tipoInput || !nomeInput || !umInput || !ativoInput) {
        mostrarToast("Erro interno no formulário", "erro");
        return;
    }

    const cod   = codInput.value.trim();
    const tipo  = tipoInput.value;
    const ativo = ativoInput.value === "1" ? 1 : 0;
    const nome  = nomeInput.value.trim();
    const um    = umInput.value;
    const desc  = descInput?.value.trim() ?? null;
    const preco = converterMoedaParaNumero(precoInput?.value.trim());

    if (!cod || !tipo || !nome || !um) {
        mostrarToast("Preencha todos os campos obrigatórios", "erro");
        return;
    }
    if (cod.length < 4 || cod.length > 10) {
        mostrarToast("Código inválido, deve ter entre 4 e 10 caracteres", "erro");
        return;
    }
    if (nome.length < 5 || nome.length > 30) {
        mostrarToast("Nome inválido, deve ter entre 5 e 30 caracteres", "erro");
        return;
    }
    if (desc && desc.length > 60) {
        mostrarToast("Descrição deve ter menos de 60 caracteres", "erro");
        return;
    }

    try {
        await window.api.put(`/produtos/${window.produtoAtualId}`, {
            PROD_COD:   cod,
            PROD_NOME:  nome,
            PROD_TIPO:  tipo,
            PROD_UM:    um,
            PROD_DESC:  desc  || null,
            PROD_PRECO: preco || null,
            PROD_ATIV:  ativo
        });

        atualizarModalComDados({ cod, tipo, nome, um, desc, preco, ativo });
        trocarBotaoParaEditar();
        window.atualizarListaProdutos?.();
        mostrarToast("Produto atualizado com sucesso", "sucesso");

    } catch (e) {
        mostrarToast(e.message || "Erro ao editar produto", "erro");
    }
}

function atualizarModalComDados(dados) {
    document.querySelectorAll(".detail").forEach(detail => {
        const input = detail.querySelector(".input-edicao");
        if (!input) return;

        const span = document.createElement("span");
        span.classList.add("value");
        span.dataset.field = input.dataset.field;
        span.id = input.id;

        if (input.dataset.field === "ativo") {
            span.textContent = input.value === "1" ? "Ativo" : "Inativo";
        } else if (input.dataset.field === "tipo") {
            span.textContent = exibirTipo(input.value);
        } else if (input.dataset.field === "um") {
            span.textContent = exibirUm(input.value);
        } else if (input.dataset.field === "preco") {
            span.textContent = formatarMoeda(converterMoedaParaNumero(input.value));
        } else {
            span.textContent = input.value;
        }

        detail.replaceChild(span, input);
    });
}

function trocarBotaoParaEditar() {
    const btn = document.querySelector(".btn-editar-produto");
    btn.textContent = "Editar Produto";
    btn.classList.remove("modo-salvar");
    btn.replaceWith(btn.cloneNode(true));
    document.querySelector(".btn-editar-produto")
        .addEventListener("click", ativarModoEdicao);
}

// FECHAR MODAL
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-close")) {
        document.querySelector(".produtomodal")?.remove();
    }
});