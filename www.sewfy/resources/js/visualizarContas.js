import { mostrarToast } from './toast/toast.js';
import { formatarData, formatarMoeda, converterMoedaParaNumero, mascaraTelefone } from '../js/assets/mascaras.js';
import { getBaseUrl } from './API_JS/api.js';
import { mostrarModalModo } from './modalModoEdicao.js';
import { abrirModal as abrirModalOP } from './modalOrdemDeProducao.js';
import { pushModal, popModal } from './assets/modalstack.js';

const urlBase = getBaseUrl() || window.BASE_URL;

let modalHTMLCache = null;
let contaAtualId   = null;
let contaAtualDado = null;

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
        document.body.insertAdjacentHTML("beforeend", modalHTML); // ✅

        const d        = botao.dataset;
        contaAtualId   = d.id;
        contaAtualDado = d;

        document.querySelector("#conta-modal").dataset.emissao = d.emissao ?? "";

        document.getElementById("modal-fornecedor").textContent = d.fornecedor ?? '—';
        document.getElementById("modal-telefone").textContent   = d.telefone ? mascaraTelefone(d.telefone) : '—';
        document.getElementById("modal-valor").textContent      = formatarMoeda(d.valor);
        document.getElementById("modal-emissao").textContent    = formatarData(d.emissao    || null);
        document.getElementById("modal-vencimento").textContent = formatarData(d.vencimento || null);
        document.getElementById("modal-pagamento").textContent  = formatarData(d.pagamento  || null);
        document.getElementById("modal-historico").textContent  = d.historico || '';

        const badgeMap = {
            'pendente': '<span class="badge badge-warning">Pendente</span>',
            'atrasada': '<span class="badge badge-danger">Atrasada</span>',
            'paga':     '<span class="badge badge-success">Paga</span>',
        };
        document.getElementById("modal-status").innerHTML = badgeMap[d.status] ?? d.status;

        if (d.op) {
            const opEl      = document.getElementById("modal-op");
            const detalheOp = document.getElementById("detalhe-op");
            opEl.textContent        = d.op;
            detalheOp.style.display = "";
        }

        const temRecorrencia = d.grupo && !d.op;
        if (temRecorrencia) {
            document.getElementById("modal-ocorrencia").textContent     = d.ocorrencia || '';
            document.getElementById("detalhe-ocorrencia").style.display = "";

            if (d.parcelaNum && d.parcelaTot) {
                document.getElementById("modal-parcela").textContent     = `${d.parcelaNum} / ${d.parcelaTot}`;
                document.getElementById("detalhe-parcela").style.display = "";
            }
        }

        if (d.status === 'paga') {
            document.querySelector("#conta-modal .btn-submit")?.remove();
        }

        const modal = document.querySelector("#conta-modal");
        pushModal(modal); 

    } catch (erro) {
        console.error("[ERRO]", erro);
        mostrarToast("Erro ao carregar conta", "erro");
    }
});

// ── CLIQUE NA OP — fecha modal de conta e abre modal da OP ───────────────────
document.addEventListener("click", (e) => {
    const opLink = e.target.closest(".op-link");
    if (!opLink) return;

    const opId = contaAtualDado?.op;
    if (!opId) return;

    abrirModalOP(opId); 
});


// ── FECHAR MODAL ──────────────────────────────────────────────────────────────
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-fecha")) {
        popModal(); 
        contaAtualId   = null;
        contaAtualDado = null;
        modalHTMLCache = null;
    }
});

// ── EDITAR / SALVAR ───────────────────────────────────────────────────────────
document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-submit");
    if (!btn) return;
    if (["btn-modo-esta", "btn-modo-futuras", "btn-fechar-modo"].includes(btn.id)) return;

    if (btn.dataset.modo === "salvar") {
        iniciarFluxoSalvar();
    } else {
        ativarModoEdicao();
    }
});

function ativarModoEdicao() {
    const camposEditaveis = {
        dataVencimento: { tipo: "date" },
        dataPagamento:  { tipo: "date" },
        valor:          { tipo: "text" },
        historico:      { tipo: "text" },
    };

    document.querySelectorAll("#conta-modal .value[data-field]").forEach(span => {
        const field = span.dataset.field;
        if (!camposEditaveis[field]) return;

        const { tipo } = camposEditaveis[field];
        const input    = document.createElement("input");

        input.type                  = tipo;
        input.classList.add("input-edicao");
        input.dataset.field         = field;
        input.id                    = span.id;
        input.dataset.valorOriginal = span.textContent.trim();

        if (tipo === "date") {
            const partes = span.textContent.trim().split("/");
            if (partes.length === 3) {
                input.value = `${partes[2]}-${partes[1]}-${partes[0]}`;
            }
            input.dataset.valorOriginal = input.value;
        } else if (field === "valor") {
            input.value = span.textContent.trim();
            input.addEventListener("input", (e) => {
                let v = e.target.value.replace(/\D/g, "");
                v = (Number(v) / 100).toFixed(2);
                e.target.value = formatarMoeda(v);
            });
        } else if (field === "historico") {
            input.value       = span.textContent.trim();
            input.placeholder = "Adicionar histórico...";
        } else {
            input.value = span.textContent.trim();
        }

        span.replaceWith(input);
    });

    const btn        = document.querySelector("#conta-modal .btn-submit");
    btn.textContent  = "Salvar alterações";
    btn.dataset.modo = "salvar";
}

