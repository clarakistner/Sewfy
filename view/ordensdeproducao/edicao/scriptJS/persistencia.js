import { setInsumosInseridos, getInsumosInseridos, setInsumosDeletados, getInsumosDeletados, getListaDOM, atualizaOP, atualizaOPINs, setListaDOM } from './estado.js'
import { getOrdemProducao, getInsumosBanco, setInsumosBanco } from '../../modal/modalOrdemDeProducao.js'
import { mostrarToast } from '../../../toast/toast.js'
import { fechaModal, removeBlur } from './modal.js'
import { verificaQuantidadesOPOPIN, verificaCampo } from './validacoes.js'
import { resgataProdutoPeloID } from './banco.js'
import { organizaDadosTela, limpaDivInsumos, limpaSelectInsumos } from './renderizacao.js'
import { organizaDivNovoInsumo } from './renderizacao.js'
// PERSISTENCIA (salvar, editar e deletar no banco)

// Orquestra o fluxo de salvar: valida, persiste e fecha o modal
export async function salvaAlteracoes() {
  try {
    if (!verificaQuantidadesOPOPIN()) {
      mostrarToast("Os campos de quantidade da Ordem e dos insumos\nnão podem ser vazios ou iguais a 0", "erro")
      return
    } else {
      await deletaInsumosBanco()
      await criaInsumosBanco()
      await editaInsumos()
      await atualizaOPBanco()
      mostrarToast("Alterações salvas!")
      fechaModal()
      removeBlur()
    }
  } catch (error) {
    console.log(`Erro ao tentar salvar alterações: ${error}`)
    mostrarToast("Erro ao tentar salvar alterações", "erro")
    throw error
  }
}

// Coleta os novos valores de quantidade e quebra da OP do DOM e salva no objeto de estado
export function insereDadosOPAtualizados() {
  try {
    const qtdOP = document.querySelector("#qtdOP")
    const quebraOP = document.querySelector("#quebraOP")
    if (!verificaCampo(qtdOP) || !verificaCampo(quebraOP)) {
      console.log("Campos não encontrados")
      return
    }
    const novaQtd = parseInt(qtdOP.value)
    const novaQuebra = parseInt(quebraOP.value)
    if (isNaN(novaQtd) || isNaN(novaQuebra)) {
      console.log("Valores de quantidade ou quebra inválidos")
      mostrarToast("Valores de quantidade ou quebra inválidos", "erro")
      return
    }
    atualizaOP.NovaQtdOP = novaQtd
    atualizaOP.NovaQuebra = novaQuebra
  } catch (error) {
    console.log(`Erro ao coletar dados atualizados da OP: ${error}`)
    mostrarToast("Erro ao coletar dados da Ordem de Produção", "erro")
  }
}

// Envia a atualizacao da OP (quantidade e quebra) para o backend
async function atualizaOPBanco() {
  try {
    console.log(`NovaQTD: ${atualizaOP.NovaQtdOP} NovaQuebra:${atualizaOP.NovaQuebra}`)
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

// Coleta os dados de cada insumo da OP no DOM e envia para o backend
async function editaInsumos() {
  try {
    const listaInsumos = getInsumosBanco()
    const listaEdicao = []
    listaInsumos.forEach(insumo => {
      const campos = document.querySelectorAll(`.opin${insumo.idOPIN}`)
      listaEdicao.push(retornaDadosCamposInsumo(insumo, campos))
    })
    const dados = {
      insumos: listaEdicao
    }
    await window.api.put("/insumos/editar", dados)
  } catch (error) {
    console.log(`Erro ao tentar editar insumos: ${error}`)
    mostrarToast("Erro ao tentar editar insumos", "erro")
    throw error
  }
}

// Extrai do DOM os valores de quantidade e fornecedor de um insumo especifico
function retornaDadosCamposInsumo(insumo, campos) {
  try {
    const dados = {}
    let campoQtd
    let campoFor
    campos.forEach(campo => {
      if (campo.id == `qtd${insumo.idOPIN}`) {
        campoQtd = campo
      }
      else if (campo.dataset.field == "fornecedor") {
        campoFor = campo
      }
    })
    if (!!campoQtd) {
      const qtdParsed = parseInt(campoQtd.value)
      dados.qtdInsumo = isNaN(qtdParsed) ? 0 : qtdParsed
      dados.idFor = !campoFor ? null : parseInt(campoFor.value)
      console.log(`ID do fornecedor que vai pro banco: |${dados.idFor}|`)
      dados.idOPIN = parseInt(insumo.idOPIN)
    }
    return dados
  } catch (error) {
    console.log(`Erro ao retornar dados dos campos do insumo: ${error}`)
    mostrarToast("Erro ao coletar dados dos insumos", "erro")
    return {}
  }
}

// Envia lista de insumos deletados pro banco
async function deletaInsumosBanco() {
  try {
    const listaDeletados = getInsumosDeletados()
    if(listaDeletados.length === 0 || !listaDeletados){
      return
    }
    const dados = {
      insumosDeletados: listaDeletados
    }
    await window.api.deleteAll("/insumos/deletar", dados)
  } catch (error) {
    console.log(`Erro ao tentar deletar insumos: ${error}`)
    throw error
  }
}

// Envia lista de insumos inseridos pro banco
async function criaInsumosBanco() {
  try {
    const listaInseridos = getInsumosInseridos()
    const listaDeletados = getInsumosDeletados()
   if (listaInseridos.length === 0) return

   // Filtra os insumos inseridos que não foram deletados
    const listaBanco = listaInseridos.filter(adicionado => {
      if (!listaDeletados.includes(String(adicionado.idOPIN))){
        return adicionado
      }
    })
    const dados = {
      insumosInseridos: listaBanco
    }
    await window.api.post("/insumos/criar", dados)
  } catch (error) {
    console.log(`Erro ao tentar deletar insumos: ${error}`)
    throw error
  }
}