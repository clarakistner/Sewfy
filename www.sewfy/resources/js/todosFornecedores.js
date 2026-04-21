import { mostrarToast } from "./toast/toast.js";
import { mascaraTelefone } from "../js/assets/mascaras.js";


import "../js/menu.js";
import "../js/configmenu.js";
import "../js/cadastroFornecedores.js";
import "../js/visualizarFornecedor.js";
import "../js/API_JS/api.js";

if (!window.api) {
    window.api = new API();
}

document.addEventListener("DOMContentLoaded", () => {
    carregarFornecedores();
    inicializarPesquisa();
});


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
    const tbody = document.getElementById("fornecedores-table");

    if (!tbody) {
        console.warn("[WARN] Tabela de fornecedores não encontrada");
        return;
    }

    tbody.innerHTML = `
        <tr>
            <td colspan="3" class="mensagem-vazia">Carregando...</td>
        </tr>
    `;

    try {
        const fornecedores = await window.api.get("/clifor/todos");
        renderizarTabela(fornecedores);
    } catch (erro) {
        console.error("[ERRO] Falha ao carregar fornecedores:", erro);
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="mensagem-vazia">Erro ao carregar fornecedores</td>
            </tr>
        `;
        mostrarToast(erro.message, "erro");
    }
}

// PESQUISAR
async function pesquisarFornecedores(termo) {
    const tbody = document.getElementById("fornecedores-table");

    try {
        const fornecedores = await window.api.get(
            `/clifor/todos?search=${encodeURIComponent(termo)}`
        );
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
                <td colspan="3" class="mensagem-vazia">Nenhum fornecedor encontrado</td>
            </tr>
        `;
        return;
    }

     const fornecedoresOrdenados = [...fornecedores].sort((a, b) => {
        return Number(b.ativo) - Number(a.ativo);
    });

    fornecedoresOrdenados.forEach(fornecedor => {
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
                    data-nome="${fornecedor.nome}"
                    data-ativo="${fornecedor.ativo}"
                    data-cpfcnpj="${fornecedor.cpfCnpj ?? ''}"
                    data-telefone="${fornecedor.telefone ?? ''}"
                    data-endereco="${fornecedor.endereco ?? ''}">
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
    carregarFornecedores();
};