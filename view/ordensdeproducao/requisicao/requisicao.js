import {mostrarToast} from '../../toast/toast.js';

var main = document.querySelector(".principal");
// ABRE MODAL

document.addEventListener("click", (e) => {
  if (e.target.closest(".icone-adicionar-ordem") || e.target.closest(".botao-criar-ordem")) {
    if (document.querySelector("#createModal")) return;
    fetch('/Sewfy/view/ordensdeproducao/requisicao/requisicao.html')
      .then(response => response.text())
      .then(data => {
        document.body.insertAdjacentHTML("afterbegin", data)
      })
  }
})


// FECHA MODAL

document.addEventListener("click", (e) => {
  if (e.target.closest(".modal-close") || e.target.closest(".cancelar")) {
    document.querySelector("#createModal")?.remove()
    main.style.filter = "blur(0)";
    document.querySelector(".header").style.filter = "blur(0)";
  }
})

// IR PARA OUTRAS TELAS
document.addEventListener("click", (e) => {
  if (e.target.closest(".proxinsumos")) {
    e.preventDefault();
    irOutraTela(".produto", ".insumos")
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
    document.querySelector("#createModal")?.remove()
    main.style.filter = "blur(0)";
    document.querySelector(".header").style.filter = "blur(0)";
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
    campoInsumo.value = "";
    campoQuant.value = "";

  }
}

