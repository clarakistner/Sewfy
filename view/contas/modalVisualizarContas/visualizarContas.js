import { mostrarToast } from '/view/toast/toast.js'
var main = document.querySelector(".principal");
// CHAMA O MODAL DE DETALHES DE CONTAS

document.addEventListener("click", (e) => {

    if (e.target.closest(".icone-visualizar-conta")) {
        main.style.filter = "blur(25px)";
        document.querySelector(".header").style.filter = "blur(25px)";
        fetch('/view/contas/modalVisualizarContas/visualizarContas.html')
            .then(response => response.text())
            .then(data => {
                document.body.insertAdjacentHTML("afterbegin", data)

            });
    }
})

// FECHA O MODAL DE DETALHES DE CONTAS
document.addEventListener("click", (e) => {

    if (e.target.classList.contains("modal-fecha")) {
        document.querySelector("#conta-modal")?.remove()
        main.style.filter = "blur(0)";
        document.querySelector(".header").style.filter = "blur(0)";
    }
})

//SALVA ALTERAÇÕES DO MODAL DE DETALHES DE CONTAS
document.addEventListener("click", (e) => {

    if (e.target.classList.contains("btn-submit")) {
        document.querySelector("#conta-modal")?.remove()
        main.style.filter = "blur(0)";
        document.querySelector(".header").style.filter = "blur(0)";
        mostrarToast("Alterações na conta salvas!")
    }
})