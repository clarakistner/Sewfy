
var main = document.querySelector(".principal");
// ABRE O MODAL DE DETALHES DA OP

document.querySelector(".btn-verop").addEventListener("click", verOP);
function verOP() {

    




    main.style.filter = "blur(25px)";
    document.querySelector(".header").style.filter = "blur(25px)";
    fetch('/Sewfy/view/ordensdeproducao/modal/modalOrdemDeProducao.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("afterbegin", data)
            const modal = document.querySelector("#detailsModal");
            
        });


}

// ADICIONA AÇÃO PARA O BOTÃO QUE FECHA O MODAL DE DETALHES DA OP

document.body.addEventListener("click", (e) => {

    if (e.target.closest(".modal-close")) {
        
        document.querySelector("#detailsModal")?.remove();
        main.style.filter = "blur(0)";
        document.querySelector(".header").style.filter = "blur(0)";
    }

});
