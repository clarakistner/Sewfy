import { usuarioEhProprietario } from "../js/menu.js";
import { initCadastroFuncionario } from "../js/cadastrousuario.js";
import { initGerenciarFuncionarios } from "../js/gerenciarfuncionarios.js";
import { initEditarOwner } from "../js/editarcontaOwner.js";
import { retiraCssJsEditarFuncionario } from "../js/editarfuncionarios.js";
import { initEditarTelaInicial } from "../js/editartelainicial.js";
import { getCookie, deleteCookie, popCookie } from './API_JS/api.js';

const paginasConfig = [
    "cadastro-funcionario",
    "funcionarios",
    "editar-conta",
    "editar-tela-inicial",
];

let urlAtual = null;

document.addEventListener("click", handleClick);

window.addEventListener("load", () => {
    const urlAnterior = popCookie('url_anterior') ?? '';
    deleteCookie('url_anterior');

    if (urlAnterior && urlAnterior !== window.location.href) {
        const urlSegura = urlAnterior.startsWith(window.location.origin) ? urlAnterior : '';
        if (urlSegura) {
            window.location.replace(urlSegura);
            return;
        }
    }

    const paginaAtual = window.location.pathname.split("/").pop();

    if (paginasConfig.includes(paginaAtual)) {
        switch (paginaAtual) {
            case "cadastro-funcionario": initCadastroFuncionario(); break;
            case "funcionarios":         initGerenciarFuncionarios(); break;
            case "editar-conta":         initEditarOwner(); break;
            case "editar-tela-inicial":  initEditarTelaInicial(); break;
        }
    }
});

async function handleClick(e) {
    const menuItem = e.target.closest("[data-menu]");

    if (e.target.closest("#btn-config") && (await usuarioEhProprietario())) {
        trocaModais();
        const icon = document.getElementById("icon-config");
        icon?.classList.add("girando");
        setTimeout(() => icon?.classList.remove("girando"), 300);
    }

    if (menuItem?.dataset.menu === "item-cadastros") {
        await trocarPagina("cadastro-funcionario", "cadastrousuario", "cadastro-funcionario");
        retiraCssJsEditarFuncionario();
        initCadastroFuncionario();
    }
    if (menuItem?.dataset.menu === "item-gerenciar") {
        await trocarPagina("funcionarios", "gerenciarfuncionarios", "funcionarios");
        initGerenciarFuncionarios();
    }
    if (menuItem?.dataset.menu === "item-editar-conta") {
        await trocarPagina("editar-conta", "editarcontaOwner", "editar-conta");
        retiraCssJsEditarFuncionario();
        initEditarOwner();
    }
    if (menuItem?.dataset.menu === "item-tela-inicial") {
        await trocarPagina("editar-tela-inicial", "editartelainicial", "editar-tela-inicial");
        retiraCssJsEditarFuncionario();
        initEditarTelaInicial();
    }
}

export default async function trocaModais() {
    const configMenu = document.querySelector(".corpoConfigOwner");
    const menu       = document.querySelector(".corpoMenu");
    const layout     = document.querySelector(".layout");

    if (!configMenu && menu) {
        const principal = document.querySelector(".principal");
        if (principal) principal.style.visibility = "hidden";

        if (!getCookie("url_anterior")) {
            document.cookie = `url_anterior=${window.location.href}; path=/; SameSite=Lax`;
        }

        menu.classList.add("fechado");
        layout.classList.add("sem-menu");

        await abrirConfigMenu();

        const novoConfig = document.querySelector(".corpoConfigOwner");
        const container  = document.querySelector(".containerConfigOwner");

        layout.classList.remove("sem-menu");

        if (novoConfig) novoConfig.style.visibility = "visible";
        if (container)  container.style.visibility  = "visible";
        novoConfig?.classList.add("aberto");
        initCadastroFuncionario();

    } else if (configMenu) {
        const principal = document.querySelector(".principal");

        configMenu.remove();
        retiraCssJsEditarFuncionario();
        document.querySelector("#css-config")?.remove();
        document.querySelector("#css-configmenu")?.remove();
        document.querySelector(".containerConfigOwner")?.remove();

        const urlAnterior = getCookie("url_anterior") || "/home";
        history.pushState({}, "", urlAnterior);
        deleteCookie('url_anterior');

        const menuBlade = document.querySelector(".corpoMenu");
        if (menuBlade) {
            menuBlade.style.display = "";
            menuBlade.classList.remove("fechado");
        }

        layout.classList.remove("sem-menu");

        if (principal) {
            principal.style.display    = "block";
            principal.style.visibility = "visible";
        }
    }
}

async function abrirConfigMenu() {
    urlAtual = window.location.pathname;

    document.querySelector(".corpoConfigOwner")?.remove();
    document.querySelector("#css-configmenu")?.remove();

    const containerPrincipal = document.querySelector(".principal");
    if (containerPrincipal) containerPrincipal.style.display = "none";

    const menuBlade = document.querySelector(".corpoMenu");
    if (menuBlade) menuBlade.style.display = "none";

    const response = await fetch("/configmenu");
    const data     = await response.text();

    document.querySelector(".layout").insertAdjacentHTML("afterbegin", data);

    // Carrega CSS via <link> — funciona tanto em dev (Vite) quanto em prod
    const link  = document.createElement("link");
    link.id     = "css-configmenu";
    link.rel    = "stylesheet";
    link.href   = "http://localhost:5173/resources/css/configmenu.css";
    document.head.appendChild(link);

    const novoConfig = document.querySelector(".corpoConfigOwner");
    if (novoConfig) novoConfig.style.visibility = "hidden";

    await trocarPagina("cadastro-funcionario", "cadastrousuario", "cadastro-funcionario");
    initCadastroFuncionario();
}

async function trocarPagina(blade, css, url) {
    document.querySelector(".containerConfigOwner")?.remove();
    document.querySelector("#css-config")?.remove();

    const responseHTML  = await fetch(`/${blade}`);
    const dataContainer = await responseHTML.text();

    const parser   = new DOMParser();
    const doc      = parser.parseFromString(dataContainer, "text/html");
    const conteudo = doc.querySelector(".containerConfigOwner");

    if (conteudo) {
        document.querySelector(".layout").insertAdjacentHTML("beforeend", conteudo.outerHTML);
    }

    // Carrega CSS via <link>
    const link  = document.createElement("link");
    link.id     = "css-config";
    link.rel    = "stylesheet";
    link.href   = `http://localhost:5173/resources/css/${css}.css`;
    document.head.appendChild(link);

    if (url) history.pushState({}, "", `/${url}`);
}