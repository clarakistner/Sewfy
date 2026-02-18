import { mostrarToast } from '../../toast/toast.js'
import { abrirModal as abreModalDetalhes } from '../modal/modalOrdemDeProducao.js';

var main = document.querySelector(".principal");

document.addEventListener("click", handleClick)


async function handleClick(e) {
    if (e.target.closest(".editar")) {
        colocaBlur()
        await fechaModalDetalhes()
        setTimeout(() => {
            abreModal()
        }, 50)
    }
    if (e.target.closest(".close-btn")) {
        fechaModal()
        removeBlur()
    }
    if (e.target.closest(".cancel")) {
        await fechaModal()
        setTimeout(() => {
            abreModalDetalhes()

        }, 50)
    }
    if (e.target.closest(".save")) {
        fechaModal()
        removeBlur()
        salvaAlteracoes()
    }
}

function abreModal() {
    fetch('/Sewfy/view/ordensdeproducao/edicao/edicaoOrdemDeProducao.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("afterbegin", data)
            document.querySelector(".modal-edicao").classList.add("load")
        })
}

function fechaModal() {
    document.querySelector(".modal-edicao")?.classList.remove("load")
    document.querySelector(".modal-edicao")?.remove();
}

function fechaModalDetalhes() {

    document.querySelector("#detailsModal")?.classList.remove("load")
    document.querySelector("#detailsModal")?.remove();

}

function colocaBlur() {
    main.style.filter = "blur(25px)";
    document.querySelector(".header").style.filter = "blur(25px)";
}
function removeBlur() {
    main.style.filter = "blur(0)";
    document.querySelector(".header").style.filter = "blur(0)";
}

function salvaAlteracoes() {
    mostrarToast("Alterações salvas!")
}

function resgataListaProdutos(){

}

function resgataListaFornecedores(){

}

function criaSelectInsumos(){

}

function defineUnidade(){
    
}

function criaBoxFornecedores(){
    
}

function formataData(){

}

function criarInsumo( nome, quantidade, unidade, fornecedor, entrega, requerFornecedor) {
  const div = document.createElement('div');
  div.className = 'insumo';

  div.innerHTML = `
    <div class="grid-12">
      <div class="col-3">
        <label>Nome</label>
        <select>
          <option value="">${nome}</option>
        </select>
      </div>
      <div class="col-2">
        <label>Quantidade</label>
        <input type="number" value="${quantidade}">
      </div>
      <div class="col-2">
        <label>Unidade</label>
        <input value="${unidade}">
      </div>
      <div class="col-2 boxFornecedor">
        <label>Fornecedor</label>
        <input value="${fornecedor}">
      </div>
      <div class="col-2 boxEntrega">
        <label>Entrega</label>
        <input type="date" value="${entrega}">
      </div>
      <div class="col-1 align-end">
        <button class="delete">
          <span class="material-symbols-outlined icone-remover">delete</span>
        </button>
      </div>
      <label class="checkbox">
        <input type="checkbox" ${requerFornecedor ? 'checked' : ''}>
        Requer fornecedor
      </label>
    </div>
  `;

  const checkbox = div.querySelector('input[type="checkbox"]');
  const boxFornecedor = div.querySelector('.boxFornecedor');
  const boxEntrega = div.querySelector('.boxEntrega');

  const toggleFornecedor = () => {
    const visivel = checkbox.checked;
    boxFornecedor.style.display = visivel ? '' : 'none';
    boxEntrega.style.display = visivel ? '' : 'none';
  };

  checkbox.addEventListener('change', toggleFornecedor);
  toggleFornecedor(); 

  div.querySelector('.delete').addEventListener('click', () => div.remove());

  return div;
}