import "./API_JS/api.js";
// CHAMA O MENU
fetch(`${window.BASE_URL}/menuadm`)
    .then(response => response.text())
    .then(data => {
        document.querySelector('.layout').insertAdjacentHTML("afterbegin", data)
        ativarBotaoAtual()
        document.body.classList.add('loaded')
    });


// BOTÕES DO MENU
const botoesNAV = [
    "btn-home",
    "btn-cadastro",
    "btn-relatorio",
    "btn-config",
    "btn-logout"
];


// ADICIONA FUNÇÃO AOS BOTÕES DO MENU
document.addEventListener("click", (e) => {
    if (e.target.id === botoesNAV[0]) irParaPagina(0)
    if (e.target.id === botoesNAV[1]) irParaPagina(1)
    if (e.target.id === botoesNAV[2]) irParaPagina(2)
    if (e.target.id === botoesNAV[3]) irParaPagina(3)
    if (e.target.id === botoesNAV[4]) irParaPagina(4)
});


// VAI PARA AS PÁGINAS
function irParaPagina(botao) {
    switch (botao) {
        case 0:
            window.location.href = `${window.BASE_URL}/homeadm`
            break
        case 1:
            window.location.href = `${window.BASE_URL}/cadastro-empresa`
            break
        case 2:
            window.location.href = `${window.BASE_URL}/relatoriosadm`
            break
        case 3:
            window.location.href = `${window.BASE_URL}/configadm`
            break
        case 4:
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('email');
            window.location.replace(`${window.BASE_URL}/loginadm`);
            break
    }
}


// MARCA O BOTÃO ATIVO COM BASE NA URL ATUAL
function ativarBotaoAtual() {
    const path = window.location.pathname

    if (path.includes("homeadm")) {
        document.getElementById(botoesNAV[0])?.classList.add("active")
    }
    if (path.includes("cadastro")) {
        document.getElementById(botoesNAV[1])?.classList.add("active")
    }
    if (path.includes("relatorio")) {
        document.getElementById(botoesNAV[2])?.classList.add("active")
    }
    if (path.includes("config")) {
        document.getElementById(botoesNAV[3])?.classList.add("active")
    }
}