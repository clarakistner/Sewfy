// Elemento principal que será desfocado ao abrir o modal
let main = document.querySelector(".principal")

// Dados globais da Ordem de Produção e seus insumos
let OP = null
let OPINs = []

// Listener global usando event delegation
document.addEventListener("click", handleClick)


// Controla cliques relevantes da página
async function handleClick(e) {

    // Abre modal ao clicar em visualizar OP
    if (e.target.closest(".btn-verop")) {
        const idOP = e.target.id
        await resgataOPCompletaBanco(idOP)
        await abrirModal()
    }

    // Fecha modal
    if (e.target.closest(".modal-close")) {
        fecharModal()
    }
}


// Abre o modal e injeta o HTML no DOM
export async function abrirModal() {

    main.style.filter = "blur(25px)"
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


// Remove o modal e restaura o layout
function fecharModal() {
    document.querySelector("#detailsModal")?.remove()
    main.style.filter = "blur(0)"
    document.querySelector(".header").style.filter = "blur(0)"
}


// Busca dados da OP e seus insumos no backend
async function resgataOPCompletaBanco(id) {
    try {
        const busca = await window.api.get(`/ordemdeproducao/detalhes/${id}`)
        OPINs = busca.opinS
        OP = busca.op
    } catch (error) {
        console.log(`Erro ao buscar OP: ${error}`)
    }
}


// Retorna o nome do produto pelo ID
async function retornaNomeProduto(id) {
    try {
        const produto = await window.api.get(`/produtos/${id}`)
        return produto.nome
    } catch (error) {
        console.log(`Erro ao buscar produto: ${error}`)
    }
}


// Insere os insumos na tabela do modal
async function insereInsumosTabela() {

    const tabelaDOM = document.querySelector(".tabelaInsumos")

    
    const promessas = OPINs.map(insumo =>
        retornaNomeProduto(insumo.prodIdOPIN)
    )

    
    const nomes = await Promise.all(promessas)

    
    OPINs.forEach((insumo, index) => {

        const tr = document.createElement("tr")

        const tdQtd = document.createElement("td")
        tdQtd.textContent = `${insumo.qtdOPIN} ${insumo.umOPIN}`

        const tdNome = document.createElement("td")
        tdNome.textContent = nomes[index]

        const tdCusto = document.createElement("td")
        tdCusto.textContent = parseFloat(insumo.custotOPIN)
            .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

        tr.appendChild(tdQtd)
        tr.appendChild(tdNome)
        tr.appendChild(tdCusto)

        tabelaDOM.appendChild(tr)
    })
}


// Preenche os dados principais da OP no modal
async function insereDetalhesNaTela() {

    const campoNome = document.querySelector("#nomeProd")
    const campoQuant = document.querySelector("#quantProd")
    const campoCustou = document.querySelector("#custou")
    const campoCustot = document.querySelector("#custot")

    if (!OP || !campoNome || !campoQuant) return

    const nomeProd = await retornaNomeProduto(parseInt(OP.prodIDOP))
    await insereInsumosTabela()

    campoNome.innerHTML = nomeProd
    campoQuant.innerHTML = parseInt(OP.qtdOP).toLocaleString('pt-BR')
    campoCustou.innerHTML = parseFloat(OP.custou)
        .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    campoCustot.innerHTML = parseFloat(OP.custot)
        .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
