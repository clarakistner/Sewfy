import { abrirModal as abreModalDetalhes } from '../../modal/modalOrdemDeProducao.js'
import { organizaDadosTela } from './renderizacao.js'
import { resgataListaFornecedores, resgataListaProdutos } from './banco.js'

// CONTROLE DO MODAL (abrir, fechar, blur)

var main = document.querySelector(".principal");

// Abre o modal de edicao: carrega o HTML via fetch, injeta no DOM
// e dispara o carregamento de todos os dados necessarios para a tela
export function abreModal() {
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

// Remove o modal de edicao do DOM
export function fechaModal() {
  document.querySelector(".modal-edicao")?.classList.remove("load")
  document.querySelector(".modal-edicao")?.remove();
}

// Remove o modal de detalhes do DOM (usado ao transitar para o modal de edicao)
export async function fechaModalDetalhes() {
  document.querySelector("#detailsModal")?.classList.remove("load")
  document.querySelector("#detailsModal")?.remove();
}

// Aplica blur no conteudo principal e no header enquanto o modal esta aberto
export function colocaBlur() {
  main.style.filter = "blur(25px)";
  document.querySelector(".header").style.filter = "blur(25px)";
}

// Remove o blur do conteudo principal e do header ao fechar o modal
export function removeBlur() {
  main.style.filter = "blur(0)";
  document.querySelector(".header").style.filter = "blur(0)";
}