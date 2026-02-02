import { mostrarToast } from "../../toast/toast.js";


// CHAMA O MODAL DE CADASTRO

document.addEventListener("click", (e) => {

    if (e.target.closest(".botao-criar-fornecedor")) {
        fetch('/Sewfy/view/fornecedores/cadastro/cadastroFornecedores.html')
            .then(response => response.text())
            .then(data => {
                document.body.insertAdjacentHTML("afterbegin", data)
                
            });
    }
})

// FECHA O MODAL DE CADASTRO
document.addEventListener("click", (e) => {

    if (e.target.classList.contains("icone-fechar-modal") || e.target.closest(".btn-cancel")) {
        document.querySelector("#fornecedorModal").remove()
    }
})


// CADASTRO DO FORNECEDOR

document.addEventListener("click", (e) => {

    if (e.target.classList.contains("btn-submit")) {
        document.querySelector("#fornecedorModal").remove()
        mostrarToast("Fornecedor cadastrado!")

    }
})

