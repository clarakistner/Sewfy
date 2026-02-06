import { mostrarToast } from "/Sewfy/view/toast/toast.js"

import { atualizarListaProdutos } from "../todosProdutos/todosProdutos.js";

var main = document.querySelector(".principal");

var idProd = 0
// CHAMA O MODAL DE DETALHES DO PRODUTO
document.addEventListener("click", (e) => {
    if (e.target.closest(".icone-visualizar-produto")) {
        fetch('/Sewfy/view/produtos/visualizar/visualizarProdutos.html')
            .then(response => response.text())
            .then(data => {
                document.body.insertAdjacentHTML("afterbegin", data)
                carregaDetalhes(e.target.id)
                idProd = e.target.id
            });
    }
})
// CARREGA OS DETALHES DO PRODUTO 
async function carregaDetalhes(id) {
    const campoNome = document.querySelector("#nome")
    const campoDesc = document.querySelector("#desc")
    const campoPreco = document.querySelector("#preco")
    const campoCod = document.querySelector("#cod")
    const campoUm = document.querySelector("#um")
    const campoTipo = document.querySelector("#tipo")
    const tipoSelect = document.querySelector("#tipoSelect")
    const umSelect = document.querySelector("#umSelect")
    const todosInputs = document.querySelectorAll("input")
    const listaProds = await window.api.get('/produtos/lista')
    todosInputs.forEach(input => { input.readOnly = true; input.style.border = "none" })
    listaProds.produtos.forEach(prod => {
        if (id == prod.PROD_ID) {
            campoNome.value = prod.PROD_NOME
            campoDesc.value = prod.PROD_DESC
            campoCod.value = prod.PROD_COD
            campoPreco.value = `R$ ${parseFloat(prod.PROD_PRECO).toFixed(2)}`
            campoUm.value = prod.PROD_UM
            campoTipo.value = transformaTipoString(prod.PROD_TIPO)

            tipoSelect.value = prod.PROD_TIPO
            umSelect.value = prod.PROD_UM
        }
    })
}
// FUNÇÃO QUE TRANSFORMA O TIPO EM UMA STRING
function transformaTipoString(numero) {
    if (numero == 1) {
        return "Insumo";
    }
    else if (numero == 2) {
        return "Produto Acabado";
    }
    else if (numero == 3) {
        return "Conjunto";
    }
    return;
}
// FECHA O MODAL DE DETALHES DO PRODUTO
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-close")) {
        document.querySelector("#produtoModal").remove()
        main.style.filter = "blur(0)";
        document.querySelector(".header").style.filter = "blur(0)";
    }
})

// ADICIONA FUNÇÃO PARA O BOTÃO EDITAR
document.addEventListener('click', (e) => {
    if (e.target.id == "edicao") {
        abreEdicao()
    }
})
// ABRE A TELA DE ATUALIZAÇÃO
function abreEdicao() {
    const titulo = document.querySelector(".modal-title")
    const seletor = document.querySelector("#ativ")
    const tipoInput = document.querySelector("#tipo")
    const tipoSelect = document.querySelector("#tipoSelect")
    const umInput = document.querySelector("#um")
    const umSelect = document.querySelector("#umSelect")
    const labelSeletor = document.querySelector(".ativ")
    const todosInputs = document.querySelectorAll("input")
    const spansOp = document.querySelectorAll(".op")
    const btnEdicao = document.querySelector("#edicao")
    const btnSalvar = document.querySelector("#salvar")

    titulo.innerHTML = "Editar Produto"
    todosInputs.forEach(input => { input.readOnly = false; input.style.border = "" })
    spansOp.forEach(span => span.style.display = "none")

    seletor.style.display = "block"
    labelSeletor.style.display = ""

    tipoInput.style.display = "none"
    tipoSelect.style.display = "block"

    umInput.style.display = "none"
    umSelect.style.display = "block"
    btnEdicao.style.display = "none"
    btnSalvar.style.display = "block"
}

// DÁ FUNÇÃO AO BOTÃO DE SALVAR
document.addEventListener("click", (e)=>{
    if(e.target.id == "salvar"){
        salvarAlteracoes()
        
    }
})

// SALVA ALTERAÇÕES

async function salvarAlteracoes() {
    try {
        const campoNome = document.querySelector("#nome")
        const campoDesc = document.querySelector("#desc")
        const campoPreco = document.querySelector("#preco")
        const campoCod = document.querySelector("#cod")
        const campoTipo = document.querySelector("#tipoSelect")
        const campoUm = document.querySelector("#umSelect")
        const campoAtiv = document.querySelector("#ativ")
        const regexCod = /^[A-Z]{3}-\d{2}$/
        const preco = campoPreco.value
            .replace("R$", "")
            .replace(/\s/g, "")
            .replace(/\./g, "")
            .replace(",", ".")

        if (!regexCod.test(campoCod.value)) {
            mostrarToast("O código não está no formato XXX-00", "erro")
            return;
        }
        if (parseFloat(preco) <= 0 || isNaN(parseFloat(preco))) {
            mostrarToast("O preço deve ser maior que zero!", "erro");
            return;
        }

        const dados = {
            PROD_ID: idProd,
            PROD_COD: campoCod.value,
            PROD_NOME: campoNome.value,
            PROD_DESC: campoDesc.value,
            PROD_TIPO: parseInt(campoTipo.value),
            PROD_UM: campoUm.value,
            PROD_PRECO: parseFloat(preco),
            PROD_ATIV: parseInt(campoAtiv.value)
        }
        console.log(`Dados: ${dados}`)
        const resposta = await window.api.put("/produtos/editar", dados);

        console.log(`Resposta: ${resposta}`)
        carregaDetalhes(idProd)
        await atualizarListaProdutos()
        fechaEdicao()
    } catch (error) {
        console.log(`Erro ao atualizar produto: ${error}`)

    }
}


// FECHA EDIÇÃO 

function fechaEdicao() {
    const titulo = document.querySelector(".modal-title")
    const seletor = document.querySelector("#ativ")
    const tipoInput = document.querySelector("#tipo")
    const tipoSelect = document.querySelector("#tipoSelect")
    const umInput = document.querySelector("#um")
    const umSelect = document.querySelector("#umSelect")
    const labelSeletor = document.querySelector(".ativ")
    const todosInputs = document.querySelectorAll("input")
    const spansOp = document.querySelectorAll(".op")
    const btnEdicao = document.querySelector("#edicao")
    const btnSalvar = document.querySelector("#salvar")

    titulo.innerHTML = "Detalhes do Produto"
    todosInputs.forEach(input => { input.readOnly = true; input.style.border = "none" })
    spansOp.forEach(span => span.style.display = "")

    seletor.style.display = "none"
    labelSeletor.style.display = "none"

    tipoInput.style.display = "block"
    tipoSelect.style.display = "none"

    umInput.style.display = "block"
    umSelect.style.display = "none"
    
    btnEdicao.style.display = "block"
    btnSalvar.style.display = "none"
}