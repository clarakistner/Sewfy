var main = document.querySelector(".principal");
// CHAMA O MODAL DE DETALHES DO PRODUTO

document.addEventListener("click", (e) => {

    if (e.target.closest(".icone-visualizar-produto")) {
        main.style.filter = "blur(25px)";
        document.querySelector(".header").style.filter = "blur(25px)";
        fetch('/view/produtos/visualizar/visualizarProdutos.html')
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
        main.style.filter = "blur(0)";
        document.querySelector(".header").style.filter = "blur(0)";
    }
})