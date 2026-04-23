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

// Mapa centralizado: página → css + função de inicialização
const mapaConfig = {
    "cadastro-funcionario": {
        css:  "cadastrousuario",
        init: () => { retiraCssJsEditarFuncionario(); initCadastroFuncionario(); },
    },
    "funcionarios": {
        css:  "gerenciarfuncionarios",
        init: () => initGerenciarFuncionarios(),
    },
    "editar-conta": {
        css:  "editarcontaOwner",
        init: () => { retiraCssJsEditarFuncionario(); initEditarOwner(); },
    },
    "editar-tela-inicial": {
        css:  "editartelainicial",
        init: () => { retiraCssJsEditarFuncionario(); initEditarTelaInicial(); },
    },
};

let cssExternos = [];
let manifestCache = null;

async function getCssUrl(cssName) {
    const isDev = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (isDev) return `http://localhost:5173/resources/css/${cssName}.css`;

    if (!manifestCache) {
        const res = await fetch("/build/manifest.json");
        manifestCache = await res.json();
    }

    const chave = `resources/css/${cssName}.css`;
    const entry = manifestCache[chave];
    if (entry) return `/build/${entry.file}`;

    return `/resources/css/${cssName}.css`;
}

document.addEventListener("click", handleClick);

window.addEventListener("load", () => {
    // Marca os CSS como "base" APÓS o load, quando o Vite já injetou tudo
    document.querySelectorAll("link[rel='stylesheet']").forEach(link => {
        link.dataset.base = "true";
    });

    const paginaAtual  = window.location.pathname.split("/").pop();
    const urlAnterior  = popCookie('url_anterior') ?? '';

    // Recarregou numa URL de configurações → volta à origem e salva qual página restaurar
    if (paginasConfig.includes(paginaAtual)) {
        const destino = urlAnterior && urlAnterior.startsWith(window.location.origin)
            ? urlAnterior
            : `${window.location.origin}/home`;
        setCookie("reabrirConfig", paginaAtual); // salva a página exata, não "true"
        window.location.replace(destino);
        return;
    }

    // Voltou da origem após reload numa página de config → reabre o menu na página certa
    const paginaParaReabrir = popCookie("reabrirConfig");
    if (paginaParaReabrir && mapaConfig[paginaParaReabrir]) {
        trocaModais(paginaParaReabrir);
        return;
    }

    // Redirecionamento normal
    if (urlAnterior && urlAnterior !== window.location.href) {
        const urlSegura = urlAnterior.startsWith(window.location.origin) ? urlAnterior : '';
        if (urlSegura) {
            window.location.replace(urlSegura);
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
        mapaConfig["cadastro-funcionario"].init();
    } else if (menuItem?.dataset.menu === "item-gerenciar") {
        await trocarPagina("funcionarios", "gerenciarfuncionarios", "funcionarios");
        mapaConfig["funcionarios"].init();
    } else if (menuItem?.dataset.menu === "item-editar-conta") {
        await trocarPagina("editar-conta", "editarcontaOwner", "editar-conta");
        mapaConfig["editar-conta"].init();
    } else if (menuItem?.dataset.menu === "item-tela-inicial") {
        await trocarPagina("editar-tela-inicial", "editartelainicial", "editar-tela-inicial");
        mapaConfig["editar-tela-inicial"].init();
    }
}

// paginaInicial: qual página abrir (padrão: cadastro-funcionario)
export default async function trocaModais(paginaInicial = "cadastro-funcionario") {
    const configMenu = document.querySelector(".corpoConfigOwner");
    const menu       = document.querySelector(".corpoMenu");
    const layout     = document.querySelector(".layout");

    if (!configMenu && menu) {
        const principal = document.querySelector(".principal");
        if (principal) principal.style.visibility = "hidden";

        if (!getCookie("url_anterior")) {
            setCookie("url_anterior", window.location.href);
        }

        // Desabilita todos os CSS sem id (são os do @stack('styles') da página atual)
        cssExternos = Array.from(document.querySelectorAll("link[rel='stylesheet']")).filter(link => {
            const href = link.href || "";
            return !link.id &&
                !href.includes("fonts.googleapis") &&
                !href.includes("fonts.gstatic");
        });
        cssExternos.forEach(link => link.disabled = true);


        menu.classList.add("fechado");
        layout.classList.add("sem-menu");

        await abrirConfigMenu(paginaInicial);

        const novoConfig = document.querySelector(".corpoConfigOwner");
        const container  = document.querySelector(".containerConfigOwner");

        layout.classList.remove("sem-menu");

        if (novoConfig) novoConfig.style.visibility = "visible";
        if (container)  container.style.visibility  = "visible";
        novoConfig?.classList.add("aberto");
        // Restaura visibilidade após o menu de config estar montado
        document.documentElement.style.visibility = "visible";

        // Inicializa a página correta
        mapaConfig[paginaInicial]?.init();

    } else if (configMenu) {
        const principal = document.querySelector(".principal");

        configMenu.remove();
        retiraCssJsEditarFuncionario();
        document.querySelector("#css-config")?.remove();
        document.querySelector("#css-configmenu")?.remove();
        document.querySelector(".containerConfigOwner")?.remove();

        const cookieUrl   = getCookie("url_anterior");
        const urlAnterior = (cookieUrl && cookieUrl !== "null")
            ? decodeURIComponent(cookieUrl)
            : `${window.location.origin}/home`;
        deleteCookie('url_anterior');

        history.pushState({}, "", urlAnterior);

        // Restaura o título com base na URL
        const rotasTitulos = {
            "/home":              "Home",
            "/ordensdeproducao":  "Ordens de Produção",
            "/produtos":          "Produtos",
            "/fornecedores":      "Fornecedores",
            "/estoque":           "Estoque",
            "/contas":            "Contas a Pagar",
        };
        const path = new URL(urlAnterior).pathname;
        document.title = rotasTitulos[path] ?? "Sewfy";

        const menuBlade = document.querySelector(".corpoMenu");
        if (menuBlade) {
            menuBlade.style.display = "";
            menuBlade.classList.remove("fechado");
        }

        layout.classList.remove("sem-menu");

        cssExternos.forEach(link => link.disabled = false);
        cssExternos = [];

        if (principal) {
            principal.style.display    = "block";
            principal.style.visibility = "visible";
        }
    }
}

async function abrirConfigMenu(paginaInicial = "cadastro-funcionario") {
    document.querySelector(".corpoConfigOwner")?.remove();
    document.querySelector("#css-configmenu")?.remove();

    const containerPrincipal = document.querySelector(".principal");
    if (containerPrincipal) containerPrincipal.style.display = "none";

    const menuBlade = document.querySelector(".corpoMenu");
    if (menuBlade) menuBlade.style.display = "none";

	const cssUrl = await getCssUrl("configmenu");

    // Carrega HTML do menu e CSS em paralelo para reduzir delay
    const [respostaMenu] = await Promise.all([
        fetch("/configmenu").then(r => r.text()),
        new Promise((resolve) => {
            const link   = document.createElement("link");
            link.id      = "css-configmenu";
            link.rel     = "stylesheet";
            link.href    = cssUrl;
            link.onload  = resolve;
            link.onerror = resolve;
            document.head.appendChild(link);
        }),
    ]);

    const parser  = new DOMParser();
    const doc     = parser.parseFromString(respostaMenu, "text/html");
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

    const novoConfig = document.querySelector(".corpoConfigOwner");
    if (novoConfig) novoConfig.style.visibility = "hidden";

    // Abre diretamente na página correta
    const config = mapaConfig[paginaInicial] ?? mapaConfig["cadastro-funcionario"];
    await trocarPagina(paginaInicial, config.css, paginaInicial);
}

async function trocarPagina(blade, css, url) {
    document.querySelector(".containerConfigOwner")?.remove();
    document.querySelector("#css-config")?.remove();

	const cssUrl = await getCssUrl(css);

    // Carrega CSS e HTML em paralelo para reduzir delay
    const [dataContainer] = await Promise.all([
        fetch(`/${blade}`).then(r => r.text()),
        new Promise((resolve) => {
            const link   = document.createElement("link");
            link.id      = "css-config";
            link.rel     = "stylesheet";
            link.href    = cssUrl;
            link.onload  = resolve;
            link.onerror = resolve;
            document.head.appendChild(link);
        }),
    ]);

    const parser   = new DOMParser();
    const doc      = parser.parseFromString(dataContainer, "text/html");
    const conteudo = doc.querySelector(".containerConfigOwner");

    const titulo = doc.querySelector("title");
    if (titulo) document.title = titulo.textContent;

    if (conteudo) {
        document.querySelector(".layout").insertAdjacentHTML("beforeend", conteudo.outerHTML);
    }

    if (url) history.pushState({}, "", `/${url}`);
}
