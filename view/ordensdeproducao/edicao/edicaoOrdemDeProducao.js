import { mostrarToast } from '../../toast/toast.js'
import { abrirModal as abreModalDetalhes } from '../modal/modalOrdemDeProducao.js';
import { getOrdemProducao, getInsumosBanco, setInsumosBanco } from '../modal/modalOrdemDeProducao.js';
import { retornaNomeProduto } from '../modal/modalOrdemDeProducao.js';

var main = document.querySelector(".principal");

const atualizaOP = {
  NovaQtdOP: 0,
  NovaQuebra: 0
}
const atualizaOPINs = []
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
    insereDadosOPAtualizados() 
    salvaAlteracoes()
  }
  if (e.target.closest(".icone-remover, .delete")) {
    const idOPIN = e.target.closest(".icone-remover").id
    const getNum = (str) => parseInt(str.match(/(\d+)$/)[1], 10);
    console.log(`Aqui está o id do insumo: ${getNum(idOPIN)}`)
    await deletarInsumoOP(getNum(idOPIN))
    limpaDivInsumos()
    await organizaDadosTela()
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

async function salvaAlteracoes() {
  try{if (!verificaQuantidadesOPOPIN()) {
    mostrarToast("Os campos de quantidade da Ordem e dos insumos\nnão podem ser vazios ou iguais a 0", "erro")
    return
  } else {
    await atualizaOPBanco()
    mostrarToast("Alterações salvas!")
    fechaModal()
    removeBlur()
  }}catch(error){
    console.log(`Erro ao tentar salvar alterações: ${error}`)
    mostrarToast("Erro ao tentar salvar alterações", "erro")
    throw error
  }
}

function limpaDivInsumos() {
  const campoDivs = document.querySelector(".divInsumos")
  campoDivs.innerHTML = ""
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
        <input value="${nome}" id="nome" disabled>
      </div>
      <div class="col-2">
        <label>Quantidade</label>
        <input type="number" value="${quantidade}" class="qtd" id="qtd${id}">
      </div>
      <div class="col-2">
        <label>Unidade</label>
        <input value="${unidade}" id="unidade" disabled>
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
          <span class="material-symbols-outlined icone-remover" id="delete${id}">delete</span>
        </button>
      </div>
      
    </div>
  `

  const checkbox = div.querySelector('input[type="checkbox"]')
  const boxFornecedor = div.querySelector('.boxFornecedor')
  const boxEntrega = div.querySelector('.boxEntrega')

  const toggleFornecedor = () => {
    const visivel = requerFornecedor
    boxFornecedor.style.display = visivel ? '' : 'none'
    boxEntrega.style.display = visivel ? '' : 'none'
  };

  toggleFornecedor()

  div.querySelector('.delete').addEventListener('click', () => div.remove())

  return div
}

async function retornaNomeFornecedor(id) {
  try {
    if (id == null) {
      return null
    } else {
      console.log(`ID fornecedor: ${id}`)
      const fornecedor = await window.api.get(`/fornecedores/${parseInt(id)}`)
      return fornecedor.nome
    }
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
    atualizaOPINs.push(insumo)
    console.log(`Lista de fornecedores: ${nomesFornecedores[index]}`)
    if (nomesFornecedores[index] == null) {
      campoDivs.appendChild(criarInsumo(parseInt(insumo.idOPIN), nomesInsumos[index], insumo.qtdOPIN, insumo.umOPIN, nomesFornecedores[index], "", false))
    } else {
      campoDivs.appendChild(criarInsumo(parseInt(insumo.idOPIN), nomesInsumos[index], insumo.qtdOPIN, insumo.umOPIN, nomesFornecedores[index], "", true))
    }

  })
}

function colocaQuatidadeQuebraOP() {
  const op = getOrdemProducao()
  const campoQTD = document.querySelector("#qtdOP")
  const campoQUEBRA = document.querySelector("#quebraOP")
  campoQTD.value = op.qtdOP
  campoQUEBRA.value = op.quebra
}

async function deletarInsumoOP(idOPIN) {
  try {
    const listaInsumosOP = getInsumosBanco()
    if (listaInsumosOP.length - 1 == 0) {
      mostrarToast("Deve haver pelo menos um insumo na Ordem de Produção!", "erro")
      return
    }
    await window.api.delete(`/insumos/deletar/${idOPIN}`)
    const busca = await window.api.get(`/ordemdeproducao/detalhes/${getOrdemProducao().idOP}`)
    setInsumosBanco(busca.opinS)

  } catch (error) {
    console.log(`Erro ao tentar deletar insumo: ${error}`)
    mostrarToast("Erro ao tentar deletar insumo", "erro")
    throw error
  }
}
function verificaQuantidadesOPOPIN() {
  const camposQTD = document.querySelectorAll(".qtd")
  return Array.from(camposQTD).every(campo => {
    const valor = campo.value.trim()
    return valor !== "" && parseFloat(valor) > 0
  })
}
function verificaCampo(campo) {
  if (!campo) {
    return false
  } else {
    return true
  }
}

function insereDadosOPAtualizados() {
  const qtdOP = document.querySelector("#qtdOP")
  const quebraOP = document.querySelector("#quebraOP")
  if (!verificaCampo(qtdOP) || !verificaCampo(quebraOP)) {
    console.log("Campos não encontrados")
    return
  }
  atualizaOP.NovaQtdOP = parseInt(qtdOP.value)
  atualizaOP.NovaQuebra = parseInt(quebraOP.value)
}

async function atualizaOPBanco() {
  try {
    console.log(`NovaQTD: ${atualizaOP.NovaQtdOP} NovaQuebra:${ atualizaOP.NovaQuebra}`)
    const op = getOrdemProducao()
    const dados = {
      NovaQtdOP: atualizaOP.NovaQtdOP,
      NovaQuebra: atualizaOP.NovaQuebra,
      OP: op
    }
    await window.api.put("/ordemdeproducao/editar", dados)
  } catch (error) {
    console.log(`Erro ao tentar editar Ordem de Produção: ${error}`)
    mostrarToast("Erro ao tentar editar Ordem de Produção", "erro")
    throw error
  }
}

async function organizaDadosTela() {

  await Promise.all([
    defineNomeIdDOM(),
    colocaQuatidadeQuebraOP(),
    definiDivsInsumos()
  ])
}