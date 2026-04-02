import { abrirMenu, usuarioEhProprietario } from "../js/menu.js";
import { initCadastroFuncionario } from "../js/cadastrousuario.js";
import { initGerenciarFuncionarios } from "../js/gerenciarfuncionarios.js";
import { initEditarOwner } from "../js/editarcontaOwner.js";
import { retiraCssJsEditarFuncionario } from "../js/editarfuncionarios.js";
import { initEditarTelaInicial } from "../js/editartelainicial.js";
import { getCookie, setCookie, deleteCookie, popCookie } from './API_JS/api.js';

let urlAtual = null;
document.addEventListener("click", handleClick);

window.addEventListener("load", () => {
     console.log('[CONFIG] load disparou');
    console.log('[CONFIG] url_anterior cookie:', document.cookie);
    const urlAnterior = decodeURIComponent(popCookie('url_anterior') ?? '');
    console.log('[CONFIG] urlAnterior:', urlAnterior);
    console.log('[CONFIG] location.href:', window.location.href);

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

    const paginasConfig = [
        "cadastro-funcionario",
        "gerenciar-funcionarios",
        "editar-conta",
        "editar-tela-inicial",
    ];

    const estaEmPaginaConfig = paginasConfig.some((p) => urlAtual.includes(p));
    if (estaEmPaginaConfig) {
        window.location.replace('/home');
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
    await trocarPagina("editar-proprietario", "editarcontaOwner", "editar-conta");
    retiraCssJsEditarFuncionario();
    initEditarOwner();
  }

  if (menuItem?.dataset.menu === "item-tela-inicial") {
    await trocarPagina("editar-tela-inicial", "editartelainicial", "editar-tela-inicial");
    retiraCssJsEditarFuncionario();
    initEditarTelaInicial();
  }
}

async function trocaModais() {
  const configMenu = document.querySelector(".corpoConfigOwner");
  const menu = document.querySelector(".corpoMenu");
  const layout = document.querySelector(".layout");

  if (!configMenu && menu) {
    menu.classList.add("fechado");
    layout.classList.add("sem-menu");
    await new Promise((resolve) => setTimeout(resolve, 300));
    menu.remove();

    await abrirConfigMenu();

    layout.classList.remove("sem-menu");
    const novoConfig = document.querySelector(".corpoConfigOwner");
    novoConfig?.classList.add("aberto");
    initCadastroFuncionario();

  } else if (configMenu) {
    configMenu.classList.remove("aberto");
    configMenu.classList.add("fechado");
    layout.classList.add("sem-menu");
    await new Promise((resolve) => setTimeout(resolve, 300));
    configMenu.remove();

    retiraCssJsEditarFuncionario();
    document.querySelector("#css-config")?.remove();

    const urlAnterior = getCookie("url_anterior") || "/home";
    document.querySelector(".containerConfigOwner")?.remove();
    history.pushState({}, "", urlAnterior);
    document.querySelector(".principal").style.display = "block";

    await abrirMenu();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        layout.classList.remove("sem-menu");
      });
    });
  }
}

async function abrirConfigMenu() {
  urlAtual = window.location.pathname;
  document.cookie = `url_anterior=${encodeURIComponent(window.location.href)}; path=/; SameSite=Lax`;
  const configExistente = document.querySelector(".corpoConfigOwner");
  const containerPrincipal = document.querySelector(".principal");
  if (configExistente) configExistente.remove();

  const response = await fetch("/configmenu");
  const data = await response.text();
  containerPrincipal.style.display = "none";
  document.querySelector(".layout").insertAdjacentHTML("afterbegin", data);

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

  await trocarPagina("cadastrousuario", "cadastrousuario", "cadastro-funcionario");
  initCadastroFuncionario();
}

async function trocarPagina(blade, css, url) {
  
  document.querySelector(".containerConfigOwner")?.remove();
  document.querySelector("#css-config")?.remove();

  const [responseHTML, responseCSS] = await Promise.all([
    fetch(`/${blade}`),
    fetch(`/www.sewfy/resources/css/${css}.css`),
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