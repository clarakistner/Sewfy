import { mostrarToast } from "../../toast/toast.js";

var main = document.querySelector(".principal");

// CHAMA O MODAL DE CADASTRO

document.addEventListener("click", (e) => {

    if (e.target.closest(".botao-criar-produto")) {
        fetch('/Sewfy/view/produtos/cadastro/cadastroProdutos.html')
            .then(response => response.text())
            .then(data => {
                document.body.insertAdjacentHTML("afterbegin", data)

            });
    }
})

// FECHA O MODAL DE CADASTRO
document.addEventListener("click", (e) => {

    if (e.target.classList.contains("icone-fechar-modal") || e.target.closest(".btn-cancel")) {
        document.querySelector("#productModal").remove()
        main.style.filter = "blur(0)";
        document.querySelector(".header").style.filter = "blur(0)";
    }
})


// CADASTRO DO PRODUTO

document.addEventListener("click", (e) => {

    if (e.target.classList.contains("btn-submit")) {
        document.querySelector("#productModal").remove()
        main.style.filter = "blur(0)";
        document.querySelector(".header").style.filter = "blur(0)";
        mostrarToast("Produto cadastrado!")

    }
})

