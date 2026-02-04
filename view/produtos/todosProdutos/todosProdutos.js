// FUNÇÃO QUE PEGA OS PRODUTOS
async function pegaProdutos() {
    try {
        const listaProds = await window.api.get('/produtos/lista')
        console.log(`Lista de Produtos: ${listaProds.produtos[1].PROD_NOME}`)
        const verProds = document.querySelector(".table-body")
        listaProds.produtos.forEach(produto => {
            const tr = document.createElement('tr')
            tr.classList.add("table-row")
            tr.innerHTML = `
                        <td class="table-cell">${produto.PROD_COD}</td>
                        <td class="table-cell">${produto.PROD_NOME}</td>
                        <td class="table-cell td-badge">
                            <span class="badge ${tipoSpan(transformaTipoString(produto.PROD_TIPO))}">${transformaTipoString(produto.PROD_TIPO)}</span>
                        </td>
                        <td class="table-cell">${produto.PROD_UM}</td>
                        <td class="table-cell table-cell--right">R$ ${parseFloat(produto.PROD_PRECO).toFixed(2)}</td>
                        <td class="table-cell">
                            <button id="botao-visualizar-produto">
                                <span class="material-symbols-outlined icone-visualizar-produto">visibility</span>
                            </button>
                        </td>
        `
            verProds.appendChild(tr)

        });
    } catch (error) {
        console.log(`Erro ao buscar produtos: ${error}`)
    }
}

// FUNÇÃO QUE TRANSFORMA O TIPO EM UMA STRING
function transformaTipoString(numero) {
    if (numero == 1) {
        return "Insumo";
    }
    else if (numero == 2) {
        return "Produto Acabado";
    }
    else if (numero == 3) {
        return "Conjunto";
    }
    return;
}

// FUNÇÃO QUE RETORNA A CLASSE DO SPAN DO TIPO
function tipoSpan(tipo) {
    if (tipo == "Produto Acabado") {
        return "badge-pa"
    }
    else if (tipo == "Insumo") {
        return "badge-in"
    }
    else if (tipo == "Conjunto") {
        return "badge-co"
    }
}


// CHAMA A FUNÇÃO
pegaProdutos()
