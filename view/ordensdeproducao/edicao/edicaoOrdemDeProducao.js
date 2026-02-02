import { mostrarToast } from '/view/toast/toast.js';

var main = document.querySelector(".principal");
// ABRE O MODAL DE EDIÇÃO E FECHA O DE DETALHES DA OP
document.body.addEventListener("click", (e) => {
    if (e.target.closest(".editar")) {


        main.style.filter = "blur(25px)";
        document.querySelector(".header").style.filter = "blur(25px)";
        fetch('/view/ordensdeproducao/edicao/edicaoOrdemDeProducao.html')
            .then(response => response.text())
            .then(data => {
                document.querySelector("#detailsModal")?.classList.remove("load")
                document.querySelector("#detailsModal")?.remove();
                document.body.insertAdjacentHTML("afterbegin", data)
                document.querySelector(".modal-edicao").classList.add("load")
            })
    }
})
// ADICIONA AÇÃO PARA O BOTÃO QUE FECHA O MODAL DE EDIÇÃO DA OP
document.body.addEventListener("click", (e) => {

    if (e.target.closest(".close-btn")) {
        document.querySelector(".modal-edicao")?.remove();
        main.style.filter = "blur(0)";
        document.querySelector(".header").style.filter = "blur(0)";
    }

});

//CANCELA A EDIÇÃO

document.body.addEventListener("click", (e) => {

    if (e.target.closest(".cancel")) {

        fetch('/view/ordensdeproducao/modal/modalOrdemDeProducao.html')
            .then(response => response.text())
            .then(data => {
                document.querySelector(".modal-edicao")?.classList.remove("load")
                document.querySelector(".modal-edicao")?.remove();
                document.body.insertAdjacentHTML("afterbegin", data)
                const modal = document.querySelector("#detailsModal");
                setTimeout(() => {
                    modal.classList.add("load")
                })


            });
    }

});

// SALVA ALTERAÇÕES

document.body.addEventListener("click", (e) => {

    if (e.target.closest(".save")) {
        document.querySelector(".modal-edicao")?.remove();
        main.style.filter = "blur(0)";
        document.querySelector(".header").style.filter = "blur(0)";
        mostrarToast("Alterações salvas!")
    }

});
