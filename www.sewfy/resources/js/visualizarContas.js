import { mostrarToast } from './toast/toast.js';
import { formatarData, formatarMoeda, mascaraTelefone } from '../js/assets/mascaras.js';

import { getCookie, setCookie, deleteCookie, popCookie } from './API_JS/api.js';
import { getBaseUrl } from './API_JS/api.js';
// PRÉ-CARREGA O HTML DO MODAL
let modalHTMLCache = null;

async function carregarModalHTML() {

    const urlBase = getBaseUrl() || window.BASE_URL;
    console.log('[MODAL] urlBase:', urlBase);
    if (modalHTMLCache) return modalHTMLCache;
    modalHTMLCache = await fetch(`${urlBase}/visualizar-conta`)
        .then(res => res.text());
    return modalHTMLCache;
}

document.addEventListener("DOMContentLoaded", () => {
    carregarModalHTML();
});

// ABRIR MODAL
document.addEventListener("click", async (e) => {
    const botao = e.target.closest(".botao-visualizar-conta");
    if (!botao) return;

    try {
        const modalHTML = await carregarModalHTML();
        document.body.insertAdjacentHTML("afterbegin", modalHTML);

        const d = botao.dataset;

        document.getElementById("modal-fornecedor").textContent = d.fornecedor;
        document.getElementById("modal-status").textContent     = d.status === 'pago' ? 'Pago' : 'Pendente';
        document.getElementById("modal-valor").textContent      = formatarMoeda(d.valor);
        document.getElementById("modal-vencimento").textContent = formatarData(d.vencimento);
        document.getElementById("modal-pagamento").textContent  = formatarData(d.pagamento || null);
        document.getElementById("modal-telefone").textContent   = d.telefone ? mascaraTelefone(d.telefone) : '';
        document.getElementById("modal-op").textContent         = d.op || '';

    } catch (erro) {
        console.error("[ERRO]", erro);
        mostrarToast("Erro ao carregar conta", "erro");
    }
});

// FECHAR MODAL
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-fecha")) {
        document.querySelector("#conta-modal")?.remove();
    }
});

// BOTÃO EDITAR / SALVAR
document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-submit");
    if (!btn) return;

    if (btn.dataset.modo === "salvar") {
        salvarConta();
    } else {
        ativarModoEdicao();
    }
});

function ativarModoEdicao() {
    const camposEditaveis = ["dataVencimento", "dataPagamento"];

    document.querySelectorAll("#conta-modal .value").forEach(span => {
        const field = span.dataset.field;
        if (!camposEditaveis.includes(field)) return;

        const el = document.createElement("input");
        el.type = "date";
        el.classList.add("input-edicao");
        el.dataset.field = field;
        el.id = span.id;
        el.dataset.valorOriginal = span.textContent.trim();

        const partes = span.textContent.trim().split("/");
        if (partes.length === 3) {
            el.value = `${partes[2]}-${partes[1]}-${partes[0]}`;
        }

        span.replaceWith(el);
    });

    const btn = document.querySelector("#conta-modal .btn-submit");
    btn.textContent = "Salvar alterações";
    btn.dataset.modo = "salvar";
}

async function salvarConta() {
    const inputs = document.querySelectorAll("#conta-modal .input-edicao");

    for (const input of inputs) {
        if (!input.value) {
            mostrarToast("Preencha todas as datas antes de salvar", "erro");
            return;
        }
    }

    // TODO: chamar API para salvar quando o endpoint estiver pronto

    inputs.forEach(input => {
        const span = document.createElement("span");
        span.classList.add("value");
        span.dataset.field = input.dataset.field;
        span.id = input.id;

        const partes = input.value.split("-");
        span.textContent = partes.length === 3
            ? `${partes[2]}/${partes[1]}/${partes[0]}`
            : input.dataset.valorOriginal;

        input.replaceWith(span);
    });

    const btn = document.querySelector("#conta-modal .btn-submit");
    btn.textContent = "Editar Conta";
    btn.dataset.modo = "editar";

    mostrarToast("Alterações salvas com sucesso!", "sucesso");
}