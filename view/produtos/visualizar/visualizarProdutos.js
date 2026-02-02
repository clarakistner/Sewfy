
// CHAMA O MODAL DE DETALHES DO PRODUTO

document.addEventListener("click", (e) => {

    if (e.target.closest(".icone-visualizar-produto")) {
        fetch('/Sewfy/view/produtos/visualizar/visualizarProdutos.html')

            .then(response => response.text())
            .then(data => {
                document.body.insertAdjacentHTML("afterbegin", data)
                
            });
    }
})

// FECHA O MODAL DE DETALHES DO PRODUTO
document.addEventListener("click", (e) => {

    if (e.target.classList.contains("modal-close")) {
        document.querySelector("#produtoModal").remove()
    }
})