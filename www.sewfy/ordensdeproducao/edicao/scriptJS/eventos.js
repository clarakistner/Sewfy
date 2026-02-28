import { abrirModal as abreModalDetalhes } from '../../modal/modalOrdemDeProducao.js'
import { abreModal, fechaModal, fechaModalDetalhes, colocaBlur, removeBlur } from './modal.js'
import { organizaDadosTela, limpaDivInsumos, limpaSelectInsumos, defineDisplayBoxForNovoInsumo } from './renderizacao.js'
import {salvaAlteracoes } from './persistencia.js'
import { insereDadosOPAtualizados } from './persistencia.js'
import { deletarInsumoDOM, criaNovoInsumoDOM } from './dom.js'

// EVENTOS

document.addEventListener("click", handleClick)
document.addEventListener("change", handleChange)

async function handleClick(e) {
  // Botao editar: fecha o modal de detalhes e abre o modal de edicao
  if (e.target.closest(".editar")) {
    colocaBlur()
    await fechaModalDetalhes()
    setTimeout(() => {
      abreModal()
    }, 50)
  }

  // Botao fechar (X): fecha o modal de edicao e remove o blur
  if (e.target.closest(".close-btn")) {
    fechaModal()
    removeBlur()
  }

  // Botao cancelar: fecha o modal de edicao e reabre o modal de detalhes
  if (e.target.closest(".cancel")) {
    await fechaModal()
    setTimeout(() => {
      abreModalDetalhes()
    }, 50)
  }

  // Botao salvar: coleta os dados atualizados e persiste no banco
  if (e.target.closest(".save")) {
    insereDadosOPAtualizados()
    salvaAlteracoes()
  }

  // Botao deletar insumo: remove o insumo da OP e recarrega a lista na tela
  if (e.target.closest(".icone-remover, .delete")) {
    const idOPIN = e.target.closest(".icone-remover")?.id
    if (!idOPIN) return
    const getNum = (str) => parseInt(str.match(/(\d+)$/)[1], 10);
    deletarInsumoDOM(getNum(idOPIN))
    limpaDivInsumos()
    limpaSelectInsumos()
    await organizaDadosTela()
  }

  // Botao adicionar: adiciona novo insumo na OP
  if (e.target.closest(".add")) {
    criaNovoInsumoDOM() 
  }
}

function handleChange(e) {
  // Checkbox que controla se o novo insumo requer fornecedor
  if (e.target.matches("#requerForNovoInsumo")) {
    defineDisplayBoxForNovoInsumo(e.target)
  }
}