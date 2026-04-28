import { mostrarToast } from "./toast/toast.js";
import { getCookie } from "./API_JS/api.js";

// ─── ESTADO ───────────────────────────────────────────────────────────────────

let opsSelecionadas = new Set();

// ─── INICIALIZAÇÃO ────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
    renderizarBarraSelecao();
});

document.addEventListener("click", handleClickGuias);
document.addEventListener("change", handleChangeGuias);

// ─── HANDLERS ─────────────────────────────────────────────────────────────────

function handleClickGuias(e) {
    if (e.target.closest(".btn-imprimir-guias")) {
        iniciarImpressao();
    }
    if (e.target.closest(".btn-cancelar-selecao")) {
        cancelarSelecao();
    }
    if (e.target.closest(".btn-selecionar-todas")) {
        selecionarTodasVisiveis();
    }
}

function handleChangeGuias(e) {
    const checkbox = e.target.closest(".checkbox-op");
    if (checkbox) {
        const opId = checkbox.dataset.id;
        if (checkbox.checked) {
            opsSelecionadas.add(opId);
        } else {
            opsSelecionadas.delete(opId);
        }
        atualizarBarraSelecao();
    }
}

function selecionarTodasVisiveis() {
    document.querySelectorAll(".checkbox-op").forEach((cb) => {
        cb.checked = true;
        opsSelecionadas.add(cb.dataset.id);
    });
    atualizarBarraSelecao();
}

// ─── BARRA DE SELEÇÃO ─────────────────────────────────────────────────────────

function posicionarBarra(barra) {
    const principal = document.querySelector(".principal");
    if (!principal || !barra) return;
    const rect = principal.getBoundingClientRect();
    barra.style.left  = `${rect.left + 16}px`;
    barra.style.right = `16px`;
}

function renderizarBarraSelecao() {
    if (document.querySelector(".barra-selecao-guias")) return;

    const barra = document.createElement("div");
    barra.className = "barra-selecao-guias oculta";
    barra.innerHTML = `
        <span class="barra-selecao-texto">
            <span class="material-symbols-outlined" style="font-size:18px;">checklist</span>
            <span class="barra-selecao-contagem">0 OPs selecionadas</span>
        </span>
        <div class="barra-selecao-acoes">
            <button class="btn-cancelar-selecao">Cancelar</button>
            <button class="btn-selecionar-todas">Selecionar todas</button>
            <button class="btn-imprimir-guias">
                <span class="material-symbols-outlined" style="font-size:18px;">print</span>
                Imprimir Guias
            </button>
        </div>
    `;

    const cabecalho = document.querySelector(".cabecalho-principal");
    if (cabecalho) cabecalho.insertAdjacentElement("afterend", barra);

    posicionarBarra(barra);

    window.addEventListener("resize", () => posicionarBarra(barra));
}

function atualizarBarraSelecao() {
    const barra    = document.querySelector(".barra-selecao-guias");
    const contagem = document.querySelector(".barra-selecao-contagem");
    if (!barra || !contagem) return;

    const total = opsSelecionadas.size;
    contagem.textContent = `${total} ${total === 1 ? "OP selecionada" : "OPs selecionadas"}`;

    const visivel = total > 0;
    barra.classList.toggle("oculta", !visivel);

    posicionarBarra(barra);
}

function cancelarSelecao() {
    opsSelecionadas.clear();

    document.querySelectorAll(".checkbox-op").forEach((cb) => {
        cb.checked = false;
    });

    atualizarBarraSelecao();
}

// ─── ADICIONAR CHECKBOX AOS CARDS ─────────────────────────────────────────────

export function adicionarCheckboxAoCard(card, opId) {
    const header = card.querySelector(".card-ordem-header");
    if (!header || header.querySelector(".checkbox-op")) return;

    const wrapper = document.createElement("label");
    wrapper.className = "checkbox-op-wrapper";
    wrapper.title = "Selecionar para imprimir guia";
    wrapper.innerHTML = `
        <input type="checkbox" class="checkbox-op" data-id="${opId}">
        <span class="checkbox-op-box"></span>
    `;

    header.insertBefore(wrapper, header.firstChild);
}

// ─── IMPRESSÃO ────────────────────────────────────────────────────────────────

async function iniciarImpressao() {
    if (opsSelecionadas.size === 0) {
        mostrarToast("Selecione ao menos uma ordem de produção");
        return;
    }

    const token = decodeURIComponent(getCookie("token") ?? "");

    if (!token) {
        mostrarToast("Sessão expirada, faça login novamente");
        return;
    }

    const ops = [...opsSelecionadas].join(",");
    const url = `/api/ordemdeproducao/guias/imprimir?ops=${ops}&token=${encodeURIComponent(token)}`;

    window.open(url, "_blank", "noopener,noreferrer");
}