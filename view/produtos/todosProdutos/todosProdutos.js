import { mostrarToast } from "../../toast/toast.js";

console.log("[DEBUG] Script todosProdutos.js carregado");

// carrega a lista e a barra de filtros de pesquisa
document.addEventListener("DOMContentLoaded", () => {
    carregarProdutos();
    inicializarPesquisa();
});


// BUSCA / PESQUISA
function inicializarPesquisa() {

    // linka as variaveis com os inputs pelo id
    const inputPesquisa = document.querySelector(".input-pesquisa input");
    const selectTipo = document.querySelector(".box-filtro select");

    // verificação para algum erro na sintaxe do input
    if (!inputPesquisa || !selectTipo) {
        console.warn("[WARN] Campo de pesquisa ou filtro não encontrado");
        return;
    }

    let timeout = null;

    // função para de fato fazer as pesquisas
    function executarBusca() {
        // variaveis que recebem do input da pesquisa e do select do filtro
        const termo = inputPesquisa.value.trim();
        const tipo  = selectTipo.value;

        // exibe no console o que a pessoa pesquisou 
        console.log("[BUSCA] Pesquisando:", { termo, tipo });

        // possibilidade 0, quando termo = nada e tipo = nada
        if (termo === "" && (tipo === "" || tipo === "0")) {
            carregarProdutos();
            return;
        }

        // possibilidades 1, 2 e 3, manda as variáveis para pesquisarProdutos e retorna o resultado
        pesquisarProdutos(termo, tipo);
    }

    // para trocar termo e tipo e entrar na função de novo
    inputPesquisa.addEventListener("input", () => {
        clearTimeout(timeout);
        timeout = setTimeout(executarBusca, 300);
    });

    selectTipo.addEventListener("change", executarBusca);
}



// LISTAR TODOS
async function carregarProdutos() {
    console.log("[FETCH] Buscando todos os produtos");

    const tbody = document.getElementById("products-table");

    // verificação para algum erro na sintaxe do input
    if (!tbody) {
        console.warn("[WARN] Tabela de produtos não encontrada");
        return;
    }

    tbody.innerHTML = `
        <tr>
            <td colspan="5" style="text-align:center;">Carregando...</td>
        </tr>
    `;

    try {

        //faz o fetch com a listagem 
        const response = await fetch(
            "/Sewfy/controller/produtos/ListarProdutosController.php"
        );

        if (!response.ok) {
            const msg = await response.text();
            throw new Error(msg);
        }

        const produtos = await response.json();
        console.log("[FETCH] Dados recebidos:", produtos);

        // renderiza a tabala com os dados
        renderizarTabela(produtos);

    } catch (erro) {
        console.error("[ERRO] Falha ao carregar produtos:", erro);

        // linha com menssagem de erro na tabela
        tbody.innerHTML = `
            <tr>
                <td class="mensagem-vazia" colspan="5">
                    Erro ao carregar produtos
                </td>
            </tr>
        `;

        mostrarToast("Erro ao carregar produtos", "erro");
    }
}



// PESQUISAR
function pesquisarProdutos() {
    // linka as variaveis com os inputs pelo id
    const inputPesquisa = document.querySelector(".input-pesquisa input");
    const selectTipo = document.querySelector(".box-filtro select");
    const termo = inputPesquisa.value.trim();
    const tipo  = selectTipo.value;

    // exibe no console as pesquisas
    console.log("[BUSCA] Pesquisando:", { termo, tipo });

    // fetch para TODAS as outras possibilidades de pesquisa
    fetch(`/Sewfy/controller/produtos/PesquisarProdutosController.php?termo=${encodeURIComponent(termo)}&tipo=${tipo}`)
        .then(res => res.json())
        .then(dados => {
            // exibe no console o resultado da pesquisa e renderiza na tabela os resultados
            console.log("[FETCH] Resultado da pesquisa:", dados);
            renderizarTabela(dados);
        })
        .catch(err => {
            console.error("Erro ao pesquisar produtos:", err);
        });
}


// RENDERIZAÇÃO
function renderizarTabela(produtos) {
    const tbody = document.getElementById("products-table");
    tbody.innerHTML = "";

    // se não existem produtos, a tabela exibe uma linha com mensagem de nenhum produto encontrado
    if (!produtos.length) {
        tbody.innerHTML = `
            <tr class="linha-vazia">
                <td colspan="5" class="mensagem-vazia">
                    Nenhum produto encontrado
                </td>
            </tr>
        `;
        return;
    }

    // para cada produto a tabela cria uma linha com os seguintes dados, se o produto estiver inativo 
    // a linha fica com as informações meio apagadas e vai para o final da lista
    produtos.forEach(produto => {
        const tr = document.createElement("tr");
        tr.classList.add("table-row");

        // só isso
        if (!produto.ativo) {
            tr.classList.add("produto-inativo");
        }

        tr.innerHTML = `
            <td class="table-cell cod">${produto.cod}</td>
            <td class="table-cell">${produto.nome}</td>
            <td class="table-cell">
            <span class="${produto.tipo === 'Insumo' ? 'badge-insumo' : 'badge-produto'}">
                ${produto.tipo}
            </span>
            </td>
            <td class="table-cell">${produto.um}</td>
            <td class="table-cell">
                <button 
                    class="botao-visualizar-produto"
                    data-id="${produto.id}"
                >
                    <span class="material-symbols-outlined icone-visualizar-produto">
                        visibility
                    </span>
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}



// FUNÇÃO GLOBAL
window.atualizarListaProdutos = () => {
    console.log("[UI] Atualizando lista de produtos");
    carregarProdutos();
};
