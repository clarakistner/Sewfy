import { mostrarToast } from "./toast/toast.js";
import { mascaraTelefone } from "../js/assets/mascaras.js";
import { getCookie } from "./API_JS/api.js";
import "./API_JS/api.js";

const modulosDOM = {
    financeiro:  "Financeiro",
    rh:          "Recursos Humanos",
    faturamento: "Faturamento",
    producao:    "Producao",
    relatorios:  "Relatorios",
    compras:     "Compras",
};

document.addEventListener("input", handleInput);
document.addEventListener("click", handleClick);

document.addEventListener("DOMContentLoaded", async () => {
    await waitForApi();
    await initCadastroFuncionario();
});

function waitForApi() {
    return new Promise((resolve) => {
        if (window.api) return resolve();
        const interval = setInterval(() => {
            if (window.api) {
                clearInterval(interval);
                resolve();
            }
        }, 50);
    });
}

function handleClick(e) {
    if (e.target.closest(".botaoCadastrar")) {
        cadastrarFuncionario();
    }
}

function handleInput(e) {
    if (e.target.id === "telefone") {
        e.target.value = mascaraTelefone(e.target.value);
    }
}

async function cadastrarFuncionario() {
    try {
        const nome           = document.getElementById("nome").value;
        const email          = document.getElementById("email").value;
        const confirmarEmail = document.getElementById("confirmarEmail").value;

        if (email !== confirmarEmail) {
            mostrarToast("Os emails não coincidem!", "erro");
            throw new Error("Emails não coincidem");
        }

        const telefone            = retornaNumerosTelefone(document.getElementById("telefone").value);
        const modulosSelecionados = retornaIdsModulosSelecionados();

        verificaCampos(nome, email, telefone, modulosSelecionados);

        const toastVerificando = mostrarToast("Verificando...", "carregando");
        const resEmpresas      = await window.api.get("/funcionario/owner/empresas");
        toastVerificando.remove();

        const outrasEmpresas = resEmpresas.empresas ?? [];

        if (outrasEmpresas.length === 0) {
            await enviarConvite({ nome, email, telefone, modulosSelecionados, outrasEmpresasSelecionadas: [] });
        } else {
            abrirModalMultiEmpresa(outrasEmpresas, { nome, email, telefone, modulosSelecionados });
        }
    } catch (error) {
        console.error("Erro ao cadastrar funcionário:", error);
    }
}

async function enviarConvite({ nome, email, telefone, modulosSelecionados, outrasEmpresasSelecionadas }) {
    const data = {
        CONV_EMAIL: email,
        CONV_NOME:  nome,
        CONV_NUM:   telefone,
        modulos:    modulosSelecionados,
    };

    if (outrasEmpresasSelecionadas.length > 0) {
        data.outras_empresas = outrasEmpresasSelecionadas;
    }

    const toastCarregando = mostrarToast("Enviando convite...", "carregando");

    try {
        await window.api.post("/convites", data);
        toastCarregando.remove();
        limparFormulario();
        mostrarToast("Convite enviado com sucesso!");
    } catch (error) {
        toastCarregando.remove();
        throw error;
    }
}

// ─── MODAL ───────────────────────────────────────────────────────────────────

async function abrirModalMultiEmpresa(outrasEmpresas, dadosConvite) {
    const toastCarregando = mostrarToast("Carregando empresas...", "carregando");

    const empresasComModulos = await Promise.all(
        outrasEmpresas.map(async (empresa) => {
            const res = await window.api.get(`/empresa/${empresa.EMP_ID}/modulos`);
            return { ...empresa, modulos: res.modulos ?? [] };
        })
    );

    toastCarregando.remove();

    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");

    overlay.innerHTML = `
        <div class="modal-multiempresa">
            <h2 class="modal-titulo">Vincular a outras empresas</h2>
            <p class="modal-subtitulo">
                Você é proprietário de outras empresas. Deseja vincular este funcionário a alguma delas?
            </p>

            ${empresasComModulos.map((empresa) => `
                <div class="modal-empresa-card" data-emp-id="${empresa.EMP_ID}">
                    <div class="modal-empresa-header">
                        <input type="checkbox" class="modal-empresa-checkbox" data-emp-id="${empresa.EMP_ID}" />
                        <span class="modal-empresa-nome">${empresa.EMP_NOME}</span>
                    </div>
                    <div class="modal-modulos-grid desabilitado" data-emp-id="${empresa.EMP_ID}">
                        ${empresa.modulos.map((mod) => `
                            <label class="modulo-item">
                                <input type="checkbox" value="${mod.MOD_ID}" disabled />
                                <span>${modulosDOM[mod.MOD_NOME] ?? mod.MOD_NOME}</span>
                            </label>
                        `).join("")}
                    </div>
                </div>
            `).join("")}

            <div class="modal-botoes">
                <button class="btn-cancelar-modal">Cancelar</button>
                <button class="btn-confirmar-modal">Confirmar e Enviar</button>
            </div>
        </div>
    `;

    overlay.querySelectorAll(".modal-empresa-checkbox").forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            const empId      = checkbox.dataset.empId;
            const modulosDiv = overlay.querySelector(`.modal-modulos-grid[data-emp-id="${empId}"]`);
            const inputs     = modulosDiv.querySelectorAll("input[type=checkbox]");

            if (checkbox.checked) {
                modulosDiv.classList.remove("desabilitado");
                inputs.forEach((cb) => (cb.disabled = false));
            } else {
                modulosDiv.classList.add("desabilitado");
                inputs.forEach((cb) => { cb.disabled = true; cb.checked = false; });
            }
        });
    });

    overlay.querySelector(".btn-cancelar-modal").addEventListener("click", () => {
        overlay.remove();
    });

    overlay.querySelector(".btn-confirmar-modal").addEventListener("click", async () => {
        const outrasEmpresasSelecionadas = [];

        overlay.querySelectorAll(".modal-empresa-checkbox:checked").forEach((checkbox) => {
            const empId  = parseInt(checkbox.dataset.empId);
            const modulos = Array.from(
                overlay.querySelectorAll(`.modal-modulos-grid[data-emp-id="${empId}"] input[type=checkbox]:checked`)
            ).map((cb) => parseInt(cb.value));

            if (modulos.length === 0) {
                mostrarToast(`Selecione ao menos um módulo para ${checkbox.closest(".modal-empresa-card").querySelector(".modal-empresa-nome").textContent}`, "erro");
                return;
            }

            outrasEmpresasSelecionadas.push({ emp_id: empId, modulos });
        });

        const empresasMarcadas = overlay.querySelectorAll(".modal-empresa-checkbox:checked").length;
        if (empresasMarcadas > 0 && outrasEmpresasSelecionadas.length !== empresasMarcadas) return;

        overlay.remove();

        try {
            await enviarConvite({ ...dadosConvite, outrasEmpresasSelecionadas });
        } catch (error) {
            console.error("Erro ao enviar convite multiempresa:", error);
        }
    });

    document.body.appendChild(overlay);
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function retornaNumerosTelefone(telefone) {
    return telefone.replace(/\D/g, "");
}

