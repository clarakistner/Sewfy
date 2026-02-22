import { atualizaOP, atualizaOPINs } from './estado.js'
import { getOrdemProducao, getInsumosBanco, setInsumosBanco } from '../../modal/modalOrdemDeProducao.js'
import { mostrarToast } from '../../../toast/toast.js'
import { fechaModal, removeBlur } from './modal.js'
import { verificaQuantidadesOPOPIN, verificaCampo } from './validacoes.js'
import { resgataProdutoPeloID } from './banco.js'

// PERSISTENCIA (salvar, editar e deletar no banco)

// Orquestra o fluxo de salvar: valida, persiste e fecha o modal
export async function salvaAlteracoes() {
  try {
    if (!verificaQuantidadesOPOPIN()) {
      mostrarToast("Os campos de quantidade da Ordem e dos insumos\nnão podem ser vazios ou iguais a 0", "erro")
      return
    } else {
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

// Remove um insumo da OP no banco e atualiza o estado em memoria
export async function deletarInsumoOP(idOPIN) {
  try {
    const listaInsumosOP = getInsumosBanco()

    // Impede remover o ultimo insumo da OP
    if (listaInsumosOP.length - 1 == 0) {
      mostrarToast("Deve haver pelo menos um insumo na Ordem de Produção!", "erro")
      return
    }
    await window.api.delete(`/insumos/deletar/${idOPIN}`)

    // Recarrega os insumos do banco para manter o estado sincronizado
    const busca = await window.api.get(`/ordemdeproducao/detalhes/${getOrdemProducao().idOP}`)
    setInsumosBanco(busca.opinS)
  } catch (error) {
    console.log(`Erro ao tentar deletar insumo: ${error}`)
    mostrarToast("Erro ao tentar deletar insumo", "erro")
    throw error
  }
}

// Cria novo insumo no banco de dados
export async function criaNovoInsumoBanco() {
  try {
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
      dados.IDFOR = parseInt(selectFornecedor.value)
    } else {
      dados.IDFOR = null
    }

    console.log(`ID do fornecedor que vai pro banco: ${dados.IDFOR}`)
    dados.IDPROD = parseInt(produto.id)
    dados.IDOP = op.idOP
    dados.UM = produto.um
    dados.QTD = parseInt(campoQTD.value)
    dados.CUSTOU = produto.preco
    dados.CUSTOT = parseInt(campoQTD.value) * parseFloat(produto.preco)

    await window.api.post("/insumos/criar", dados)

    campoQTD.value = ""
    selectInsumo.value = ""
    if (boxFornecedor) boxFornecedor.style.display = "none"
    if (checkbox) checkbox.checked = false

    // Recarrega os insumos do banco para manter o estado sincronizado
    const busca = await window.api.get(`/ordemdeproducao/detalhes/${getOrdemProducao().idOP}`)
    setInsumosBanco(busca.opinS)

  } catch (error) {
    console.log(`Erro ao tentar adicionar novo insumo: ${error}`)
    mostrarToast("Erro ao tentar adicionar novo insumo", "erro")
    throw error
  }
}
