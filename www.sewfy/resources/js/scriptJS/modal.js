import { abrirModal as abreModalDetalhes } from '../modalOrdemDeProducao.js'
import { organizaDadosTela, organizaCardsTopo } from './renderizacao.js'
import { getInsumosBanco } from '../modalOrdemDeProducao.js'
import { resgataListaFornecedores, resgataListaProdutos } from './banco.js'
import { setListaDOM, setInsumosDeletados, setInsumosInseridos } from './estado.js'
import { getBaseUrl } from '../API_JS/api.js'
import { pushModal, popModal } from '../assets/modalstack.js' // ✅

const url = getBaseUrl();

export async function abreModal() {
    const response = await fetch(`${url}/editar-ordemdeproducao`);
    const data = await response.text();

    document.body.insertAdjacentHTML("beforeend", data); // ✅ beforeend
    
    const modal = document.querySelector(".modal-edicao");
    modal.classList.add("load");
    pushModal(modal); // ✅ empilha

    setListaDOM(getInsumosBanco());
    setInsumosDeletados([]);
    setInsumosInseridos([]);

    await Promise.all([
        resgataListaFornecedores(),
        resgataListaProdutos(),
    ]);

    await organizaDadosTela();
    organizaCardsTopo();
}

export function fechaModal() {
    popModal(); 
}

export async function fechaModalDetalhes() {
    popModal(); 
}