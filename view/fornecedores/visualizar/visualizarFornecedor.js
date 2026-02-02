var main = document.querySelector(".principal");
// CHAMA O MODAL DE DETALHES DO FORNECEDOR

document.addEventListener("click", (e) => {

    if (e.target.closest(".icone-visualizar-fornecedor")) {
        fetch('/Sewfy/view/fornecedores/visualizar/visualizarFornecedores.html')
            .then(response => response.text())
            .then(data => {
                document.body.insertAdjacentHTML("afterbegin", data)

            });
    }
})

// FECHA O MODAL DE DETALHES DO FORNECEDOR
document.addEventListener("click", (e) => {

    if (e.target.classList.contains("modal-close")) {
        document.querySelector(".fornecedormodal").remove()
        main.style.filter = "blur(0)";
        document.querySelector(".header").style.filter = "blur(0)";
    }
})