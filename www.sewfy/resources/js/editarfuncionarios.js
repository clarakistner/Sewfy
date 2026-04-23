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
        const [resFuncionario, resEmpresa] = await Promise.all([
            window.api.get(`/empresa-usuario/${window.funcionarioAtualId}`),
            window.api.get("/modulos-usuario")  // mesma rota que o cadastro usa
        ]);

        console.log("Funcionário:", resFuncionario);
        console.log("Módulos empresa:", resEmpresa);

        // Normaliza para o formato que preencherModulos espera
        resFuncionario.modulosEmpresa = resEmpresa.modulos ?? [];

        preencherModulos(resFuncionario);
        registrarEventos();
    } catch (erro) {
        console.error(erro);
        mostrarToast(erro.message || "Erro ao carregar módulos do funcionário", "erro");
    }
}

// ─── PREENCHER MÓDULOS ────────────────────────────────────────────────────────
const modulosLabels = {
    financeiro:  "Financeiro",
    rh:          "Recursos Humanos",
    faturamento: "Faturamento",
    producao:    "Produção",
    relatorios:  "Relatórios",
    compras:     "Compras",
};

function preencherModulos(funcionario) {
    const modulosFuncionario = new Set(funcionario.modulos        ?? []);
    const modulosEmpresa     =         funcionario.modulosEmpresa ?? [];

    const grid = document.getElementById("modulos-grid-editar");
    if (!grid) return;

    grid.innerHTML = "";

    // Renderiza apenas os módulos que a empresa tem acesso
    modulosEmpresa.forEach((nomeModulo) => {
        const label = document.createElement("label");
        label.classList.add("modulo-item");

        const input = document.createElement("input");
        input.type            = "checkbox";
        input.classList.add("modulo-check");
        input.dataset.modulo  = nomeModulo;
        input.checked         = modulosFuncionario.has(nomeModulo);

        const box = document.createElement("span");
        box.classList.add("modulo-box");

        const icon = document.createElement("span");
        icon.classList.add("modulo-check-icon", "material-symbols-outlined");
        icon.textContent = "check";
        box.appendChild(icon);

        const nome = document.createElement("span");
        nome.classList.add("modulo-nome");
        nome.textContent = modulosLabels[nomeModulo] ?? nomeModulo;

        label.append(input, box, nome);
        grid.appendChild(label);
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
    console.log(`substituirListener: buscando #${id} →`, el); // 👈
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

    // Busca o caminho correto via manifesto em produção
    let cssHref = "/resources/css/editarfuncionarios.css";
    const isDev = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (!isDev) {
        try {
            const manifest = await fetch("/build/manifest.json").then(r => r.json());
            const entry = manifest["resources/css/editarfuncionarios.css"];
            if (entry) cssHref = `/build/${entry.file}`;
        } catch (e) {}
    }

    await new Promise((resolve) => {
        const link   = document.createElement("link");
        link.id      = "css-editar-funcionario";
        link.rel     = "stylesheet";
        link.href    = cssHref;
        link.onload  = resolve;
        link.onerror = resolve;
        document.head.appendChild(link);
    });
}

export function retiraCssJsEditarFuncionario() {
    document.querySelector("#css-editar-funcionario")?.remove();
    document.querySelector("#js-editar-funcionario")?.remove();
}
