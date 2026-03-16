import { mostrarToast } from "../../toast/toast.js";

document.addEventListener("DOMContentLoaded", () => {
    carregarProdutos();
    inicializarPesquisa();
});

// BUSCA / PESQUISA
function inicializarPesquisa() {
    const inputPesquisa = document.querySelector(".input-pesquisa input");
    const selectTipo    = document.querySelector(".box-filtro select");

    if (!inputPesquisa || !selectTipo) {
        console.warn("[WARN] Campo de pesquisa ou filtro não encontrado");
        return;
    }

    let timeout = null;

    function executarBusca() {
        const termo = inputPesquisa.value.trim();
        const tipo  = selectTipo.value;

        if (termo === "" && tipo === "") {
            carregarProdutos();
            return;
        }

        pesquisarProdutos(termo, tipo);
    }

    inputPesquisa.addEventListener("input", () => {
        clearTimeout(timeout);
        timeout = setTimeout(executarBusca, 300);
    });

    selectTipo.addEventListener("change", executarBusca);
}

// LISTAR TODOS
async function carregarProdutos() {
    const tbody = document.getElementById("products-table");

    if (!tbody) {
        console.warn("[WARN] Tabela de produtos não encontrada");
        return;
    }

    tbody.innerHTML = `
        <tr>
            <td colspan="5" class="mensagem-vazia">Carregando...</td>
        </tr>
    `;

    try {
        const produtos = await window.api.get("/produtos/todos");
        renderizarTabela(produtos);
    } catch (erro) {
        console.error("[ERRO] Falha ao carregar produtos:", erro);
        tbody.innerHTML = `
            <tr>
                <td class="mensagem-vazia" colspan="5">Erro ao carregar produtos</td>
            </tr>
        `;
        mostrarToast("Erro ao carregar produtos", "erro");
    }
}

// PESQUISAR
async function pesquisarProdutos(termo, tipo) {
    const tbody = document.getElementById("products-table");

    tbody.innerHTML = `
        <tr>
            <td colspan="5" class="mensagem-vazia">Carregando...</td>
        </tr>
    `;

    try {
        const params = new URLSearchParams();
        if (termo) params.append("termo", termo);
        if (tipo)  params.append("tipo", tipo);

        const produtos = await window.api.get(`/produtos/todos?${params.toString()}`);
        renderizarTabela(produtos);
    } catch (erro) {
        console.error("[ERRO BUSCA]", erro);
        mostrarToast("Erro ao pesquisar produtos", "erro");
    }
}

// RENDERIZAÇÃO
function renderizarTabela(produtos) {
    const tbody = document.getElementById("products-table");
    tbody.innerHTML = "";

    if (!Array.isArray(produtos) || !produtos.length) {
        tbody.innerHTML = `
            <tr class="linha-vazia">
                <td colspan="5" class="mensagem-vazia">Nenhum produto encontrado</td>
            </tr>
        `;
        return;
    }

    produtos.forEach(produto => {
        const tr = document.createElement("tr");
        tr.classList.add("table-row");

        if (Number(produto.ativo) === 0) {
            tr.classList.add("produto-inativo");
        }

        const badgeClass = {
            'insumo':          'badge-insumo',
            'produto acabado': 'badge-produto',
            'conjunto':        'badge-conjunto'
        }[produto.tipo] ?? 'badge-insumo';

        tr.innerHTML = `
            <td class="table-cell cod">${produto.cod}</td>
            <td class="table-cell">${produto.nome}</td>
            <td class="table-cell">
                <span class="${badgeClass}">${produto.tipo}</span>
            </td>
            <td class="table-cell">${produto.um}</td>
            <td class="table-cell">
                <button type="button" class="botao-visualizar-produto"
                    data-id="${produto.id}"
                    data-cod="${produto.cod}"
                    data-nome="${produto.nome}"
                    data-tipo="${produto.tipo}"
                    data-um="${produto.um}"
                    data-preco="${produto.preco ?? ''}"
                    data-ativo="${produto.ativo}"
                    data-desc="${produto.desc ?? ''}">
                    <span class="material-symbols-outlined icone-visualizar-produto">visibility</span>
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// FUNÇÃO GLOBAL
window.atualizarListaProdutos = () => {
    carregarProdutos();
};