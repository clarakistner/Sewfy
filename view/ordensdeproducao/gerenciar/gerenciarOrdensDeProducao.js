import { abrirModal, modalEstaAberto } from "../modal/modalOrdemDeProducao.js";
import { fecharModal } from "../modal/modalOrdemDeProducao.js";
import { edicaoEstaAberta, fecharEdicao, abrirEdicao } from "../edicao/edicaoOrdemDeProducao.js";


var main = document.querySelector(".principal");

// CHAMA O MENU
fetch('../../menu/menu.html')
    .then(response => response.text())
    .then(data => {
        document.body.insertAdjacentHTML("afterbegin", data)
    });


// ABRE O MODAL DE EDIÇÃO E FECHA O DE DETALHES DA OP
document.body.addEventListener("click", (e) => {
    if (e.target.closest(".editar")) {

        abrirEdicao()

        fecharModal();
        document.querySelector("#detailsModal")?.remove();
        main.style.filter = "blur(25px)";
        document.querySelector(".header").style.filter = "blur(25px)";
        fetch('/view/ordensdeproducao/edicao/edicaoOrdemDeProducao.html')
            .then(response => response.text())
            .then(data => {
                document.body.insertAdjacentHTML("afterbegin", data)
            });

    }
})

// ADICIONA AÇÃO PARA O BOTÃO QUE FECHA O MODAL DE EDIÇÃO DA OP
document.body.addEventListener("click", (e) => {

    if (e.target.closest(".close-btn")) {
        fecharEdicao()
        document.querySelector(".modal")?.remove();
        main.style.filter = "blur(0)";
        document.querySelector(".header").style.filter = "blur(0)";
    }

});

// ABRE O MODAL DE DETALHES DA OP

document.querySelector(".btn-verop").addEventListener("click", verOP);
function verOP() {

    abrirModal();




    main.style.filter = "blur(25px)";
    document.querySelector(".header").style.filter = "blur(25px)";
    fetch('/view/ordensdeproducao/modal/modalOrdemDeProducao.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("afterbegin", data)
            const modal = document.querySelector("#detailsModal");
            
        });


}

// ADICIONA AÇÃO PARA O BOTÃO QUE FECHA O MODAL DE DETALHES DA OP

document.body.addEventListener("click", (e) => {

    if (e.target.closest(".modal-close")) {
        fecharModal();
        document.querySelector("#detailsModal")?.remove();
        main.style.filter = "blur(0)";
        document.querySelector(".header").style.filter = "blur(0)";
    }

});
