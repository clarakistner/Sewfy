import { mostrarToast } from './toast/toast.js';
import { formatarData, formatarMoeda, mascaraTelefone } from '../js/assets/mascaras.js';
import { getBaseUrl } from './API_JS/api.js';

const urlBase = getBaseUrl() || window.BASE_URL;

let modalHTMLCache = null;
let contaAtualId   = null;

async function carregarModalHTML() {
    if (modalHTMLCache) return modalHTMLCache;
    modalHTMLCache = await fetch(`${urlBase}/visualizar-conta`).then(res => res.text());
    return modalHTMLCache;
}

document.addEventListener("DOMContentLoaded", () => {
    carregarModalHTML();
});

// ── ABRIR MODAL ───────────────────────────────────────────────────────────────
document.addEventListener("click", async (e) => {
    const botao = e.target.closest(".botao-visualizar-conta");
    if (!botao) return;

    try {
        const modalHTML = await carregarModalHTML();
        document.body.insertAdjacentHTML("afterbegin", modalHTML);

        const d = botao.dataset;
        contaAtualId = d.id;

        document.getElementById("modal-fornecedor").textContent = d.fornecedor  ?? '—';
        document.getElementById("modal-status").textContent     = d.status === 'pago' ? 'Pago' : 'Pendente';
        document.getElementById("modal-valor").textContent      = formatarMoeda(d.valor);
        document.getElementById("modal-vencimento").textContent = formatarData(d.vencimento);
        document.getElementById("modal-pagamento").textContent  = formatarData(d.pagamento || null);
        document.getElementById("modal-telefone").textContent   = d.telefone ? mascaraTelefone(d.telefone) : '—';
        document.getElementById("modal-op").textContent         = d.op        ?? '—';

        // ── Esconde o botão de editar se a conta já estiver paga ──
        if (d.status === 'pago') {
            document.querySelector("#conta-modal .btn-submit")?.remove();
        }

    } catch (erro) {
        console.error("[ERRO]", erro);
        mostrarToast("Erro ao carregar conta", "erro");
    }
});

// ── FECHAR MODAL ──────────────────────────────────────────────────────────────
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-fecha")) {
        document.querySelector("#conta-modal")?.remove();
        contaAtualId = null;
    }
});

// ── EDITAR / SALVAR ───────────────────────────────────────────────────────────
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

        const input          = document.createElement("input");
        input.type           = "date";
        input.classList.add("input-edicao");
        input.dataset.field  = field;
        input.id             = span.id;
        input.dataset.valorOriginal = span.textContent.trim();

        // Converte dd/mm/yyyy → yyyy-mm-dd para o input date
        const partes = span.textContent.trim().split("/");
        if (partes.length === 3) {
            input.value = `${partes[2]}-${partes[1]}-${partes[0]}`;
        }

        span.replaceWith(input);
    });

    const btn          = document.querySelector("#conta-modal .btn-submit");
    btn.textContent    = "Salvar alterações";
    btn.dataset.modo   = "salvar";
}

async function salvarConta() {
    if (!contaAtualId) {
        mostrarToast("ID da conta não encontrado", "erro");
        return;
    }

    const inputVencimento = document.querySelector("#conta-modal .input-edicao[data-field='dataVencimento']");
    const inputPagamento  = document.querySelector("#conta-modal .input-edicao[data-field='dataPagamento']");

    if (!inputVencimento?.value) {
        mostrarToast("A data de vencimento é obrigatória", "erro");
        return;
    }

    const toastCarregando = mostrarToast("Salvando...", "carregando");

    try {
        await window.api.put(`/contas-pagar/${contaAtualId}`, {
            vencimento: inputVencimento.value,
            pagamento:  inputPagamento?.value || null,
        });

        toastCarregando.remove();
        mostrarToast("Conta atualizada com sucesso!", "sucesso");

        // Atualiza os spans com os novos valores
        [inputVencimento, inputPagamento].forEach(input => {
            if (!input) return;
            const span           = document.createElement("span");
            span.classList.add("value");
            span.dataset.field   = input.dataset.field;
            span.id              = input.id;

            const partes = input.value?.split("-");
            span.textContent = partes?.length === 3
                ? `${partes[2]}/${partes[1]}/${partes[0]}`
                : input.dataset.valorOriginal ?? '—';

            input.replaceWith(span);
        });

        // Atualiza o status no modal se pagamento foi preenchido
        const statusEl = document.getElementById("modal-status");
        if (statusEl) {
            statusEl.textContent = inputPagamento?.value ? 'Pago' : 'Pendente';
        }

        const btn        = document.querySelector("#conta-modal .btn-submit");
        btn.textContent  = "Editar Conta";
        btn.dataset.modo = "editar";

        // Atualiza a lista de contas se a função existir
        window.atualizarListaContas?.();

    } catch (erro) {
        toastCarregando?.remove();
        console.error("[ERRO]", erro);
        mostrarToast("Erro ao salvar conta", "erro");
    }
}