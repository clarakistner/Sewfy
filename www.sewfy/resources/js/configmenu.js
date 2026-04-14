import { usuarioEhProprietario } from "../js/menu.js";
import { initCadastroFuncionario } from "../js/cadastrousuario.js";
import { initGerenciarFuncionarios } from "../js/gerenciarfuncionarios.js";
import { initEditarOwner } from "../js/editarcontaOwner.js";
import { retiraCssJsEditarFuncionario } from "../js/editarfuncionarios.js";
import { initEditarTelaInicial } from "../js/editartelainicial.js";
import { getCookie, setCookie, deleteCookie, popCookie, getBaseUrl } from './API_JS/api.js';

const paginasConfig = [
    "cadastro-funcionario",
    "funcionarios",
    "editar-conta",
    "editar-tela-inicial",
];


function getCssBaseUrl() {
    const isDev = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    return isDev ? "http://localhost:5173/resources/css" : "/resources/css";
}

document.addEventListener("click", handleClick);

window.addEventListener("load", () => {
    const urlAnterior = popCookie('url_anterior') ?? '';

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
    } else if (menuItem?.dataset.menu === "item-cadastros") {
        await trocarPagina("cadastro-funcionario", "cadastrousuario", "cadastro-funcionario");
        retiraCssJsEditarFuncionario();
        initCadastroFuncionario();
    } else if (menuItem?.dataset.menu === "item-gerenciar") {
        await trocarPagina("funcionarios", "gerenciarfuncionarios", "funcionarios");
        initGerenciarFuncionarios();
    } else if (menuItem?.dataset.menu === "item-editar-conta") {
        await trocarPagina("editar-conta", "editarcontaOwner", "editar-conta");
        retiraCssJsEditarFuncionario();
        initEditarOwner();
    } else if (menuItem?.dataset.menu === "item-tela-inicial") {
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
            setCookie("url_anterior", window.location.href);
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
        deleteCookie('url_anterior');

        history.pushState({}, "", urlAnterior);

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
    document.querySelector(".corpoConfigOwner")?.remove();
    document.querySelector("#css-configmenu")?.remove();

    const containerPrincipal = document.querySelector(".principal");
    if (containerPrincipal) containerPrincipal.style.display = "none";

    const menuBlade = document.querySelector(".corpoMenu");
    if (menuBlade) menuBlade.style.display = "none";

    const response = await fetch("/configmenu");
    const data     = await response.text();

    const parser  = new DOMParser();
    const doc     = parser.parseFromString(data, "text/html");
    const corpo   = doc.querySelector(".corpoConfigOwner");

    if (corpo) {
        document.querySelector(".layout").insertAdjacentHTML("afterbegin", corpo.outerHTML);
    }

    const nomeEmpresaEl  = document.querySelector(".corpoMenu .sidebar-subtitle");
    const nomeEmpresa    = nomeEmpresaEl?.textContent || "";
    const empresasIdsRaw = decodeURIComponent(getCookie("empresas_ids") || "");
    const empresasIds    = empresasIdsRaw ? empresasIdsRaw.split(",") : [];
    const urlBase        = getBaseUrl() || window.BASE_URL;

    const configNomeEl = document.getElementById("config-nome-empresa");
    if (configNomeEl && nomeEmpresa) configNomeEl.textContent = nomeEmpresa;

    const btnTrocar = document.getElementById("btn-trocar-empresa-config");
    if (btnTrocar && empresasIds.length > 1) {
        btnTrocar.style.display = "flex";
        btnTrocar.addEventListener("click", () => {
            window.location.href = `${urlBase}/selecionar-empresa`;
        });
    }

    const link  = document.createElement("link");
    link.id     = "css-configmenu";
    link.rel    = "stylesheet";
    link.href   = `${getCssBaseUrl()}/configmenu.css`;
    document.head.appendChild(link);

    const novoConfig = document.querySelector(".corpoConfigOwner");
    if (novoConfig) novoConfig.style.visibility = "hidden";

    await trocarPagina("cadastro-funcionario", "cadastrousuario", "cadastro-funcionario");
    initCadastroFuncionario();
}

async function trocarPagina(blade, css, url) {
    document.querySelector(".containerConfigOwner")?.remove();
    document.querySelector("#css-config")?.remove();

    await new Promise((resolve) => {
        const link   = document.createElement("link");
        link.id      = "css-config";
        link.rel     = "stylesheet";
        link.href    = `${getCssBaseUrl()}/${css}.css`;
        link.onload  = resolve;
        link.onerror = resolve;
        document.head.appendChild(link);
    });

    const responseHTML  = await fetch(`/${blade}`);
    const dataContainer = await responseHTML.text();

    const parser   = new DOMParser();
    const doc      = parser.parseFromString(dataContainer, "text/html");
    const conteudo = doc.querySelector(".containerConfigOwner");

    if (conteudo) {
        document.querySelector(".layout").insertAdjacentHTML("beforeend", conteudo.outerHTML);
    }

    if (url) history.pushState({}, "", `/${url}`);
}