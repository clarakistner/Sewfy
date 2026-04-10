import { getListaFornecedores } from './estado.js'
import { retornaNomeFornecedor } from './banco.js'
import { mostrarToast } from '../toast/toast.js'
import { setInsumosInseridos, getInsumosInseridos, setInsumosDeletados, getInsumosDeletados, getListaDOM, setListaDOM } from './estado.js'
import { verificaCampo } from './validacoes.js'
import { organizaDivNovoInsumo } from './renderizacao.js'
import { resgataProdutoPeloID } from './banco.js'
import { getOrdemProducao} from '../modalOrdemDeProducao.js'
import { organizaDadosTela, limpaDivInsumos, limpaSelectInsumos } from './renderizacao.js'
import { converterMoedaParaNumero, formatarMoeda } from '../assets/mascaras.js'
import { atualizaCardsTopo } from './renderizacao.js'

export function criaOptionInsumo(insumo) {
  const option = document.createElement("option")
  option.textContent = `${insumo.nome}`
  option.value = `${insumo.id}`
  return option
}

export function criarInsumo(id, nome, quantidade, preco, unidade, fornecedor, requerFornecedor) {
  const div = document.createElement('div')
  div.className = 'insumo'
  div.id = id

  div.innerHTML = `
    <div class="grid-12">
      <div class="col-3">
        <input value="${nome}" data-field="nome" disabled>
      </div>
      <div class="col-2">
        <input type="number" value="${quantidade}" class="qtd opin${id}" id="qtd${id}">
      </div>
      <div class="col-2">
        <input type="text" value="${formatarMoeda(preco)}" class="preco opin${id}" id="preco${id}">
      </div>
      <div class="col-2">
        <input value="${unidade}" data-field="unidade" disabled>
      </div>
      <div class="col-2 boxFornecedor">
        <select class="opin${id}" data-field="fornecedor" id="fornecedor${id}"></select>
      </div>
      <div class="col-1 align-end">
        <button class="delete">
          <span class="material-symbols-outlined icone-remover" id="${id}">delete</span>
        </button>
      </div>
    </div>
  `

  const boxFornecedor = div.querySelector('.boxFornecedor')
  const selectFornecedor = div.querySelector(`#fornecedor${id}`)

  boxFornecedor.style.display = requerFornecedor ? '' : 'none'

  div.querySelector('.delete').addEventListener('click', () => div.remove())

  if (fornecedor != null) {
    selectFornecedor.dataset.valorInicial = fornecedor
    selectFornecedor.value = fornecedor
  }

  return div
}

export function insereOptionsFornecedores(selectID) {
  try {
    const listaFornecedores = getListaFornecedores()
    const selectsFornecedores = document.querySelectorAll(selectID)
    if (selectsFornecedores.length === 0) return

    selectsFornecedores.forEach(select => {
      listaFornecedores.forEach(forne => {
        const option = document.createElement("option")
        option.value = forne.id
        option.textContent = forne.nome
        select.appendChild(option)
      })
      if (select.dataset.valorInicial) {
        select.value = select.dataset.valorInicial
        delete select.dataset.valorInicial
      }
    })
  } catch (error) {
    console.log(`Erro ao inserir options de fornecedores: ${error}`)
    mostrarToast("Erro ao carregar fornecedores", "erro")
    throw error
  }
}

export function deletarInsumoDOM(idOPIN) {
  try {
    const listaInsumosOP = getListaDOM()
    const insumosDeletados = getInsumosDeletados()

    if (listaInsumosOP.length - 1 == 0) {
      mostrarToast("Deve haver pelo menos um insumo na Ordem de Produção!", "erro")
      return
    }

    setInsumosDeletados([idOPIN, ...insumosDeletados])
    setListaDOM(listaInsumosOP.filter(insumo => String(insumo.idOPIN) !== String(idOPIN)))
    organizaDivNovoInsumo()
  } catch (error) {
    console.log(`Erro ao tentar deletar insumo: ${error}`)
    mostrarToast("Erro ao tentar deletar insumo", "erro")
    throw error
  }
}

export async function criaNovoInsumoDOM() {
  try {
    const insumosDOM = getListaDOM()
    const insumosInseridos = getInsumosInseridos()
    const selectInsumo = document.querySelector("#novoInsumo")
    const selectUM = document.querySelector("#unidadeNovoInsumo")
    const campoQTD = document.querySelector("#quatidadeNovoInsumo")
    const boxFornecedor = document.querySelector("#boxForNovoInsumo")
    const campoPreco = document.querySelector("#precoNovoInsumo")
    const dados = {}

    if (!verificaCampo(selectInsumo) || !verificaCampo(campoQTD) || !verificaCampo(campoPreco)) return

    if (parseInt(campoQTD.value) <= 0 || campoQTD.value.trim() == "") {
      mostrarToast("Para adicionar novo insumo \n a quantidade precisa ser\n maior que 0!", "erro")
      return
    }
    if (selectInsumo.value.trim() == "") {
      mostrarToast("Para adicionar novo insumo \n é necessário escolher um dos produtos\n disponíveis", "erro")
      return
    }
    if (parseFloat(campoPreco.value) <= 0 || campoPreco.value.trim() == "") {
      mostrarToast("Para adicionar novo insumo \n o preço precisa ser\n maior que 0!", "erro")
      return
    }

    const produto = await resgataProdutoPeloID(parseInt(selectInsumo.value))
    const op = getOrdemProducao()

    dados.forOPIN = produto.necessita_clifor ? parseInt(document.querySelector("#fornecedorNovoInsumo").value) : null
    dados.prodIdOPIN = parseInt(produto.id)
    dados.opOPIN = op.idOP
    dados.idOPIN = crypto.randomUUID()
    dados.umOPIN = produto.um
    dados.qtdOPIN = parseInt(campoQTD.value)
    dados.custouOPIN = parseFloat(converterMoedaParaNumero(campoPreco.value))
    dados.custotOPIN = dados.qtdOPIN * dados.custouOPIN

    setInsumosInseridos([...insumosInseridos, dados])

    campoQTD.value = ""
    campoPreco.value = ""
    selectInsumo.value = ""
    selectUM.value = ""
    if (boxFornecedor) boxFornecedor.style.display = "none"

    setListaDOM([...insumosDOM, dados])

    limpaDivInsumos()
    limpaSelectInsumos()
    organizaDivNovoInsumo()
    await organizaDadosTela()
    atualizaCardsTopo()
  } catch (error) {
    console.log(`Erro ao tentar adicionar novo insumo: ${error}`)
    mostrarToast("Erro ao tentar adicionar novo insumo", "erro")
    throw error
  }
}