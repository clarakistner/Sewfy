import { mascaraCpfCnpj, mascaraTelefone, apenasNumeros } from "../assets/mascaras.js";
import { verificarAuth, apiFetch } from "../assets/auth.js";
import { mostrarToast } from "../toast/toast.js";

verificarAuth();

const empId = new URLSearchParams(window.location.search).get("id");

if (!empId) {
    window.location.href = "/www.sewfy/listaempresas/listaempresas.html";
}

document.addEventListener("DOMContentLoaded", async () => {
    await carregarEmpresa();

    document
        .getElementById("btn-salvar-empresa")
        ?.addEventListener("click", salvarEmpresa);

    document
        .querySelector(".modal-close")
        ?.addEventListener("click", fecharModal);

    // CNPJ somente leitura
    const campoCnpj = document.getElementById("cnpj");
    if (campoCnpj) {
        campoCnpj.setAttribute("readonly", true);
        campoCnpj.style.opacity = "0.6";
        campoCnpj.style.cursor  = "not-allowed";
    }

    // Máscara telefone
    const telefoneInput = document.getElementById("telefone");
    if (telefoneInput) mascaraTelefone(telefoneInput);

    const numInput = document.getElementById("num");
    if (numInput) mascaraTelefone(numInput);
});

// =========================================================
// FECHAR / VOLTAR
// =========================================================

function fecharModal() {
    const origem = sessionStorage.getItem("listaEmpresas_origem");
    if (origem) {
        sessionStorage.removeItem("listaEmpresas_origem");
        window.location.href = origem;
    } else {
        window.location.href = "/www.sewfy/listaempresas/listaempresas.html";
    }
}

// =========================================================
// CARREGAR E PREENCHER
// =========================================================

async function carregarEmpresa() {
    try {
        const response = await apiFetch(`/api/adm/empresas/${empId}`, {
            method: "GET"
        });

        if (!response) return;

        if (response.status === 404) {
            mostrarToast("Empresa não encontrada.", "erro");
            desabilitarFormulario();
            return;
        }

        if (!response.ok) throw new Error("Erro ao buscar empresa.");

        const empresa = await response.json();
        preencherFormulario(empresa);

    } catch (error) {
        console.error("Erro ao carregar empresa:", error);
        mostrarToast("Não foi possível carregar os dados da empresa.", "erro");
        desabilitarFormulario();
    }
}

function preencherFormulario(empresa) {
    document.getElementById("cnpj").value         = mascaraCpfCnpj(empresa.cnpj || "");
    document.getElementById("nome").value         = empresa.nome || "";
    document.getElementById("email").value        = empresa.email || "";
    document.getElementById("telefone").value     = mascaraTelefone(empresa.num || "");
    document.getElementById("razao-social").value = empresa.raz || "";
    document.getElementById("status").value       = String(empresa.ativo ?? "1");
    document.getElementById("usuario").value      = empresa.usuarioNome  || "";
    document.getElementById("email-usuario").value = empresa.usuarioEmail || "";
    document.getElementById("num").value          = mascaraTelefone(empresa.usuarioNum || "");
    document.getElementById("email-usuario-confirma").value = empresa.usuarioEmail || "";

    // Marca os módulos ativos — compara pelo MOD_ID (value dos checkboxes)
    const modulosAtivos = Array.isArray(empresa.modulos) ? empresa.modulos.map(m => m.toLowerCase()) : [];
    document.querySelectorAll(".modulos-grid input[type='checkbox']").forEach(cb => {
        const labelTexto = cb.closest("label")?.querySelector("span")?.textContent?.trim().toLowerCase();
        cb.checked = modulosAtivos.includes(labelTexto);
    });
}

// =========================================================
// SALVAR ALTERAÇÕES
// =========================================================

async function salvarEmpresa() {
    const btn = document.getElementById("btn-salvar-empresa");

    const nome     = document.getElementById("nome")?.value.trim();
    const email    = document.getElementById("email")?.value.trim();
    const telefone = document.getElementById("telefone")?.value.trim();
    const razao    = document.getElementById("razao-social")?.value.trim();
    const status   = document.getElementById("status")?.value ?? "1";
    const cnpj     = document.getElementById("cnpj")?.value.trim();

    const usuarioNome  = document.getElementById("usuario")?.value.trim();
    const usuarioEmail = document.getElementById("email-usuario")?.value.trim();
    const usuarioEmailConfirma = document.getElementById("email-usuario-confirma")?.value.trim();
    const usuarioNum   = document.getElementById("num")?.value.trim();

    // Validações
    if (usuarioEmail !== usuarioEmailConfirma) {
        mostrarToast("Os emails do usuário principal não coincidem", "erro");
        return;
    }

    const modulos = Array.from(
        document.querySelectorAll(".modulos-grid input[type='checkbox']:checked")
    ).map(cb => parseInt(cb.value));

    // Validações
    if (!nome || !email || !razao || !telefone) {
        mostrarToast("Preencha todos os campos obrigatórios", "erro");
        return;
    }

    if (modulos.length === 0) {
        mostrarToast("Selecione ao menos um módulo", "erro");
        return;
    }

    if (!usuarioNome || !usuarioEmail || !usuarioEmailConfirma || !usuarioNum) {
        mostrarToast("Preencha todos os campos do usuário principal", "erro");
        return;
    }

    btn.disabled    = true;
    btn.textContent = "Salvando...";

    const toastCarregando = mostrarToast("Salvando alterações...", "carregando");

    try {
        const response = await apiFetch(`/api/adm/empresas/${empId}`, {
            method: "PUT",
            body: JSON.stringify({
                EMP_NOME:      nome,
                EMP_RAZ:       razao,
                EMP_CNPJ:      apenasNumeros(cnpj),
                EMP_EMAIL:     email,
                EMP_NUM:       apenasNumeros(telefone) || null,
                EMP_ATIV:      Number(status),
                modulos:       modulos,
                usuarioNome:   usuarioNome,
                usuarioEmail:  usuarioEmail,
            })
        });

        toastCarregando.remove();

        if (!response) return;

        const data = await response.json();

        if (response.ok) {
            mostrarToast(data.mensagem || "Alterações salvas com sucesso!", "sucesso");
        } else {
            mostrarToast(data.erro || "Erro ao salvar alterações", "erro");
        }

    } catch (error) {
        toastCarregando.remove();
        console.error("Erro ao salvar empresa:", error);
        mostrarToast("Falha na comunicação com o servidor.", "erro");
    } finally {
        btn.disabled    = false;
        btn.textContent = "Salvar Alterações";
    }
}

function desabilitarFormulario() {
    document.querySelectorAll("input, select, button").forEach(el => {
        el.disabled = true;
    });
}