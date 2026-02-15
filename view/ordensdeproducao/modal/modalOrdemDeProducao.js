
let main = document.querySelector(".principal")
let OP = null
let OPINs = []
document.addEventListener("click", handleClick)

// Gerencia os clicks no modal
async function handleClick(e) {
    if (e.target.closest(".btn-verop")) {
        const idOP = e.target.id
        console.log(`ID da OP: ${idOP}`)
        await resgataOPCompletaBanco(idOP)
        abrirModal()
    }
    if (e.target.closest(".modal-close")) {
        fecharModal()
    }
}

// ABRE O MODAL DE DETALHES DA OP
async function abrirModal() {
    console.log("Abrindo modal .........................................")
    main.style.filter = "blur(25px)";
    document.querySelector(".header").style.filter = "blur(25px)"
    try {
        const response = await fetch('/Sewfy/view/ordensdeproducao/modal/modalOrdemDeProducao.html')
        const data = await response.text()
        document.body.insertAdjacentHTML("afterbegin", data)
        const modal = document.querySelector("#detailsModal")
        modal.classList.add("load")
        await insereDetalhesNaTela()

    } catch (error) {
        console.error('Erro ao abrir modal:', error)
    }
}

// FECHA O MODAL DE DETALHES DA OP
function fecharModal() {
    document.querySelector("#detailsModal")?.remove()
    main.style.filter = "blur(0)"
    document.querySelector(".header").style.filter = "blur(0)"
}

// Resgata os dados da OP e dos insumos do banco
async function resgataOPCompletaBanco(id) {
    try{const busca = await window.api.get(`/ordemdeproducao/detalhes/${id}`)
    OPINs = busca.opinS
    OP = busca.op
    console.log(`Resultado da busca: ${OP}`)}catch(error){
        console.log(`Erro ao buscar a Ordem de Produção no banco: ${error}`)
    }
}

// Função para buscar o nome do produto pelo ID
async function retornaNomeProduto(id) {
    try {
        // Faz requisição para buscar dados do produto
        const response = await fetch(
            `/Sewfy/controller/produtos/VisualizarProdutoController.php?id=${id}`
        )
        const produto = await response.json()

        // Log de debug
        console.log(` DENTRO DA FUNÇÃO retornaNomeProduto() -> PROD_NOME:${produto.nome}`)

        return produto.nome
    } catch (error) {
        console.log(`Erro ao buscar produto: ${error}`)
    }
}

// Insere informações no DOM

async function insereDetalhesNaTela() {
    console.log(`Ordem de Produção: ${OP}`)
    const campoNome = document.querySelector("#nomeProd")
    const campoQuant = document.querySelector("#quantProd")
    const campoCustou = document.querySelector("#custou")
    const campoCustot = document.querySelector("#custot")

    if (!OP || !campoNome || !campoQuant) {
        console.error('Dados ou elementos não encontrados')
        return
    }

    const nomeProd = await retornaNomeProduto(parseInt(OP.prodIDOP))

    campoNome.innerHTML = `
    Produto: ${nomeProd}
    `
    campoQuant.innerHTML = `
    Quantidade: ${OP.qtdOP}
    `
    campoCustou.innerHTML = `
    Custo Unitário: ${parseFloat(OP.custou).toFixed(2)}
    `
    campoCustot.innerHTML = `
    Custo Total: ${parseFloat(OP.custot).toFixed(2)}
    `
}

