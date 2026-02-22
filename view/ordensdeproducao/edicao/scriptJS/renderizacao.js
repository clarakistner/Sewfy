import { getListaInsumos, getListaFornecedores, atualizaOPINs } from './estado.js'
import { getOrdemProducao, getInsumosBanco } from '../../modal/modalOrdemDeProducao.js'
import { retornaNomeProduto } from '../../modal/modalOrdemDeProducao.js'
import { criarInsumo, criaOptionInsumo } from './dom.js'
import { insereOptionsFornecedores } from './dom.js'
import { mostrarToast } from '../../../toast/toast.js'


// RENDERIZACAO DA TELA (organiza e popula os campos do modal)

// Ponto central de renderizacao: popula nome/id, quantidades e divs de insumos
export async function organizaDadosTela() {
  await Promise.all([
    defineNomeIdDOM(),
    colocaQuatidadeQuebraOP(),
    definiDivsInsumos(),
  ])
  await insereOptionsFornecedores("[data-field='fornecedor']")
  organizaDivNovoInsumo()
}

// Exibe o id e o nome do produto da OP no cabecalho do modal
async function defineNomeIdDOM() {
  try {
    const campo = document.querySelector("#idNome")
    if (!campo) {
      console.log("Não achei o paragrafo")
      return
    }
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

// Preenche os campos de quantidade e quebra da OP com os valores atuais
function colocaQuatidadeQuebraOP() {
  try {
    const op = getOrdemProducao()
    const campoQTD = document.querySelector("#qtdOP")
    const campoQUEBRA = document.querySelector("#quebraOP")
    if (!campoQTD || !campoQUEBRA) {
      console.log("Campos de quantidade/quebra não encontrados")
      return
    }
    campoQTD.value = op.qtdOP
    campoQUEBRA.value = op.quebra
  } catch (error) {
    console.log(`Erro ao preencher quantidade e quebra da OP: ${error}`)
    mostrarToast("Erro ao preencher quantidade e quebra da OP", "erro")
  }
}

// Cria e insere as divs de cada insumo da OP na area de insumos
async function definiDivsInsumos() {
  try {
    const campoDivs = document.querySelector(".divInsumos")
    if (!campoDivs) {
      console.log("Div de insumos não encontrada")
      return
    }
    const insumosOP = getInsumosBanco()

    // Limpa o array auxiliar antes de repopular para evitar acumulo em re-renderizacoes
    atualizaOPINs.length = 0

    // Busca todos os nomes dos produtos em paralelo
    const promessasInsumos = insumosOP.map(insumo => {
      return retornaNomeProduto(insumo.prodIdOPIN)
    })
    const nomesInsumos = await Promise.all(promessasInsumos)

    insumosOP.forEach((insumo, index) => {
      atualizaOPINs.push(insumo)

      if (insumo.forOPIN == null) {
        campoDivs.appendChild(criarInsumo(parseInt(insumo.idOPIN), nomesInsumos[index], insumo.qtdOPIN, insumo.umOPIN, insumo.forOPIN, false))
      } else {
        campoDivs.appendChild(criarInsumo(parseInt(insumo.idOPIN), nomesInsumos[index], insumo.qtdOPIN, insumo.umOPIN, insumo.forOPIN, true))
      }
    })
  } catch (error) {
    console.log(`Erro ao definir divs de insumos: ${error}`)
    mostrarToast("Erro ao carregar insumos da Ordem de Produção", "erro")
  }
}

// Popula o select de insumos disponiveis para adicionar como novo insumo
function organizaDivNovoInsumo() {
  try {
    const selectInsumo = document.querySelector("#novoInsumo")
    if (!selectInsumo) {
      console.log("Select de novo insumo não encontrado")
      return
    }
    const listaDeInsumos = getListaInsumos()
    console.log(`Lista de Insumos: ${listaDeInsumos}`)
    listaDeInsumos.forEach(insumo => {
      const option = criaOptionInsumo(insumo)
      selectInsumo.appendChild(option)
    })
  } catch (error) {
    console.log(`Erro ao organizar div de novo insumo: ${error}`)
    mostrarToast("Erro ao carregar lista de insumos disponíveis", "erro")
  }
}

// Exibe ou oculta o campo de fornecedor para o novo insumo conforme o checkbox
export async function defineDisplayBoxForNovoInsumo(checkbox) {
  try {
    const boxForNovoInsumo = document.querySelector("#boxForNovoInsumo")
    if (!boxForNovoInsumo) {
      console.log("Box de fornecedor para novo insumo não encontrado")
      return
    }
    if (checkbox.checked) {
      boxForNovoInsumo.style.display = "flex"
      await insereOptionsFornecedores("#fornecedorNovoInsumo")
    } else {
      boxForNovoInsumo.style.display = "none"
      const select = document.querySelector("#fornecedorNovoInsumo")
      if (select) select.innerHTML = ""
    }
  } catch (error) {
    console.log(`Erro ao definir display do box de fornecedor: ${error}`)
    mostrarToast("Erro ao carregar fornecedores", "erro")
  }
}

// Limpa todas as divs de insumos (usado antes de re-renderizar apos exclusao)
export function limpaDivInsumos() {
  const campoDivs = document.querySelector(".divInsumos")
  if (campoDivs) campoDivs.innerHTML = ""
}

export function limpaSelectInsumos() {
  const campoDivs = document.querySelector("#novoInsumo")
  if (campoDivs) campoDivs.innerHTML = "<option value=''>Insumo</option>"
}