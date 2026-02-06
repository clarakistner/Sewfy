// FILTRA OS PRODUTOS

document.addEventListener("change", async (e) => {
    if (e.target.id === "tipos-filtro") {
        const filtro = document.querySelector("#tipos-filtro")
        const listaProds = await window.api.get('/produtos/lista')
        if (filtro.value == 1) {
            const prodsIn = listaProds.produtos.filter(produto => {
                return produto.PROD_TIPO == 1
            })
            organizaLista(prodsIn)
        } else if (filtro.value == 2) {
            const prodsPa = listaProds.produtos.filter(produto => {
                return produto.PROD_TIPO == 2
            })
            organizaLista(prodsPa)
        } else if (filtro.value == 3) {
            const prodsCo = listaProds.produtos.filter(produto => {
                return produto.PROD_TIPO == 3
            })
            organizaLista(prodsCo)
        }else{
            organizaLista(listaProds.produtos)
        }
    }
})


// CHAMA FUNÇÃO NO CAMPO DE PESQUISA

document.addEventListener("input", async (e) => {
    if (e.target.closest(".input-pesquisa input")) {
        try {
            const listaProds = await window.api.get('/produtos/lista')
            pesquisaProdutos(listaProds.produtos, removerAcentos(e.target.value))
        } catch (error) {
            console.log(`Erro ao pesquisar produtos: ${error}`)
        }
    }
})


// FUNÇÃO QUE PEGA OS PRODUTOS
async function pegaProdutos() {
    try {
        const listaProds = await window.api.get('/produtos/lista')



        organizaLista(listaProds.produtos)



    } catch (error) {
        console.log(`Erro ao buscar produtos: ${error}`)
    }
}

// REMOVE OS ACENTOS
function removerAcentos(texto) {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase();
}

// FUNÇÃO QUE PESQUISA OS PRODUTOS
function pesquisaProdutos(listaProds, texto) {
    const textoNormalizado = texto.trim().toUpperCase();
    const prodsContem = listaProds.filter(produto => {
        const nomeNormalizado = removerAcentos(produto.PROD_NOME);
        const codNormalizado = removerAcentos(produto.PROD_COD);
        return nomeNormalizado.toUpperCase().includes(textoNormalizado) ||
            codNormalizado.toUpperCase().includes(textoNormalizado);
    });
    organizaLista(prodsContem)

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

// FUNÇÃO QUE PERPASSA A LISTA DE PRODUTOS

function organizaLista(listaProds) {
    const verProds = document.querySelector(".table-body")
    verProds.innerHTML = ""
    if (!listaProds || listaProds.length == 0) {
        const tabela = document.querySelector(".table")
        tabela.style.display = "none"
        if (!document.querySelector(".lista-produtos h2")) {
            const h2 = document.createElement("h2")
            h2.innerText = "Produtos não encontrados!";
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
        listaProds.forEach(produto => {
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
        if(produto.PROD_ATIV == 1){
            tr.classList.add("disable")
        }else{
            tr.classList.remove("disable")
        }
            verProds.appendChild(tr)

        });
    }

}

// CHAMA A FUNÇÃO
pegaProdutos()
