// CHAMA O MENU 
fetch('/Sewfy/view/menu/menu.html')
    .then(response => response.text())
    .then(data => {
        document.body.insertAdjacentHTML("afterbegin", data)
        ativarBotaoAtual()
        document.body.classList.add('loaded')
    });


// BOTÕES DO MENU
const botoesNAV = [
    "btn-produtos",
    "btn-fornecedores",
    "btn-ordem-producao",
    "btn-contas-pagar",
    "logo",
    "logout"
];

// ADICIONA FUNÇÃO AOS BOTÕES DO MENU
document.addEventListener("click", (e) => {
    if (e.target.id === botoesNAV[0]) {
        irParaPagina(0)
    }
    if (e.target.id === botoesNAV[1]) {
        irParaPagina(1)
    }
    if (e.target.id === botoesNAV[2]) {
        irParaPagina(2)
    }
    if (e.target.id === botoesNAV[3]) {
        irParaPagina(3)
    }
    if (e.target.id === botoesNAV[4]) {
        irParaPagina(4)
    }
    if (e.target.id === botoesNAV[5]) {
        irParaPagina(5)
    }

});


// VAI PARA AS PÁGINAS
function irParaPagina(botao) {

    switch (botao) {
        case 0:
            window.location.href = "/Sewfy/view/produtos/todosProdutos/todosProdutos.html"
            break
        case 1:
            window.location.href = "/Sewfy/view/fornecedores/todosFornecedores/todosFornecedores.html"
            break
        case 2:
            window.location.href = "/Sewfy/view/ordensdeproducao/gerenciar/gerenciarOrdensDeProducao.html"
            break
        case 3:
            window.location.href = "/Sewfy/view/contas/todasContas/todasContas.html"
            break
        case 4:
            window.location.href = "/Sewfy/view/home/home.html"
            break
        case 5:
            window.location.replace("/Sewfy/view/login/login.html")
            break
    }
}


// NOVA FUNÇÃO
function ativarBotaoAtual() {
    const path = window.location.pathname

    if (path.includes("produtos")) {
        document.getElementById(botoesNAV[0])?.classList.add("active")
    }

    if (path.includes("fornecedores")) {
        document.getElementById(botoesNAV[1])?.classList.add("active")
    }

    if (path.includes("ordens")) {
        document.getElementById(botoesNAV[2])?.classList.add("active")
    }

    if (path.includes("contas")) {
        document.getElementById(botoesNAV[3])?.classList.add("active")
    }
}
