// editarempresa.js
// Carrega os dados da empresa pelo ?id=X, preenche o formulário e salva as alterações.
// Rota GET: /Sewfy/api/adm/empresa?id=X
// Rota PUT: /Sewfy/api/adm/empresa?id=X

import { mascaraCpfCnpj, mascaraTelefone } from "../assets/mascaras.js";
import { mostrarToast } from "../toast/toast.js";

const empId = new URLSearchParams(window.location.search).get("id");

// Redireciona se não houver ID na URL
if (!empId) {
    window.location.href = "/Sewfy/www.sewfy/listaempresas/listaempresas.html";
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
        window.location.href = "/Sewfy/www.sewfy/listaempresas/listaempresas.html";
    }
}

// =========================================================
// CARREGAR E PREENCHER
// =========================================================

async function carregarEmpresa() {
    try {
        const response = await fetch(`/Sewfy/api/adm/empresas/${empId}`, {
            method: "GET",
            credentials: "include",
        });

        if (response.status === 401) {
            window.location.href = "/adm/login.html";
            return;
        }
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
    // Dados da empresa
    document.getElementById("cnpj").value         = mascaraCpfCnpj(empresa.cnpj || "");
    document.getElementById("nome").value         = empresa.nome || "";
    document.getElementById("email").value        = empresa.email || "";
    document.getElementById("telefone").value     = mascaraTelefone(empresa.numero || "");
    document.getElementById("razao-social").value = empresa.razao || "";

    // Status (ativa/inativa) — campo gerado dinamicamente se não existir no HTML
    garantirCampoStatus(Number(empresa.ativo) === 1);

    // Módulos — marca os checkboxes que a empresa possui
    const modulosAtivos = Array.isArray(empresa.modulos) ? empresa.modulos : [];
    document.querySelectorAll(".modulos-grid input[type='checkbox']").forEach(cb => {
        cb.checked = modulosAtivos.includes(cb.value);
    });

    // Usuário principal
    document.getElementById("usuario").value       = empresa.usuarioNome  || "";
    document.getElementById("email-usuario").value = empresa.usuarioEmail || "";
}

/**
 * Garante que exista um campo de status no formulário.
 * Se o HTML não tiver o campo, cria e injeta após a seção de dados.
 */
function garantirCampoStatus(ativa) {
    if (document.getElementById("status")) {
        document.getElementById("status").value = ativa ? "1" : "0";
        return;
    }
}

// =========================================================
// SALVAR ALTERAÇÕES
// =========================================================

async function salvarEmpresa() {
    const btn = document.getElementById("btn-salvar-empresa");

    const nome       = document.getElementById("nome").value.trim();
    const email      = document.getElementById("email").value.trim();
    const telefone   = document.getElementById("telefone").value.trim();
    const razao      = document.getElementById("razao-social").value.trim();
    const status     = document.getElementById("status")?.value ?? "1";

    const modulos = Array.from(
        document.querySelectorAll(".modulos-grid input[type='checkbox']:checked")
    ).map(cb => cb.value);

    const usuarioNome  = document.getElementById("usuario").value.trim();
    const usuarioEmail = document.getElementById("email-usuario").value.trim();

    // --- Validação ---
    const erros = validarFormulario({ nome, email, telefone, razao, modulos, usuarioNome, usuarioEmail });
    if (erros.length > 0) {
        erros.forEach(erro => mostrarToast(erro, "erro"));
        return;
    }

    btn.disabled    = true;
    btn.textContent = "Salvando...";

    try {
        const response = await fetch(`/Sewfy/api/adm/empresa?id=${empId}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nome,
                email,
                telefone,
                razaoSocial: razao,
                ativo: Number(status),
                modulos,
                usuarioNome,
                usuarioEmail,
            }),
        });

        const dados = await response.json();

        if (response.ok) {
            mostrarToast(dados.mensagem ?? "Alterações salvas com sucesso!");
        } else if (dados.erros) {
            dados.erros.forEach(erro => mostrarToast(erro, "erro"));
        } else {
            mostrarToast(dados.erro ?? "Erro inesperado. Tente novamente.", "erro");
        }

    } catch (error) {
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