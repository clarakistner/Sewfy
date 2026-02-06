import { mostrarToast } from "../../toast/toast.js";
import { mascaraTelefone } from "../../assets/mascaras.js";

console.log("[DEBUG] Script listarFornecedores.js carregado");

document.addEventListener("DOMContentLoaded", () => {
    carregarFornecedores();
    inicializarPesquisa();
});


// BUSCA / PESQUISA
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
        const response = await fetch(
            "/Sewfy/controller/fornecedores/ListarFornecedoresController.php"
        );

        if (!response.ok) {
            const msg = await response.text();
            throw new Error(msg);
        }

        const fornecedores = await response.json();
        console.log("[FETCH] Dados recebidos:", fornecedores);

        renderizarTabela(fornecedores);

    } catch (erro) {
        console.error("[ERRO] Falha ao carregar fornecedores:", erro);

        tbody.innerHTML = `
            <tr>
                <td class="mensagem-vazia" colspan="3" style="text-align:center;">
                    Erro ao carregar fornecedores
                </td>
            </tr>
        `;

        mostrarToast("Erro ao carregar fornecedores", "erro");
    }
}



// PESQUISAR
async function pesquisarFornecedores(termo) {
    console.log("[BUSCA] Pesquisando por:", termo);

    const tbody = document.getElementById("fornecedores-table");

    try {
        const response = await fetch(
            `/Sewfy/controller/fornecedores/PesquisarFornecedoresController.php?termo=${encodeURIComponent(termo)}`
        );

        if (!response.ok) {
            const msg = await response.text();
            throw new Error(msg);
        }

        const fornecedores = await response.json();
        renderizarTabela(fornecedores);

    } catch (erro) {
        console.error("[ERRO BUSCA]", erro);
        mostrarToast("Erro ao pesquisar fornecedores", "erro");
    }
}


// RENDERIZAÇÃO
function renderizarTabela(fornecedores) {
    const tbody = document.getElementById("fornecedores-table");
    tbody.innerHTML = "";

    if (!fornecedores.length) {
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

        // só isso
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



// FUNÇÃO GLOBAL
window.atualizarListaFornecedores = () => {
    console.log("[UI] Atualizando lista de fornecedores");
    carregarFornecedores();
};
