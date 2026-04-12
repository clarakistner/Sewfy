import { abrirMenu, usuarioEhProprietario } from "../js/menu.js";
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
    deleteCookie('url_anterior')
    if (urlAnterior && urlAnterior !== window.location.href) {
        const urlSegura = urlAnterior.startsWith(window.location.origin)
            ? urlAnterior
            : '';
        if (urlSegura) {
            window.location.replace(urlSegura);
            return;
        }
    }

    const urlAtual = window.location.pathname;
    const paginaAtual = urlAtual.split("/").pop();
    const estaEmPaginaConfig = paginasConfig.includes(paginaAtual);

    if (estaEmPaginaConfig) {
        abrirConfigMenu().then(() => {
            switch (paginaAtual) {
                case "cadastro-funcionario":
                    initCadastroFuncionario();
                    break;
                case "funcionarios":
                    initGerenciarFuncionarios();
                    break;
                case "editar-conta":
                    initEditarOwner();
                    break;
                case "editar-tela-inicial":
                    initEditarTelaInicial();
                    break;
            }
        });
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
    const menu = document.querySelector(".corpoMenu");
    const layout = document.querySelector(".layout");

    if (!configMenu && menu) {
    const principal = document.querySelector(".principal");
    if (principal) principal.style.visibility = "hidden";

    if (!getCookie("url_anterior")) {
        document.cookie = `url_anterior=${window.location.href}; path=/; SameSite=Lax`;
    }

    menu.classList.add("fechado");
    layout.classList.add("sem-menu");
    await new Promise((resolve) => layout.addEventListener("transitionend", resolve, { once: true }));
    menu.remove();

    await abrirConfigMenu();

    const novoConfig = document.querySelector(".corpoConfigOwner");
    const container = document.querySelector(".containerConfigOwner");

    if (novoConfig) novoConfig.style.visibility = "hidden";
    if (container) container.style.visibility = "hidden";

    layout.classList.remove("sem-menu");
    await new Promise((resolve) => layout.addEventListener("transitionend", resolve, { once: true }));

    if (novoConfig) novoConfig.style.visibility = "visible";
    if (container) container.style.visibility = "visible";
    novoConfig?.classList.add("aberto");
    initCadastroFuncionario();
} else if (configMenu) {
        const principal = document.querySelector(".principal");
        if (principal) principal.style.visibility = "hidden";

        configMenu.classList.remove("aberto");
        configMenu.classList.add("fechado");
        layout.classList.add("sem-menu");
        await new Promise((resolve) => layout.addEventListener("transitionend", resolve, { once: true }));
        configMenu.remove();

        retiraCssJsEditarFuncionario();
        document.querySelector("#css-config")?.remove();
        document.querySelector(".containerConfigOwner")?.remove();

        const urlAnterior = getCookie("url_anterior") || "/home";
        history.pushState({}, "", urlAnterior);
        deleteCookie('url_anterior')
        principal.style.display = "block";

        await abrirMenu();

        const novoMenu = document.querySelector(".corpoMenu");
        if (novoMenu) novoMenu.style.visibility = "hidden";

        layout.classList.remove("sem-menu");
        await new Promise((resolve) => layout.addEventListener("transitionend", resolve, { once: true }));

        principal.style.visibility = "visible";
        if (novoMenu) novoMenu.style.visibility = "visible";
    }
}
async function abrirConfigMenu() {
    urlAtual = window.location.pathname;

    const configExistente = document.querySelector(".corpoConfigOwner");
    const containerPrincipal = document.querySelector(".principal");
    if (configExistente) configExistente.remove();

    const response = await fetch("/configmenu");
    const data = await response.text();
    containerPrincipal.style.display = "none";
    document.querySelector(".layout").insertAdjacentHTML("afterbegin", data);

    const novoConfig = document.querySelector(".corpoConfigOwner");
    if (novoConfig) novoConfig.style.visibility = "hidden";

    const empresaId = getCookie("empresa_id") || null;
    if (empresaId) {
        try {
            const resp = await window.api.get(`/adm/empresa/nome/${empresaId}`);
            const nomeEmpresa = resp.EMP_NOME ?? "";
            const header = document.querySelector(".sidebar-header");
            if (header && nomeEmpresa) {
                header.innerHTML += `<p class="sidebar-empresa">${nomeEmpresa}</p>`;
            }
        } catch (e) {
            console.warn("[CONFIG MENU] Não foi possível carregar nome da empresa:", e);
        }
    }

    await trocarPagina("cadastro-funcionario", "cadastrousuario", "cadastro-funcionario");
    initCadastroFuncionario();
}

async function trocarPagina(blade, css, url) {
    document.querySelector(".containerConfigOwner")?.remove();
    document.querySelector("#css-config")?.remove();

    const [responseHTML, responseCSS] = await Promise.all([
        fetch(`/${blade}`),
        fetch(`http://localhost:5173/resources/css/${css}.css`),
    ]);

    const [dataContainer, cssText] = await Promise.all([
        responseHTML.text(),
        responseCSS.text(),
    ]);

    document.querySelector(".layout").insertAdjacentHTML("beforeend", dataContainer);

    const style = document.createElement("style");
    style.id = "css-config";
    style.textContent = cssText;
    document.head.appendChild(style);

    if (url) history.pushState({}, "", `/${url}`);
}