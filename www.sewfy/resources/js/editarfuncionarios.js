import { mostrarToast } from "./toast/toast.js";
import { aplicarMascaraTelefone, mascaraTelefone } from "../js/assets/mascaras.js";

// ─── BUSCA E PREENCHE ─────────────────────────────────────────────────────────

export async function carregarDadosFuncionarioExterno() {
    await carregarDadosFuncionario();
}

async function carregarDadosFuncionario() {
    try {
        const response = await window.api.get(`/empresa-usuario/${window.funcionarioAtualId}`);
        preencherModal(response);
    } catch (erro) {
        console.error(erro);
        mostrarToast(erro.message || "Erro ao carregar funcionário", "erro");
    }
}

function preencherModal(funcionario) {
    document.getElementById("edit-nome").value     = funcionario.nome ?? "";
    document.getElementById("edit-telefone").value = mascaraTelefone(funcionario.telefone ?? "");

    const campoEmail = document.getElementById("edit-email");
    if (campoEmail) {
        campoEmail.value = funcionario.email ?? "";
        campoEmail.setAttribute("readonly", true);
        campoEmail.style.opacity = "0.6";
        campoEmail.style.cursor  = "not-allowed";
    }

    atualizarToggle(funcionario.ativo);

    const modulos        = Array.from(funcionario.modulos ?? []);
    const modulosEmpresa = Array.from(funcionario.modulosEmpresa ?? []);

    document.querySelectorAll(".modulo-check").forEach((cb) => {
        cb.checked = modulos.includes(cb.dataset.modulo);

        // Esconde módulos que a empresa não tem acesso
        const item = cb.closest(".modulo-item");
        if (modulosEmpresa.length > 0 && !modulosEmpresa.includes(cb.dataset.modulo)) {
            if (item) item.style.display = "none";
        } else {
            if (item) item.style.display = "";
        }
    });

    aplicarMascaraTelefone(document.getElementById("edit-telefone"));
    iniciarEventos();
}

// ─── TOGGLE ───────────────────────────────────────────────────────────────────

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

function iniciarEventos() {
    document.getElementById("toggle-ativo")?.addEventListener("click", () => {
        const btn = document.getElementById("toggle-ativo");
        atualizarToggle(btn.dataset.ativo !== "true");
    });

    document.getElementById("btn-salvar-funcionario")?.addEventListener("click", salvarFuncionario);
    document.getElementById("btn-cancelar-editar")?.addEventListener("click", fecharModal);
    document.getElementById("btn-fechar-editar")?.addEventListener("click", fecharModal);
}

// ─── SALVAR ───────────────────────────────────────────────────────────────────

async function salvarFuncionario() {
    const nome     = document.getElementById("edit-nome").value.trim();
    const telefone = document.getElementById("edit-telefone").value.trim().replace(/\D/g, "");
    const email    = document.getElementById("edit-email").value.trim();
    const ativo    = document.getElementById("toggle-ativo").dataset.ativo === "true";

    const modulos = [];
    document.querySelectorAll(".modulo-check:checked").forEach((cb) => {
        modulos.push(cb.dataset.modulo);
    });

    if (!nome || !telefone || !email) {
        mostrarToast("Preencha todos os campos obrigatórios", "erro");
        return;
    }
    if (nome.length < 4 || nome.length > 45) {
        mostrarToast("Nome inválido", "erro");
        return;
    }
    if (telefone.length < 10 || telefone.length > 11) {
        mostrarToast("Telefone inválido", "erro");
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mostrarToast("E-mail inválido", "erro");
        return;
    }

    try {
        const response = await window.api.put(
            `/empresa-usuario/${window.funcionarioAtualId}`,
            { nome, telefone, email, ativo, modulos }
        );
        mostrarToast(response.mensagem || "Funcionário atualizado com sucesso", "sucesso");
        fecharModal();
        window.atualizarListaFuncionarios?.();
    } catch (erro) {
        console.error(erro);
        mostrarToast(erro.message || "Erro ao salvar funcionário", "erro");
    }
}

// ─── FECHAR ───────────────────────────────────────────────────────────────────

function fecharModal() {
    document.querySelector("#modal-editar-funcionario")?.remove();
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────

export async function carregaJsCssEditarFuncionario() {
    document.querySelector("#css-editar-funcionario")?.remove();

    await new Promise((resolve) => {
        const link  = document.createElement("link");
        link.id     = "css-editar-funcionario";
        link.rel    = "stylesheet";
        link.href   = "http://localhost:5173/resources/css/editarfuncionarios.css";
        link.onload = resolve;
        link.onerror = resolve;
        document.head.appendChild(link);
    });
}

export function retiraCssJsEditarFuncionario() {
    document.querySelector("#css-editar-funcionario")?.remove();
    document.querySelector("#js-editar-funcionario")?.remove();
}