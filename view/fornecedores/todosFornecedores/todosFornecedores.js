import { mostrarToast } from "../../toast/toast.js";
import { mascaraTelefone } from "../../assets/mascaras.js";

console.log("[DEBUG] Script listarFornecedores.js carregado");

document.addEventListener("DOMContentLoaded", () => {
    carregarFornecedores();
    inicializarPesquisa();
});

// PESQUISA
function inicializarPesquisa() {
    const inputPesquisa = document.querySelector(".input-pesquisa input");

    if (!inputPesquisa) {
        console.warn("[WARN] Campo de pesquisa não encontrado");
        return;
    }

    let timeout = null;

    inputPesquisa.addEventListener("input", () => {
        const termo = inputPesquisa.value.trim();

        clearTimeout(timeout);

        timeout = setTimeout(() => {
            if (termo === "") {
                carregarFornecedores();
            } else {
                pesquisarFornecedores(termo);
            }
        }, 300);
    });
}

// LISTAR TODOS
async function carregarFornecedores() {
    console.log("[FETCH] Buscando todos os fornecedores");

    const tbody = document.getElementById("fornecedores-table");

    if (!tbody) {
        console.warn("[WARN] Tabela de fornecedores não encontrada");
        return;
    }

    tbody.innerHTML = `
        <tr>
            <td colspan="3" style="text-align:center;">Carregando...</td>
        </tr>
    `;

    try {
        const response = await fetch("/Sewfy/api/fornecedores");

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.erro || "Erro ao carregar fornecedores");
        }

        const fornecedores = await response.json();
        console.log("[FETCH] Dados recebidos:", fornecedores);

        renderizarTabela(fornecedores);

    } catch (erro) {
        console.error("[ERRO] Falha ao carregar fornecedores:", erro);

        tbody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align:center;">
                    Erro ao carregar fornecedores
                </td>
            </tr>
        `;

        mostrarToast(erro.message, "erro");
    }
}

// PESQUISAR 
async function pesquisarFornecedores(termo) {
    console.log("[BUSCA] Pesquisando por:", termo);

    const tbody = document.getElementById("fornecedores-table");

    try {
        const response = await fetch(
            `/Sewfy/api/fornecedores?search=${encodeURIComponent(termo)}`
        );

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.erro || "Erro na pesquisa");
        }

        const fornecedores = await response.json();

        renderizarTabela(fornecedores);

    } catch (erro) {
        console.error("[ERRO BUSCA]", erro);
        mostrarToast(erro.message, "erro");
    }
}

// RENDERIZAÇÃO DA TABELA
function renderizarTabela(fornecedores) {
    const tbody = document.getElementById("fornecedores-table");
    tbody.innerHTML = "";

    if (!Array.isArray(fornecedores) || fornecedores.length === 0) {
        tbody.innerHTML = `
            <tr class="linha-vazia">
                <td colspan="3" class="mensagem-vazia">
                    Nenhum fornecedor encontrado
                </td>
            </tr>
        `;
        return;
    }

    fornecedores.forEach(fornecedor => {
        const tr = document.createElement("tr");
        tr.classList.add("table-row");

        if (!fornecedor.ativo) {
            tr.classList.add("fornecedor-inativo");
        }

        tr.innerHTML = `
            <td class="table-cell">${fornecedor.nome}</td>
            <td class="table-cell">${mascaraTelefone(fornecedor.telefone)}</td>
            <td class="table-cell">
                <button 
                    class="botao-visualizar-fornecedor"
                    data-id="${fornecedor.id}"
                >
                    <span class="material-symbols-outlined icone-visualizar-fornecedor">
                        visibility
                    </span>
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// FUNÇÃO GLOBAL DE UPDATE
window.atualizarListaFornecedores = () => {
    console.log("[UI] Atualizando lista de fornecedores");
    carregarFornecedores();
};