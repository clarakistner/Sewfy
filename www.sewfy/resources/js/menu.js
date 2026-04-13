import { getCookie, setCookie, deleteCookie, popCookie, deleteAllCookies } from "./API_JS/api.js";
import { API, getBaseUrl } from "./API_JS/api.js";

if (!window.api) {
    window.BASE_URL = getBaseUrl();
    window.api = new API();
}
export function abrirMenu() {
    
    const empresaId = getCookie("empresa_id") || null;
    const urlBase = getBaseUrl() || window.BASE_URL;

    return Promise.all([
        fetch(`${urlBase}/menu`).then((res) => res.text()),
        window.api.get("/modulos-usuario"),
        empresaId
            ? window.api.get(`/adm/empresa/nome/${empresaId}`)
            : Promise.resolve(null),
    ])
        .then(([html, banco, empresaResp]) => {
            document
                .querySelector(".layout")
                .insertAdjacentHTML("afterbegin", html);

            const empresasIdsRaw =decodeURIComponent(getCookie("empresas_ids")) || "";
            const empresasIds = empresasIdsRaw ? empresasIdsRaw.split(",") : [];

            const btnTrocar = document.getElementById("btn-trocar-empresa");
            if (btnTrocar && empresasIds.length > 1) {
                btnTrocar.style.display = "flex";
            }

            document.querySelectorAll(".nav-item").forEach((item) => {
                const modulo = item.dataset.menu;
                if (Array.from(banco.modulos).includes(modulo)) {
                    item.style.display = "flex";
                }
            });

            if (empresaResp) {
                const nomeEmpresa = empresaResp.EMP_NOME ?? "";
                const header = document.querySelector(".sidebar-header");
                if (header && nomeEmpresa) {
                    header.innerHTML += `<p class="sidebar-empresa">${nomeEmpresa}</p>`;
                }
            }

            document.querySelectorAll(".nav-btn[data-menu]").forEach((btn) => {
                btn.addEventListener("click", () => {
                    const item = document.getElementById(btn.dataset.menu);
                    const isOpen = item.classList.contains("open");
                    document
                        .querySelectorAll(".nav-item.open")
                        .forEach((el) => el.classList.remove("open"));
                    if (!isOpen) item.classList.add("open");
                });
            });

            ativarModuloAtual();
            document.body.classList.add("loaded");
        })
        .catch((e) => console.error("[MENU] Erro ao carregar menu:", e));
}
export async function usuarioEhProprietario() {
    try {
        const response = await window.api.get(
            "/empresa-usuario/ehproprietario",
        );
        return response.proprietario;
    } catch (error) {
        console.error("Erro ao verificar se o usuário é proprietário:", error);
        return false;
    }
}

const urlBase = getBaseUrl() || window.BASE_URL;

const rotas = {
    "btn-trocar-empresa": `${urlBase}/selecionar-empresa`,
    "sub-clientes": `${urlBase}/faturamento/clientes`,
    "sub-pedidos-venda": `${urlBase}/faturamento/pedidosVenda`,
    "sub-notas-fiscais": `${urlBase}/faturamento/notasFiscais`,
    "sub-ordens-servico": `${urlBase}/faturamento/ordensServico`,
    "sub-vendedores": `${urlBase}/faturamento/vendedores`,
    "sub-contas-pagar": `${urlBase}/contas`,
    "sub-contas-receber": `${urlBase}/financeiro/contasReceber`,
    "sub-caixas-bancos": `${urlBase}/financeiro/caixasBancos`,
    "sub-remessas": `${urlBase}/financeiro/remessas`,
    "sub-comissoes": `${urlBase}/financeiro/comissoes`,
    "sub-cad-produtos": `${urlBase}/produtos`,
    "sub-cad-fornecedores": `${urlBase}/fornecedores`,
    "sub-ordens-producao": `${urlBase}/ordensdeproducao`,
    "sub-estoque": `${urlBase}/estoque`,
    "sub-relatorios": `${urlBase}/relatorios`,
    "btn-logout": `${urlBase}/login`,
    logo: `${urlBase}/home`,
};

document.addEventListener("click", async (e) => {
    const id = e.target.closest("[id]")?.id;
    if (!id) return;

    if (rotas[id]) {
        if (id === "btn-logout") {
            await window.api.post("/auth/logout");
            deleteAllCookies();
            window.location.replace(rotas[id]);
        } else {
            window.location.href = rotas[id];
        }
    }
});

function ativarModuloAtual() {
    const path = window.location.pathname;

    const mapa = [
        {
            modulo: "item-faturamento",
            paths: [
                "faturamento",
                "clientes",
                "pedidosVenda",
                "notasFiscais",
                "ordensServico",
                "vendedores",
            ],
        },
        {
            modulo: "item-financeiro",
            paths: [
                "financeiro",
                "contaspagar",
                "contasReceber",
                "caixasBancos",
                "remessas",
                "comissoes",
            ],
        },
        { modulo: "item-compras", paths: ["compras"] },
        {
            modulo: "item-producao",
            paths: ["produtos", "fornecedores", "ordensdeproducao", "estoque"],
        },
        { modulo: "item-relatorios", paths: ["relatorios"] },
        { modulo: "item-rh", paths: ["rh"] },
    ];

    mapa.forEach(({ modulo, paths }) => {
        if (paths.some((p) => path.includes(p))) {
            document.getElementById(modulo)?.classList.add("open");

            document
                .querySelectorAll(`#${modulo} .submenu-btn`)
                .forEach((btn) => {
                    if (path.includes(btn.dataset.path)) {
                        btn.classList.add("active");
                    }
                });
        }
    });
}

window.addEventListener('pageshow', (event) => {
    const token = getCookie('token') 
    
    if (event.persisted || !token) {
        window.location.replace(`${getBaseUrl()}/login`)
    }
})

window.addEventListener("DOMContentLoaded", () => {
    abrirMenu();
});
