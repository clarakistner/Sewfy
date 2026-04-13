import "./API_JS/api.js";
import { getBaseUrl, deleteCookie } from "./API_JS/api.js";

const url      = getBaseUrl();
const botoesNAV = [
    "btn-home",
    "btn-cadastro",
    "btn-relatorio",
    "btn-config",
    "btn-logout"
];

// Menu já vem do Blade — só ativa o botão e marca como loaded
document.addEventListener("DOMContentLoaded", () => {
    ativarBotaoAtual();
    document.body.classList.add('loaded');
});

document.addEventListener("click", (e) => {
    if (e.target.id === botoesNAV[0]) irParaPagina(0);
    if (e.target.id === botoesNAV[1]) irParaPagina(1);
    if (e.target.id === botoesNAV[2]) irParaPagina(2);
    if (e.target.id === botoesNAV[3]) irParaPagina(3);
    if (e.target.id === botoesNAV[4]) irParaPagina(4);
});

function irParaPagina(botao) {
    switch (botao) {
        case 0: window.location.href = `${url}/home-adm`;    break;
        case 1: window.location.href = `${url}/cadastro-empresa`; break;
        case 2: window.location.href = `${url}/relatorios-adm`;   break;
        case 3: window.location.href = `${url}/config-adm`;  break;
        case 4:
            deleteCookie('token');
            window.location.replace(`${url}/login-adm`);
            break;
    }
}

function ativarBotaoAtual() {
    const path = window.location.pathname;

    if (path.includes("home-adm"))   document.getElementById(botoesNAV[0])?.classList.add("active");
    if (path.includes("cadastro"))   document.getElementById(botoesNAV[1])?.classList.add("active");
    if (path.includes("relatorio"))  document.getElementById(botoesNAV[2])?.classList.add("active");
    if (path.includes("config"))     document.getElementById(botoesNAV[3])?.classList.add("active");
}