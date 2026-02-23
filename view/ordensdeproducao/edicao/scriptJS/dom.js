import { getListaFornecedores } from './estado.js'
import { retornaNomeFornecedor } from './banco.js'
import { mostrarToast } from '../../../toast/toast.js'
import { setInsumosInseridos, getInsumosInseridos, setInsumosDeletados, getInsumosDeletados, getListaDOM, setListaDOM } from './estado.js'
import { verificaCampo } from './validacoes.js'
import { organizaDivNovoInsumo } from './renderizacao.js'
import { resgataProdutoPeloID } from './banco.js'
import { getOrdemProducao} from '../../modal/modalOrdemDeProducao.js'
import { organizaDadosTela, limpaDivInsumos, limpaSelectInsumos } from './renderizacao.js'

// CRIACAO DE ELEMENTOS DOM

// Cria e retorna uma option para o select de insumos
export function criaOptionInsumo(insumo) {
  const option = document.createElement("option")
  option.textContent = `${insumo.nome}`
  option.value = `${insumo.id}`
  return option
}

// Cria e retorna a div completa de um insumo com seus campos editaveis
export function criarInsumo(id, nome, quantidade, unidade, fornecedor, requerFornecedor) {
  const div = document.createElement('div')
  div.className = 'insumo'
  div.id = id

  div.innerHTML = `
    <div class="grid-12">
      <div class="col-3">
        <label>Nome</label>
        <input value="${nome}" data-field="nome" disabled>
      </div>
      <div class="col-2">
        <label>Quantidade</label>
        <input type="number" value="${quantidade}" class="qtd opin${id}" id="qtd${id}">
      </div>
      <div class="col-2">
        <label>Unidade</label>
        <input value="${unidade}" data-field="unidade" disabled>
      </div>
      <div class="col-2 boxFornecedor">
        <label>Fornecedor</label>
        <select class="opin${id}" data-field="fornecedor" id="fornecedor${id}"></select>
      </div>
      <div class="col-1 align-end">
        <button class="delete">
          <span class="material-symbols-outlined icone-remover" id="delete${id}">delete</span>
        </button>
      </div>
      
    </div>
  `

  const boxFornecedor = div.querySelector('.boxFornecedor')
  const selectFornecedor = div.querySelector(`#fornecedor${id}`)

  const toggleFornecedor = () => {
    const visivel = requerFornecedor
    boxFornecedor.style.display = visivel ? '' : 'none'
  };

  toggleFornecedor()

  // Aguarda o select ser populado antes de definir o valor selecionado
  // O valor sera atribuido por insereOptionsFornecedores apos a insercao no DOM

  div.querySelector('.delete').addEventListener('click', () => div.remove())

  // Armazena o valor do fornecedor no dataset para ser aplicado apos popular o select
  if (fornecedor != null) {
    selectFornecedor.dataset.valorInicial = fornecedor
    selectFornecedor.value = fornecedor
  }

  return div
}

// Popula um select com as opcoes de fornecedores disponíveis
export async function insereOptionsFornecedores(selectID) {
  try {
    const listaFornecedores = getListaFornecedores()
    const selectsFornecedores = document.querySelectorAll(selectID)
    if (selectsFornecedores.length === 0) {
      console.log(`Select ${selectID} não encontrado`)
      return
    }

    // Busca todos os nomes em paralelo para evitar chamadas sequenciais
    const promessas = listaFornecedores.map(forne => {
      return retornaNomeFornecedor(parseInt(forne.id))
    })
    const fornecedores = await Promise.all(promessas)
    selectsFornecedores.forEach(select => {
      listaFornecedores.forEach((forne, index) => {
        const option = document.createElement("option")
        option.value = forne.id
        option.textContent = fornecedores[index]
        select.appendChild(option)
      })
      // Aplica o valor inicial do fornecedor agora que as options estao populadas
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
// Remove um insumo da OP no DOM e atualiza o estado em memoria
export function deletarInsumoDOM(idOPIN) {
  try {
    const listaInsumosOP = getListaDOM()
    const insumosDeletados = getInsumosDeletados()
    

    // Impede remover o ultimo insumo da OP
    if (listaInsumosOP.length - 1 == 0) {
      mostrarToast("Deve haver pelo menos um insumo na Ordem de Produção!", "erro")
      return
    }

    setInsumosDeletados([idOPIN, ...insumosDeletados])

    // Recarrega os insumos do DOM para manter o estado sincronizado
    setListaDOM(listaInsumosOP.filter(insumo => {
      console.log(`Insumo dentro de deletarInsumo(): ${insumo.idOPIN}`)
      return String(insumo.idOPIN) !== String(idOPIN)
    }))
    organizaDivNovoInsumo()
  } catch (error) {
    console.log(`Erro ao tentar deletar insumo: ${error}`)
    mostrarToast("Erro ao tentar deletar insumo", "erro")
    throw error
  }
}

// Cria novo insumo no DOM
export async function criaNovoInsumoDOM() {
  try {
    const insumosDOM = getListaDOM()
    const insumosInseridos = getInsumosInseridos()
    const selectInsumo = document.querySelector("#novoInsumo")
    const campoQTD = document.querySelector("#quatidadeNovoInsumo")
    const checkbox = document.querySelector("#requerForNovoInsumo")
    const boxFornecedor = document.querySelector("#boxForNovoInsumo")
    const dados = {}

    if (!verificaCampo(selectInsumo) || !verificaCampo(campoQTD)) {
      console.log("Campos de novo insumo não encontrados")
      return
    }
    if (parseInt(campoQTD.value) <= 0 || campoQTD.value.trim() == "") {
      mostrarToast("Para adicionar novo insumo \n a quantidade precisa ser\n maior que 0!", "erro")
      return
    }
    if (selectInsumo.value.trim() == "") {
      mostrarToast("Para adicionar novo insumo \n é necessário escolher um dos produtos\n disponíveis", "erro")
      return
    }

    const produto = await resgataProdutoPeloID(parseInt(selectInsumo.value))
    const op = getOrdemProducao()

    if (checkbox.checked) {
      const selectFornecedor = document.querySelector("#fornecedorNovoInsumo")
      dados.forOPIN = parseInt(selectFornecedor.value)
    } else {
      dados.forOPIN = null
    }

    console.log(`ID do fornecedor que vai pro banco: ${dados.IDFOR}`)
    dados.prodIdOPIN = parseInt(produto.id)
    dados.opOPIN = op.idOP
    dados.idOPIN = - (insumosDOM.length + 1)
    dados.umOPIN = produto.um
    dados.qtdOPIN = parseInt(campoQTD.value)
    dados.custouOPIN = parseFloat(produto.preco)
    dados.custotOPIN = parseInt(campoQTD.value) * parseFloat(produto.preco)

    setInsumosInseridos([...insumosInseridos, dados])

    campoQTD.value = ""
    selectInsumo.value = ""
    if (boxFornecedor) boxFornecedor.style.display = "none"
    if (checkbox) checkbox.checked = false

    // Recarrega os insumos do DOM para manter o estado sincronizado
    setListaDOM([...insumosDOM, dados])

    limpaDivInsumos()
    limpaSelectInsumos()
    organizaDivNovoInsumo()
    await organizaDadosTela()
  } catch (error) {
    console.log(`Erro ao tentar adicionar novo insumo: ${error}`)
    mostrarToast("Erro ao tentar adicionar novo insumo", "erro")
    throw error
  }
}
