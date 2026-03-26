// CHAMA O MENU
export function abrirMenu() {
  const empresaId = sessionStorage.getItem("empresa_id");

  // Busca tudo em paralelo
  Promise.all([
    fetch("/www.sewfy/menu/index.html").then((res) => res.text()),
    window.api.get("/modulos-usuario"),
    empresaId
      ? window.api.get(`/adm/empresa/nome/${empresaId}`)
      : Promise.resolve(null),
  ])
    .then(([html, banco, empresaResp]) => {
      document.querySelector(".layout").insertAdjacentHTML("afterbegin", html);
      // Exibe ícone de trocar empresa se tiver mais de uma
      const empresasIds = JSON.parse(
        sessionStorage.getItem("empresas_ids") || "[]",
      );
      const btnTrocar = document.getElementById("btn-trocar-empresa");
      if (btnTrocar && empresasIds.length > 1) {
        btnTrocar.style.display = "flex";
      }
      // Exibe módulos
      document.querySelectorAll(".nav-item").forEach((item) => {
        const modulo = item.dataset.menu;
        if (Array.from(banco.modulos).includes(modulo)) {
          item.style.display = "flex";
        }
      });

      // Exibe nome da empresa
      if (empresaResp) {
        const nomeEmpresa = empresaResp.EMP_NOME ?? "";
        const header = document.querySelector(".sidebar-header");
        if (header && nomeEmpresa) {
          header.innerHTML += `<p class="sidebar-empresa">${nomeEmpresa}</p>`;
        }
      }

      // Toggle dos submenus
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
    const response = await window.api.get("/empresa-usuario/ehproprietario");
    return response.proprietario;
  } catch (error) {
    console.error("Erro ao verificar se o usuário é proprietário:", error);
    return false;
  }
}

// NAVEGAÇÃO DOS SUBMENUS
const rotas = {
  // Header
  "btn-trocar-empresa": "/www.sewfy/selecionar-empresa",
  // Faturamento
  "sub-clientes": "/www.sewfy/faturamento/clientes",
  "sub-pedidos-venda": "/www.sewfy/faturamento/pedidosVenda",
  "sub-notas-fiscais": "/www.sewfy/faturamento/notasFiscais",
  "sub-ordens-servico": "/www.sewfy/faturamento/ordensServico",
  "sub-vendedores": "/www.sewfy/faturamento/vendedores",

  // Financeiro
  "sub-contas-pagar": "/www.sewfy/contaspagar/todasContas",
  "sub-contas-receber": "/www.sewfy/financeiro/contasReceber",
  "sub-caixas-bancos": "/www.sewfy/financeiro/caixasBancos",
  "sub-remessas": "/www.sewfy/financeiro/remessas",
  "sub-comissoes": "/www.sewfy/financeiro/comissoes",

  // Produção
  "sub-cad-produtos": "/www.sewfy/produtos/todosProdutos",
  "sub-cad-fornecedores": "/www.sewfy/fornecedores/todosFornecedores",
  "sub-ordens-producao": "/www.sewfy/ordensdeproducao/gerenciar",
  "sub-estoque": "/www.sewfy/estoque",

  // Relatórios
  "sub-relatorios": "/www.sewfy/relatorios",

  // Footer
  "btn-logout": "/www.sewfy/login",
  logo: "/www.sewfy/home",
};

document.addEventListener("click", async (e) => {
  const id = e.target.closest("[id]")?.id;
  if (!id) return;

  if (rotas[id]) {
    if (id === "btn-logout") {
      await window.api.post("/auth/logout");
      sessionStorage.removeItem("token");
      window.location.replace(rotas[id]);
    } else {
      window.location.href = rotas[id];
    }
  }
});

// MARCA O MÓDULO E SUBMENU ATIVO COM BASE NA URL ATUAL
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

      document.querySelectorAll(`#${modulo} .submenu-btn`).forEach((btn) => {
        if (path.includes(btn.dataset.path)) {
          btn.classList.add("active");
        }
      });
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  abrirMenu();
});
