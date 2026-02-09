import { mostrarToast } from '../../toast/toast.js';

const op = {
  PROD_ID: null,
  OP_DATAA: null,
  OP_QTD: null
}

// ABRE MODAL

document.addEventListener("click", (e) => {
  if (e.target.closest(".icone-adicionar-ordem") || e.target.closest(".botao-criar-ordem")) {
    if (document.querySelector("#createModal")) return;

    fetch('/Sewfy/view/ordensdeproducao/requisicao/requisicao.html')
      .then(response => response.text())
      .then(data => {
        document.body.insertAdjacentHTML("afterbegin", data)
        const modal = document.querySelector("#createModal")
        modal.style.opacity = "1"
        if (document.querySelector(" select.input-produto")) {
          console.log("Select existe")
          carregarProdutosEmSelect("final")
        }
      })
  }
})


// FECHA MODAL

document.addEventListener("click", (e) => {
  if (e.target.closest(".modal-close") || e.target.closest(".cancelar")) {
    document.querySelector("#createModal").remove()
  }
})

// IR PARA OUTRAS TELAS
document.addEventListener("click", (e) => {
  if (e.target.closest(".proxinsumos")) {
    e.preventDefault();
    const selectProduto = document.querySelector("select.input-produto")
    const opcao = selectProduto.options[selectProduto.selectedIndex]
    const campoQuant = document.querySelector("input.input-produto")
    const quantidade = parseInt(campoQuant.value)
    if (opcao.value == "Produto" || quantidade == 0 || !quantidade) {
      mostrarToast("Todos os campos devem ser preenchidos!", "erro")
      return;
    } else {
      op.PROD_ID = parseInt(opcao.id)
      op.OP_QTD = quantidade
      irOutraTela(".produto", ".insumos")
      carregarProdutosEmSelect("insumos")
    }
  }
  else if (e.target.closest(".finalizar")) {
    e.preventDefault();
    irOutraTela(".insumos", ".mostrarOrdem")
  }
})

function irOutraTela(atual, proxima) {
  document.querySelector(atual).style.display = "none";
  document.querySelector(proxima).style.display = "block";
}

// CONFIRMA A OP

document.addEventListener("click", (e) => {

  if (e.target.closest(".confirmar")) {
    document.querySelector("#createModal").remove()
    mostrarToast("Ordem de Produção criada!")
  }
})



// ADICIONA INSUMO NA TABLE

document.addEventListener("click", (e) => {
  if (e.target.closest(".adicionar")) {
    e.preventDefault();
    adicionarInsumo()
  }
})


function adicionarInsumo() {

  var tabelaInsumos = document.getElementById("tabelaInsumos");
  var campoInsumo = document.querySelector(".campoInsumo");
  var campoQuant = document.querySelector(".campoQuant");
  var listaInsumos = [];
  const insumo = campoInsumo.value.trim()
  const quant = campoQuant.value.trim()
  if (insumo !== "" && quant !== "") {


    listaInsumos.push(insumo);
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    const td = document.createElement("td");
    const tdF = document.createElement("td");
    const tdUM = document.createElement("td");

    th.textContent = quant;
    td.textContent = insumo;
    tdF.textContent = "Roberto";
    tdUM.textContent = "UM";

    tr.appendChild(th);
    tr.appendChild(td);
    tr.appendChild(tdF);
    tr.appendChild(tdUM);
    tabelaInsumos.appendChild(tr);
    campoInsumo.value = "Insumo";
    campoQuant.value = "";

  }
}

// CARREGA OS PRODUTOS DO BANCO

async function carregarProdutosEmSelect(tipo) {
  try {
    const selectProduto = document.querySelector("select.input-produto")
    const selectInsumo = document.querySelector(".campoInsumo")
    const listaProdutosBanco = await window.api.get('/produtos/lista')
    const listaProdutos = listaProdutosBanco.produtos

    if (tipo == 'final') {
      listaProdutos.forEach(p => {
        if (p.PROD_TIPO == 2 || p.PROD_TIPO == 3) {

          const option = document.createElement('option')
          option.id = `${p.PROD_ID}`
          option.innerHTML = `${p.PROD_NOME}`
          selectProduto.appendChild(option)
        }

      });
    }
    else {
      listaProdutos.forEach(p => {
        if (p.PROD_TIPO == 1) {

          const option = document.createElement('option')
          option.id = `${p.PROD_ID}`
          option.innerHTML = `${p.PROD_NOME}`
          selectInsumo.appendChild(option)
        }
      })
    }
  } catch (error) {
    console.log(`Erro ao buscar produtos: ${error}`)
  }

}