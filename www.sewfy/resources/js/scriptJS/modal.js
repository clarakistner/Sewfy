import { abrirModal as abreModalDetalhes } from '../modalOrdemDeProducao.js'
import { organizaDadosTela, organizaCardsTopo } from './renderizacao.js'
import { getInsumosBanco } from '../modalOrdemDeProducao.js'
import { resgataListaFornecedores, resgataListaProdutos } from './banco.js'
import { setListaDOM, setInsumosDeletados, setInsumosInseridos } from './estado.js'
import { getBaseUrl } from '../API_JS/api.js'

var main = document.querySelector(".principal");

const url = getBaseUrl();

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
    ]);

    await organizaDadosTela();
    organizaCardsTopo();
}

export function fechaModal() {
    document.querySelector(".modal-edicao")?.classList.remove("load");
    document.querySelector(".modal-edicao")?.remove();
}

export async function fechaModalDetalhes() {
    document.querySelector("#detailsModal")?.classList.remove("load");
    document.querySelector("#detailsModal")?.remove();
}

