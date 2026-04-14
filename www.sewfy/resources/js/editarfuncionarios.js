import { mostrarToast } from "./toast/toast.js";
import { aplicarMascaraTelefone, mascaraTelefone } from "../js/assets/mascaras.js";

// ─── PREENCHER CAMPOS BÁSICOS (imediato, via dataset do botão) ────────────────
// Chamado antes da requisição, igual ao padrão de produtos que usa data-* do botão

export function preencherCamposBasicos(dataset) {
    document.getElementById("edit-nome").value     = dataset.nome     ?? "";
    document.getElementById("edit-email").value    = dataset.email    ?? "";
    document.getElementById("edit-telefone").value = mascaraTelefone(dataset.telefone ?? "");
    aplicarMascaraTelefone(document.getElementById("edit-telefone"));

    // Email — somente leitura
    const campoEmail = document.getElementById("edit-email");
    if (campoEmail) {
        campoEmail.setAttribute("readonly", true);
        campoEmail.style.opacity = "0.6";
        campoEmail.style.cursor  = "not-allowed";
    }

    atualizarToggle(dataset.ativo === "1" || dataset.ativo === 1);
}

// ─── CARREGAR MÓDULOS VIA API ─────────────────────────────────────────────────
// Chamado logo após preencherCamposBasicos — busca só o que não está no dataset

export async function carregarDadosFuncionarioExterno() {
    try {
        const response = await window.api.get(`/empresa-usuario/${window.funcionarioAtualId}`);
        preencherModulos(response);
        registrarEventos();
    } catch (erro) {
        console.error(erro);
        mostrarToast(erro.message || "Erro ao carregar módulos do funcionário", "erro");
    }
}

// ─── PREENCHER MÓDULOS ────────────────────────────────────────────────────────

function preencherModulos(funcionario) {
    const modulosFuncionario = new Set(funcionario.modulos        ?? []);
    const modulosEmpresa     = new Set(funcionario.modulosEmpresa ?? []);

    document.querySelectorAll(".modulo-check").forEach((cb) => {
        const nomeModulo       = cb.dataset.modulo;
        const empresaTemModulo = modulosEmpresa.size === 0 || modulosEmpresa.has(nomeModulo);
        const item             = cb.closest(".modulo-item");

        // Exibe apenas módulos que a empresa tem — oculta os demais
        if (item) item.style.display = empresaTemModulo ? "" : "none";

        // Marca apenas se a empresa tiver o módulo E o funcionário já tiver acesso
        cb.checked  = empresaTemModulo && modulosFuncionario.has(nomeModulo);
        cb.disabled = !empresaTemModulo;
    });
}

// ─── TOGGLE ATIVO/INATIVO ─────────────────────────────────────────────────────

function atualizarToggle(ativo) {
    const btn   = document.getElementById("toggle-ativo");
    const label = document.getElementById("toggle-label");
    if (!btn || !label) return;

    btn.dataset.ativo = ativo ? "true" : "false";
    btn.classList.toggle("ativo",   ativo);
    btn.classList.toggle("inativo", !ativo);
    label.textContent = ativo ? "Ativo" : "Inativo";
}

// ─── EVENTOS ──────────────────────────────────────────────────────────────────
// cloneNode antes de adicionar listener evita duplicação ao reabrir o modal

function registrarEventos() {
    substituirListener("toggle-ativo", () => {
        const btn = document.getElementById("toggle-ativo");
        atualizarToggle(btn.dataset.ativo !== "true");
    });

    substituirListener("btn-salvar-funcionario", salvarFuncionario);
    substituirListener("btn-cancelar-editar",    fecharModal);
    substituirListener("btn-fechar-editar",      fecharModal);
}

function substituirListener(id, fn) {
    const el = document.getElementById(id);
    if (!el) return;
    const clone = el.cloneNode(true);
    el.replaceWith(clone);
    document.getElementById(id).addEventListener("click", fn);
}

// ─── VALIDAÇÃO ────────────────────────────────────────────────────────────────

function validarCampos(nome, telefone, email) {
    if (!nome || !telefone || !email) {
        mostrarToast("Preencha todos os campos obrigatórios", "erro");
        return false;
    }
    if (nome.length < 4 || nome.length > 45) {
        mostrarToast("Nome inválido — deve ter entre 4 e 45 caracteres", "erro");
        return false;
    }
    if (telefone.length < 10 || telefone.length > 11) {
        mostrarToast("Telefone inválido", "erro");
        return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mostrarToast("E-mail inválido", "erro");
        return false;
    }
    return true;
}

// ─── SALVAR ───────────────────────────────────────────────────────────────────

async function salvarFuncionario() {
    const nome     = document.getElementById("edit-nome").value.trim();
    const telefone = document.getElementById("edit-telefone").value.replace(/\D/g, "");
    const email    = document.getElementById("edit-email").value.trim();
    const ativo    = document.getElementById("toggle-ativo").dataset.ativo === "true";

    const modulos = Array.from(
        document.querySelectorAll(".modulo-check:checked")
    ).map((cb) => cb.dataset.modulo);

    if (!validarCampos(nome, telefone, email)) return;

    const toastCarregando = mostrarToast("Salvando...", "carregando");

    try {
        const response = await window.api.put(
            `/empresa-usuario/${window.funcionarioAtualId}`,
            { nome, telefone, email, ativo, modulos }
        );
        toastCarregando.remove();
        mostrarToast(response.mensagem || "Funcionário atualizado com sucesso", "sucesso");
        fecharModal();
        window.atualizarListaFuncionarios?.();
    } catch (erro) {
        toastCarregando.remove();
        console.error(erro);
        mostrarToast(erro.message || "Erro ao salvar funcionário", "erro");
    }
}

// ─── FECHAR ───────────────────────────────────────────────────────────────────

function fecharModal() {
    document.querySelector("#modal-editar-funcionario")?.remove();
}

// ─── CSS ──────────────────────────────────────────────────────────────────────

export async function carregaJsCssEditarFuncionario() {
    document.querySelector("#css-editar-funcionario")?.remove();

    await new Promise((resolve) => {
        const link   = document.createElement("link");
        link.id      = "css-editar-funcionario";
        link.rel     = "stylesheet";
        link.href    = "http://localhost:5173/resources/css/editarfuncionarios.css";
        link.onload  = resolve;
        link.onerror = resolve;
        document.head.appendChild(link);
    });
}

export function retiraCssJsEditarFuncionario() {
    document.querySelector("#css-editar-funcionario")?.remove();
    document.querySelector("#js-editar-funcionario")?.remove();
}