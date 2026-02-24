import { mostrarToast } from "../../toast/toast.js"

// Elemento principal que será desfocado ao abrir o modal
const getMain = () => document.querySelector(".principal")

// Cria módulos para guardar a OP e seus insumos
let ordemProducao = null
let insumosBanco = []

const setOrdemProducao = (op) => {
    ordemProducao = op
}
export const getOrdemProducao = () => {
    return ordemProducao
}

export const setInsumosBanco = (insumos) => {
    insumosBanco = insumos
}
export const getInsumosBanco = () => {
    return insumosBanco
}

// Listener global usando event delegation
document.addEventListener("click", handleClick)


// Controla cliques relevantes da página
async function handleClick(e) {

    // Abre modal ao clicar em visualizar OP
    const botao = e.target.closest(".btn-verop, .verop")
    if (botao) {
        console.log("O botão foi clicado!")
        const idOP = botao.id
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

    getMain().style.filter = "blur(25px)"
    document.querySelector(".sidebar").style.filter = "blur(25px)"

    try {
        const response = await fetch('/Sewfy/view/ordensdeproducao/modal/modalOrdemDeProducao.html')
        const data = await response.text()

        document.body.insertAdjacentHTML("afterbegin", data)

        const modal = document.querySelector("#detailsModal")
        modal.classList.add("load")

        await insereDetalhesNaTela()

    } catch (error) {
        console.error('Erro ao abrir modal:', error)
        mostrarToast("Erro ao abrir modal", "erro")
        throw error
    }
}


// Remove o modal e restaura o layout
function fecharModal() {
    document.querySelector("#detailsModal")?.classList.remove("load")
    document.querySelector("#detailsModal")?.remove()
    getMain().style.filter = "blur(0)"
    document.querySelector(".sidebar").style.filter = "blur(0)"
}


// Busca dados da OP e seus insumos no backend
async function resgataOPCompletaBanco(id) {
    try {
        const busca = await window.api.get(`/ordemdeproducao/detalhes/${id}`)
        setInsumosBanco(busca.opinS)
        setOrdemProducao(busca.op)
    } catch (error) {
        console.log(`Erro ao buscar OP: ${error}`)
        mostrarToast("Erro ao buscar OP", "erro")
        throw error
    }
}


// Retorna o nome do produto pelo ID
export async function retornaNomeProduto(id) {
    try {
        const produto = await window.api.get(`/produtos/${id}`)
        return produto.nome
    } catch (error) {
        console.log(`Erro ao buscar produto: ${error}`)
        mostrarToast("Erro ao buscar produto", "erro")
        throw error
    }
}


// Insere os insumos na tabela do modal
async function insereInsumosTabela() {

    try {
        const tabelaDOM = document.querySelector(".tabelaInsumos")

        const promessas = getInsumosBanco().map(insumo =>
            retornaNomeProduto(insumo.prodIdOPIN)
        )
        const nomes = await Promise.all(promessas)

        getInsumosBanco().forEach((insumo, index) => {
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
    } catch (error) {
        console.log(`Erro ao inserir insumos na tabela: ${error}`)
        mostrarToast("Erro ao inserir insumos na tabela", "erro")
        throw error
    }
}


// Preenche os dados principais da OP no modal
async function insereDetalhesNaTela() {

    const campoNome = document.querySelector("#nomeProd")
    const campoQuant = document.querySelector("#quantProd")
    const campoCustou = document.querySelector("#custou")
    const campoCustot = document.querySelector("#custot")

    if (!getOrdemProducao() || !campoNome || !campoQuant) return

    const [nomeProd] = await Promise.all([
        retornaNomeProduto(parseInt(getOrdemProducao().prodIDOP)),
        insereInsumosTabela()
    ])

    campoNome.textContent = nomeProd
    campoQuant.textContent = parseInt(getOrdemProducao().qtdOP).toLocaleString('pt-BR')
    campoCustou.textContent = parseFloat(getOrdemProducao().custou)
        .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    campoCustot.textContent = parseFloat(getOrdemProducao().custot)
        .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
