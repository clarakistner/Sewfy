import { mostrarToast } from "/Sewfy/view/toast/toast.js"

import { atualizarListaProdutos } from "../todosProdutos/todosProdutos.js";

var main = document.querySelector(".principal");


document.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Form submit bloqueado");
});

// CHAMA O MODAL DE CADASTRO

document.addEventListener("click", (e) => {

    if (e.target.closest(".botao-criar-produto")) {
        fetch('/Sewfy/view/produtos/cadastro/cadastroProdutos.html')
            .then(response => response.text())
            .then(data => {
                document.body.insertAdjacentHTML("afterbegin", data)

            });
    }
})

// FECHA O MODAL DE CADASTRO
document.addEventListener("click", (e) => {

    if (e.target.classList.contains("icone-fechar-modal") || e.target.closest(".btn-cancel")) {
        document.querySelector("#productModal").remove()
        main.style.filter = "blur(0)";
        document.querySelector(".header").style.filter = "blur(0)";
    }
})


// CADASTRO DO PRODUTO

document.addEventListener("click", async (e) => {

    if (e.target.classList.contains("btn-submit")) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        cadastrarProduto();

    }
})

// FUNÇÃO DE CADASTRO DE PRODUTO
async function cadastrarProduto() {
    const prodNome = document.querySelector("#pName").value
    const prodCod = document.querySelector("#pCode").value
    const prodDesc = document.querySelector("#pDesc").value
    const prodPreco = document.querySelector("#pPrice").value
    const prodUm = document.querySelector("#pUm").value
    const prodTipo = document.querySelector("#pType").value
    const regex = /^[A-Z]{3}-\d{2}$/

    if (!regex.test(prodCod)) {
        mostrarToast("O código não está no formato XXX-00", "erro")
        return
    }
    if (!prodPreco || parseFloat(prodPreco) <= 0) {
        mostrarToast("O preço deve ser maior que zero!", "erro");
        return;
    }
    const listaTipo = {
        "insumo": 1,
        "final": 2,
        "conjunto": 3
    }

    const prodTipoNumero = listaTipo[prodTipo]

    try {
        const dadosProduto = {
            PROD_COD: prodCod,
            PROD_NOME: prodNome,
            PROD_DESC: prodDesc,
            PROD_TIPO: prodTipoNumero,
            PROD_UM: prodUm,
            PROD_PRECO: prodPreco,
            PROD_ATIV: 1
        }

        const resposta = await window.api.post("/produtos", dadosProduto);

        console.log(`Resposta: ${resposta}`)

        document.querySelector("#productModal").remove()
        main.style.filter = "blur(0)";
        document.querySelector(".header").style.filter = "blur(0)";
        await atualizarListaProdutos()

    } catch (error) {
        console.log(`Erro ao cadastrar produto: ${error}`)

    }
}

