import { abrirModal as abreModalDetalhes } from '../modalOrdemDeProducao.js'
import { organizaDadosTela, organizaCardsTopo } from './renderizacao.js'
import { getInsumosBanco } from '../modalOrdemDeProducao.js'
import { resgataListaFornecedores, resgataListaProdutos } from './banco.js'
import { setListaDOM, setInsumosDeletados, setInsumosInseridos } from './estado.js'
import { getBaseUrl } from '../API_JS/api.js'


// CONTROLE DO MODAL (abrir, fechar, blur)

var main = document.querySelector(".principal");

const url = getBaseUrl();
// Abre o modal de edicao: carrega o HTML via fetch, injeta no DOM
// e dispara o carregamento de todos os dados necessarios para a tela
export async function abreModal() {
  const response = await fetch(`${url}/editar-ordemdeproducao`);
  const data = await response.text();

  document.body.insertAdjacentHTML("afterbegin", data);
  document.querySelector(".modal-edicao").classList.add("load");
  setListaDOM(getInsumosBanco());
  setInsumosDeletados([]);
  setInsumosInseridos([]);

  await Promise.all([
    resgataListaFornecedores(),
    resgataListaProdutos(),
    organizaDadosTela(),
  ]);

  organizaCardsTopo();
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
  document.querySelector(".sidebar").style.filter = "blur(25px)";
}

// Remove o blur do conteudo principal e do header ao fechar o modal
export function removeBlur() {
  main.style.filter = "blur(0)";
  document.querySelector(".sidebar").style.filter = "blur(0)";
}