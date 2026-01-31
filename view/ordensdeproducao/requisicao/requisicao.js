 var modalInsumos = document.querySelector(".insumos");
    var modalProduto = document.querySelector(".produto");
    var tabelaInsumos = document.getElementById("tabelaInsumos");
    var campoInsumo = document.querySelector(".campoInsumo");
    var campoQuant = document.querySelector(".campoQuant");
    var modalMostrarOrdem = document.querySelector(".mostrarOrdem");
   
    var listaInsumos = [];


    function adicionarInsumo() {

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
        campoInsumo.Quant = "";

      }
    }

    function irParaInsumos() {
      modalProduto.style.display = "none";
      modalInsumos.style.display = "block";
    }
    function irParaMostrarOrdem() {
      modalInsumos.style.display = "none";
      modalMostrarOrdem.style.display = "block";
    }