function verificaCampos(nome, email, telefone, modulosSelecionados) {
    if (!nome || !email || !telefone || [nome, email, telefone].some((v) => v.trim() === "")) {
        mostrarToast("Preencha todos os campos!", "erro");
        throw new Error("Campos obrigatórios não preenchidos");
    }
    if (modulosSelecionados.length === 0) {
        mostrarToast("Selecione pelo menos um módulo!", "erro");
        throw new Error("Nenhum módulo selecionado");
    }
    if (nome.length < 5 || nome.length > 100) {
        mostrarToast("Nome inválido!", "erro");
        throw new Error("Nome inválido");
    }
    if (
        email.length < 5 ||
        email.length > 100 ||
        !email.includes("@") ||
        !email.includes(".") ||
        /[^a-zA-Z0-9@._-]/.test(email)
    ) {
        mostrarToast("Email inválido!", "erro");
        throw new Error("Email inválido");
    }
    if (telefone.length < 10 || telefone.length > 11) {
        mostrarToast("Telefone inválido!", "erro");
        throw new Error("Telefone inválido");
    }
    if (telefone.length === 11 && telefone[2] !== "9") {
        mostrarToast("Telefone inválido!", "erro");
        throw new Error("Telefone inválido");
    }
}

async function criaMapaModulos() {
    try {
        // Usa cache do cookie para evitar requisição ao banco
        const cacheRaw = getCookie("modulos_cache");
        if (cacheRaw) {
            const data = JSON.parse(decodeURIComponent(cacheRaw));
            if (data.modulos && data.idsModulos) {
                return Object.fromEntries(
                    data.modulos.map((modulo, i) => [modulo, data.idsModulos[i]])
                );
            }
        }

        // Fallback: busca no banco se não tiver cache
        const data = await window.api.get("/modulos-usuario");
        return Object.fromEntries(
            data.modulos.map((modulo, i) => [modulo, data.idsModulos[i]])
        );
    } catch (error) {
        console.error("Erro ao criar mapa de módulos:", error);
        throw error;
    }
}

function criaModuloItem(nomeModulo, idModulo) {
    const label = document.createElement("label");
    label.classList.add("modulo-item");

    const checkbox    = document.createElement("input");
    checkbox.type     = "checkbox";
    checkbox.value    = idModulo;

    const span        = document.createElement("span");
    span.textContent  = modulosDOM[nomeModulo] || nomeModulo;

    label.append(checkbox, span);
    return label;
}

async function exibirModulos() {
    try {
        const mapaModulos = await criaMapaModulos();
        const modulosGrid = document.querySelector(".modulos-grid");

        if (!modulosGrid) return;

        modulosGrid.innerHTML = "";

        for (const [nomeModulo, idModulo] of Object.entries(mapaModulos)) {
            modulosGrid.appendChild(criaModuloItem(nomeModulo, idModulo));
        }
    } catch (error) {
        console.error("Erro ao exibir módulos:", error);
        throw error;
    }
}

function retornaIdsModulosSelecionados() {
    const checkboxes = document.querySelectorAll(".modulos-grid input[type=checkbox]");
    return Array.from(checkboxes)
        .filter((cb) => cb.checked)
        .map((cb) => parseInt(cb.value));
}

function limparFormulario() {
    document.getElementById("nome").value          = "";
    document.getElementById("email").value         = "";
    document.getElementById("confirmarEmail").value = "";
    document.getElementById("telefone").value      = "";
    document.querySelectorAll(".modulos-grid input[type=checkbox]")
        .forEach((cb) => (cb.checked = false));
}

export async function initCadastroFuncionario() {
    await exibirModulos();
}