// ── FLUXO DE SALVAR ───────────────────────────────────────────────────────────
function iniciarFluxoSalvar() {
    if (!contaAtualId) {
        mostrarToast("ID da conta não encontrado", "erro");
        return;
    }

    const inputVencimento = document.querySelector("#conta-modal .input-edicao[data-field='dataVencimento']");
    const inputPagamento  = document.querySelector("#conta-modal .input-edicao[data-field='dataPagamento']");
    const inputValor      = document.querySelector("#conta-modal .input-edicao[data-field='valor']");
    const inputHistorico  = document.querySelector("#conta-modal .input-edicao[data-field='historico']");

    const dataEmissao = document.querySelector("#conta-modal")?.dataset.emissao;
    const hoje        = new Date().toISOString().split("T")[0];

    if (!inputVencimento?.value) {
        mostrarToast("A data de vencimento é obrigatória", "erro");
        return;
    }

    if (inputVencimento?.value && dataEmissao && inputVencimento.value < dataEmissao) {
        mostrarToast("A data de vencimento não pode ser anterior à data de emissão", "erro");
        return;
    }

    if (inputPagamento?.value && dataEmissao && inputPagamento.value < dataEmissao) {
        mostrarToast("A data de pagamento não pode ser anterior à data de emissão", "erro");
        return;
    }

    if (inputPagamento?.value && inputPagamento.value > hoje) {
        mostrarToast("A data de pagamento não pode ser uma data futura", "erro");
        return;
    }

    const grupoId            = contaAtualDado?.grupo;
    const vencimentoOriginal = inputVencimento?.dataset.valorOriginal ?? '';
    const valorOriginal      = inputValor?.dataset.valorOriginal      ?? '';
    const historicoOriginal  = inputHistorico?.dataset.valorOriginal  ?? '';

    const editouPropagavel =
        (inputVencimento && inputVencimento.value !== vencimentoOriginal) ||
        (inputValor      && inputValor.value      !== valorOriginal)      ||
        (inputHistorico  && inputHistorico.value  !== historicoOriginal);

    if (grupoId && editouPropagavel) {
        mostrarModalModo(
            () => salvarConta(inputVencimento, inputPagamento, inputValor, inputHistorico, "esta"),
            () => salvarConta(inputVencimento, inputPagamento, inputValor, inputHistorico, "esta_e_futuras")
        );
    } else {
        salvarConta(inputVencimento, inputPagamento, inputValor, inputHistorico, "esta");
    }
}

// ── SALVAR ────────────────────────────────────────────────────────────────────
async function salvarConta(inputVencimento, inputPagamento, inputValor, inputHistorico, modo) {
    const toastCarregando = mostrarToast("Salvando...", "carregando");

    try {
        await window.api.put(`/contas-pagar/${contaAtualId}`, {
            vencimento: inputVencimento?.value || null,
            pagamento:  inputPagamento?.value  || null,
            valor:      inputValor?.value ? converterMoedaParaNumero(inputValor.value) : null,
            historico:  inputHistorico?.value  || null,
            modo,
        });

        toastCarregando?.remove();
        mostrarToast("Conta atualizada com sucesso!", "sucesso");

        [inputVencimento, inputPagamento].forEach(input => {
            if (!input) return;
            const span         = document.createElement("span");
            span.classList.add("value");
            span.dataset.field = input.dataset.field;
            span.id            = input.id;
            if (input.value) {
                const partes     = input.value.split("-");
                span.textContent = partes.length === 3
                    ? `${partes[2]}/${partes[1]}/${partes[0]}`
                    : '';
            } else {
                span.textContent = '';
            }
            input.replaceWith(span);
        });

        if (inputValor) {
            const span         = document.createElement("span");
            span.classList.add("value", "strong");
            span.dataset.field = "valor";
            span.id            = inputValor.id;
            span.textContent   = inputValor.value || '';
            inputValor.replaceWith(span);
        }

        if (inputHistorico) {
            const span         = document.createElement("span");
            span.classList.add("value");
            span.dataset.field = "historico";
            span.id            = "modal-historico";
            span.textContent   = inputHistorico.value || '';
            inputHistorico.replaceWith(span);
        }

        const statusEl = document.getElementById("modal-status");
        if (statusEl && inputPagamento?.value) {
            statusEl.innerHTML = '<span class="badge badge-success">Paga</span>';
            document.querySelector("#conta-modal .btn-submit")?.remove();
        } else {
            const btn = document.querySelector("#conta-modal .btn-submit");
            if (btn) {
                btn.textContent  = "Editar Conta";
                btn.dataset.modo = "editar";
            }
        }

        window.atualizarListaContas?.();

    } catch (erro) {
        toastCarregando?.remove();
        console.error("[ERRO]", erro);
        mostrarToast("Erro ao salvar conta", "erro");
    }
}