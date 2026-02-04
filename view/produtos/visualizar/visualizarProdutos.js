var main = document.querySelector(".principal");
// CHAMA O MODAL DE DETALHES DO PRODUTO

document.addEventListener("click", (e) => {


    if (e.target.closest(".icone-visualizar-produto")) {
        
        fetch('/Sewfy/view/produtos/visualizar/visualizarProdutos.html')

            .then(response => response.text())
            .then(data => {
                document.body.insertAdjacentHTML("afterbegin", data)
                carregaDetalhes(e.target.id)

                
            });
    }
})

// CARREGA OS DETALHES DO PRODUTO 
async function carregaDetalhes(id){
    const campoNome = document.querySelector("#nome")
    const campoDesc = document.querySelector("#desc")
    const campoPreco = document.querySelector("#preco")
    const campoCod = document.querySelector("#cod")
    const campoUm = document.querySelector("#um")
    const campoTipo = document.querySelector("#tipo")

    const listaProds = await window.api.get('/produtos/lista')

    listaProds.produtos.forEach(prod => {
        if(id == prod.PROD_ID){
            campoNome.innerHTML=prod.PROD_NOME
            campoDesc.innerHTML=prod.PROD_DESC
            campoCod.innerHTML=prod.PROD_COD
            campoPreco.innerHTML=`R$ ${parseFloat(prod.PROD_PRECO).toFixed(2)}`
            campoUm.innerHTML=prod.PROD_UM
            campoTipo.innerHTML=transformaTipoString(prod.PROD_TIPO)
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