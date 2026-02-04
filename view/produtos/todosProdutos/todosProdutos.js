// FUNÇÃO QUE PEGA OS PRODUTOS
async function pegaProdutos() {
    try {
        const listaProds = await window.api.get('/produtos/lista')
        const verProds = document.querySelector(".table-body")

        if (!listaProds.produtos || listaProds.produtos.length == 0) {

            console.log("Entrou no if - sem produtos");
            const tabela = document.querySelector(".table")
            tabela.style.display = "none"
            if (!document.querySelector(".lista-produtos h2")) {
                const h2 = document.createElement("h2")
                h2.innerText = "Não há produtos cadastrados!";
                h2.style.display = "flex"
                h2.style.justifyContent = "center"
                document.querySelector(".lista-produtos").appendChild(h2)
            }
            else {
                const mensagem = document.querySelector(".lista-produtos h2")
                mensagem.style.display = ""
            }

        } else {
            const tabela = document.querySelector(".table")
            tabela.style.display = ""
            if (document.querySelector(".lista-produtos h2")) {
                const mensagem = document.querySelector(".lista-produtos h2")
                mensagem.style.display = "none"
            }
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
                                <span class="material-symbols-outlined icone-visualizar-produto" id="${produto.PROD_ID}">visibility</span>
                            </button>
                        </td>
        `
                verProds.appendChild(tr)

            });

        }
        
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

export async function atualizarListaProdutos() {
    const verProds = document.querySelector(".table-body");
    verProds.innerHTML = "";
    await pegaProdutos();
}

// CHAMA A FUNÇÃO
pegaProdutos()
