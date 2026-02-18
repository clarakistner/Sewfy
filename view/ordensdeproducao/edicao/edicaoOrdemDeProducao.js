import { mostrarToast } from '../../toast/toast.js'
import { abrirModal as abreModalDetalhes } from '../modal/modalOrdemDeProducao.js';
import { getOrdemProducao, getInsumosBanco } from '../modal/modalOrdemDeProducao.js';
import { retornaNomeProduto } from '../modal/modalOrdemDeProducao.js';

var main = document.querySelector(".principal");

let listaInsumos = []
let listaFornecedores = []

const setListaInsumos = (lista) => {
  listaInsumos = lista
}
const getListaInsumos = () => {
  return listaInsumos
}

const setListaFornecedores = (lista) => {
  listaFornecedores = lista
}
const getListaFornecedores = () => {
  return listaFornecedores
}

document.addEventListener("click", handleClick)

async function handleClick(e) {
  if (e.target.closest(".editar")) {
    colocaBlur()
    await fechaModalDetalhes()
    setTimeout(() => {
      abreModal()
    }, 50)


  }
  if (e.target.closest(".close-btn")) {
    fechaModal()
    removeBlur()
  }
  if (e.target.closest(".cancel")) {
    await fechaModal()
    setTimeout(() => {
      abreModalDetalhes()

    }, 50)
  }
  if (e.target.closest(".save")) {
    fechaModal()
    removeBlur()
    salvaAlteracoes()
  }
}

function abreModal() {
  fetch('/Sewfy/view/ordensdeproducao/edicao/edicaoOrdemDeProducao.html')
    .then(response => response.text())
    .then(async (data) => {
      document.body.insertAdjacentHTML("afterbegin", data)
      document.querySelector(".modal-edicao").classList.add("load")
      await Promise.all([
        resgataListaFornecedores(),
        resgataListaProdutos(),
        organizaDadosTela()
      ])
    })
}

function fechaModal() {
  document.querySelector(".modal-edicao")?.classList.remove("load")
  document.querySelector(".modal-edicao")?.remove();
}

function fechaModalDetalhes() {

  document.querySelector("#detailsModal")?.classList.remove("load")
  document.querySelector("#detailsModal")?.remove();

}

function colocaBlur() {
  main.style.filter = "blur(25px)";
  document.querySelector(".header").style.filter = "blur(25px)";
}
function removeBlur() {
  main.style.filter = "blur(0)";
  document.querySelector(".header").style.filter = "blur(0)";
}

function salvaAlteracoes() {
  mostrarToast("Alterações salvas!")
}

async function defineNomeIdDOM() {
  try {
    const campo = document.querySelector("#idNome") ? document.querySelector("#idNome") : "Não achei o paragrafo"
    console.log(`Achou Paragrafo? ${campo}`)
    const op = getOrdemProducao()

    const nomeProd = await retornaNomeProduto(op.prodIDOP)
    console.log(`Produto da OP: ${nomeProd}`)

    campo.textContent = `
  ${op.idOP} — ${nomeProd}
  `
  } catch (error) {
    console.log(`Erro ao busca nome e código da OP: ${error}`)
    mostrarToast("Erro ao busca nome e código da OP", "erro")
  }
}


async function resgataListaProdutos() {
  try {
    const listaBanco = await window.api.get("/produtos")
    setListaInsumos(listaBanco.filter(insumo => {
      insumo.tipo == "Insumo" && insumo.ativo == 1
    }))
  } catch (error) {
    console.log(`Erro ao tentar resgatar produtos: ${error}`)
    mostrarToast("Erro ao tentar resgatar produtos", 'erro')
    throw error
  }
}

async function resgataListaFornecedores() {
  try {
    const listaBanco = await window.api.get("/fornecedores")
    setListaFornecedores(listaBanco)
  } catch (error) {
    console.log(`Erro ao tentar resgatar fornecedores: ${error}`)
    mostrarToast("Erro ao tentar resgatar fornecedores", 'erro')
    throw error
  }
}

function criaSelectInsumos() {

}

function defineUnidade() {

}

function criaBoxFornecedores() {

}

function formataDataSQL() {

}

function criarInsumo(id, nome, quantidade, unidade, fornecedor, entrega, requerFornecedor) {
  const div = document.createElement('div')
  div.className = 'insumo'
  div.id = id

  div.innerHTML = `
    <div class="grid-12">
      <div class="col-3">
        <label>Nome</label>
        <input value="${nome}">
      </div>
      <div class="col-2">
        <label>Quantidade</label>
        <input type="number" value="${quantidade}">
      </div>
      <div class="col-2">
        <label>Unidade</label>
        <input value="${unidade}">
      </div>
      <div class="col-2 boxFornecedor">
        <label>Fornecedor</label>
        <input value="${fornecedor}">
      </div>
      <div class="col-2 boxEntrega">
        <label>Entrega</label>
        <input type="date" value="${entrega}">
      </div>
      <div class="col-1 align-end">
        <button class="delete">
          <span class="material-symbols-outlined icone-remover">delete</span>
        </button>
      </div>
      <label class="checkbox">
        <input type="checkbox" ${requerFornecedor ? 'checked' : ''}>
        Requer fornecedor
      </label>
    </div>
  `

  const checkbox = div.querySelector('input[type="checkbox"]')
  const boxFornecedor = div.querySelector('.boxFornecedor')
  const boxEntrega = div.querySelector('.boxEntrega')

  const toggleFornecedor = () => {
    const visivel = checkbox.checked
    boxFornecedor.style.display = visivel ? '' : 'none'
    boxEntrega.style.display = visivel ? '' : 'none'
  };

  checkbox.addEventListener('change', toggleFornecedor)
  toggleFornecedor()

  div.querySelector('.delete').addEventListener('click', () => div.remove())

  return div
}

async function retornaNomeFornecedor(id) {
  try {
    if(id == null){
      return null
    }else
    {console.log(`ID fornecedor: ${id}`)
    const fornecedor = await window.api.get(`/fornecedores/${parseInt(id)}`)
    return fornecedor.nome}
  } catch (error) {
    console.log(`Erro ao tentar pesquisar fornecedor: ${error}`)
    mostrarToast("Erro ao tentar pesquisar fornecedor", "erro")
    throw error
  }
}

async function definiDivsInsumos() {
  const campoDivs = document.querySelector(".divInsumos")
  const insumosOP = getInsumosBanco()

  const promessasFornecedores = insumosOP.map(insumo => {
    console.log(`ID Fornecedor map: ${insumo.forOPIN}`)
    return retornaNomeFornecedor(insumo.forOPIN)
  })
  const promessasInsumos = insumosOP.map(insumo => {
    return retornaNomeProduto(insumo.prodIdOPIN)
  })
  
  const nomesInsumos = await Promise.all(promessasInsumos)
  const nomesFornecedores = await Promise.all(promessasFornecedores)

  insumosOP.forEach((insumo, index) => {

    console.log(`Lista de fornecedores: ${nomesFornecedores[index]}`)
    if (nomesFornecedores[index] == null) {
      campoDivs.appendChild(criarInsumo(parseInt(insumo.idOPIN), nomesInsumos[index], insumo.qtdOPIN, insumo.umOPIN, nomesFornecedores[index], "", false))
    } else {
      campoDivs.appendChild(criarInsumo(parseInt(insumo.idOPIN), nomesInsumos[index], insumo.qtdOPIN, insumo.umOPIN, nomesFornecedores[index], "", true))
    }

  })
}
async function organizaDadosTela() {
  await Promise.all([
    defineNomeIdDOM(),
    definiDivsInsumos()
  ])
}