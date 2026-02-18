// CHAMA O MENU 
fetch('/Sewfy/view/menuadm/menuadm.html')
    .then(response => response.text())
    .then(data => {
        document
            .querySelector(".layout")
            .insertAdjacentHTML("afterbegin", data);

        ativarBotaoAtual();
        document.body.classList.add('loaded');
    });


// BOTÕES DO MENU
const botoesNAV = [
    "home-btn",
    "cadastro-btn"
];

// ADICIONA FUNÇÃO AOS BOTÕES DO MENU
document.addEventListener("click", (e) => {
    const botao = e.target.closest("button");

    if (!botao) return;

    if (botao.id === botoesNAV[0]) {
        irParaPagina(0);
    }

    if (botao.id === botoesNAV[1]) {
        irParaPagina(1);
    }
});


// VAI PARA AS PÁGINAS
function irParaPagina(botao) {

    switch (botao) {
        case 0:
            window.location.href = "/Sewfy/view/homeadm/home.html"
            break
        case 1:
            window.location.href = "/Sewfy/view/cadastroempresas/cadastroempresas.html"
            break
    }
}


// NOVA FUNÇÃO
function ativarBotaoAtual() {
    const path = window.location.pathname

    if (path.includes("home")) {
        document.getElementById(botoesNAV[0])?.classList.add("active")
    }

    if (path.includes("cadastroempresas")) {
        document.getElementById(botoesNAV[1])?.classList.add("active")
    }
}
