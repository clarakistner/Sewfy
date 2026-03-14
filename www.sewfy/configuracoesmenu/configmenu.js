import { abrirMenu, usuarioEhProprietario } from "../menu/menu.js";
import { initCadastroFuncionario } from "../cadastrousuario/cadastrousuario.js";
import { initGerenciarFuncionarios } from "../funcionarios/gerenciarfuncionarios/gerenciarfuncionarios.js";
import { initEditarOwner } from "../editarcontaOwner/editarcontaOwner.js";

import { retiraCssJsEditarFuncionario } from "../funcionarios/editarfuncionarios/editarfuncionarios.js";
let urlAtual = null;
document.addEventListener("click", handleClick);

window.addEventListener("load", () => {
  const urlAnterior = sessionStorage.getItem("urlAnterior");
  const urlAtual = window.location.pathname;

  const paginasConfig = [
    "cadastro-funcionario",
    "gerenciar-funcionarios",
    "editar-conta",
    "editar-tela-inicial",
  ];

  const estaEmPaginaConfig = paginasConfig.some((p) => urlAtual.includes(p));

  if (estaEmPaginaConfig) {
    window.location.replace(urlAnterior || "/www.sewfy/home");
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
    await trocarPagina("cadastrousuario", "cadastrousuario", "cadastro-funcionario");
    
    retiraCssJsEditarFuncionario();
    initCadastroFuncionario();
  }

  if (menuItem?.dataset.menu === "item-gerenciar") {
    await trocarPagina("funcionarios/gerenciarfuncionarios", "gerenciarfuncionarios", "gerenciar-funcionarios");

    initGerenciarFuncionarios();
  }

  if (menuItem?.dataset.menu === "item-editar-conta") {
    await trocarPagina("editarcontaOwner", "editarcontaOwner", "editar-conta");
    
    retiraCssJsEditarFuncionario();
    initEditarOwner();
  }

  if (menuItem?.dataset.menu === "item-tela-inicial") {
    await trocarPagina("editartelainicial", "editartelainicial", "editar-tela-inicial");
    await trocarPagina("editartelainicial", "editar-tela-inicial");
    
    retiraCssJsEditarFuncionario();
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
    document.querySelector("#js-config")?.remove();

    const urlAnterior = sessionStorage.getItem("urlAnterior") || "/www.sewfy/home";
    document.querySelector(".containerConfigOwner")?.remove();
    history.pushState({}, "", urlAnterior);
    sessionStorage.removeItem("urlAnterior");
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
  sessionStorage.setItem("urlAnterior", urlAtual);
  const configExistente = document.querySelector(".corpoConfigOwner");
  const containerPrincipal = document.querySelector(".principal");
  if (configExistente) configExistente.remove();

  const response = await fetch("/www.sewfy/configuracoesmenu/index.html");
  const data = await response.text();
  containerPrincipal.style.display = "none";
  document.querySelector(".layout").insertAdjacentHTML("afterbegin", data);

  const empresaId = sessionStorage.getItem("empresa_id");
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

async function trocarPagina(caminho, nomeArquivo, url) {
  const containerConfig = document.querySelector(".containerConfigOwner");

  const [responseHTML, responseCSS] = await Promise.all([
    fetch(`/www.sewfy/${caminho}/index.html`),
    fetch(`/www.sewfy/${caminho}/${nomeArquivo}.css`),
  ]);

  const [dataContainer, cssText] = await Promise.all([
    responseHTML.text(),
    responseCSS.text(),
  ]);

  containerConfig?.remove();
  document.querySelector(".layout").insertAdjacentHTML("beforeend", dataContainer);

  const style = document.createElement("style");
  style.id = "css-config";
  style.textContent = cssText;

  const script = document.createElement("script");
  script.id = "js-config";
  script.type = "module";
  script.src = `/www.sewfy/${caminho}/${nomeArquivo}.js`;

  document.querySelector("#css-config")?.remove();
  document.querySelector("#js-config")?.remove();

  document.body.appendChild(script);
  document.head.appendChild(style);

  history.pushState({}, "", `/www.sewfy/${url}`);
}