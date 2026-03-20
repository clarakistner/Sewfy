window.addEventListener("load", () => {
  const urlAnterior = localStorage.getItem("urlAnterior");
  if (urlAnterior && urlAnterior !== window.location.pathname) {
    localStorage.removeItem("urlAnterior");
    window.location.replace(urlAnterior);
  }
});

async function carregarHome() {
  try {
    const res = await window.api.get("/home/config");
    const config = res.config;
    const main = document.querySelector("main");
    main.innerHTML = "";

    if (config.EXIBIR_ORDENS) {
      await renderizarOrdens(main, config.FILTRO_ORDENS);
    }

    if (config.EXIBIR_CONTAS_PAGAR) {
      await renderizarContasPagar(main, config.FILTRO_CONTAS_PAGAR);
    }

  } catch (error) {
    console.error("Erro ao carregar home:", error);
  }
}

async function renderizarOrdens(main, filtro) {
  const secao = document.createElement("section");
  secao.classList.add("secao-ordens");

  const titulo = filtro === "aberta"  ? "Ordens de Produção Abertas"
               : filtro === "fechada" ? "Ordens de Produção Fechadas"
               : "Ordens de Produção";

  secao.innerHTML = `
    <div class="titulo-secao">
      <div class="barra"></div>
      <h2>${titulo}</h2>
    </div>
    <div class="lista-ordens-home"></div>
  `;
  main.appendChild(secao);

  try {
    const res = await window.api.get("/ordemdeproducao/listar");
    let ordens = res.ordensProducao ?? [];

    // Aplica filtro
    if (filtro === "aberta")  ordens = ordens.filter(op => !op.datae);
    if (filtro === "fechada") ordens = ordens.filter(op => !!op.datae);

    const lista = secao.querySelector(".lista-ordens-home");

    if (ordens.length === 0) {
      lista.innerHTML = `<div class="vazio">Nenhuma ordem encontrada</div>`;
      return;
    }

    for (const op of ordens) {
      const nomeProduto  = await retornaNomeProduto(op.prodIDOP);
      const dataAbertura = op.dataa ? new Date(op.dataa).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : "-";
      const statusTexto  = !op.datae ? "Aberta" : "Fechada";

      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <div class="linha">
          <div class="ordem">
            <div class="label">Ordem de Produção</div>
            <div class="codigoOP">${op.idOP}</div>
            <span class="status">
              <span class="material-symbols-outlined icone-ampulheta">hourglass</span>
              ${statusTexto}
            </span>
          </div>
          <div>
            <div class="label">Produto</div>
            <div>${nomeProduto ?? "-"}</div>
          </div>
          <div>
            <div class="label">Quantidade</div>
            <div>${parseInt(op.qtdOP).toLocaleString("pt-BR")}</div>
          </div>
          <div>
            <div class="label">Data de Abertura</div>
            <div>${dataAbertura}</div>
          </div>
          <div>
            <button class="btn-verop" data-id="${op.idOP}">Ver Ordem de Produção</button>
          </div>
        </div>
      `;
      lista.appendChild(card);
    }

  } catch (error) {
    console.error("Erro ao buscar ordens:", error);
  }
}

async function renderizarContasPagar(main, filtro) {
  const secao = document.createElement("section");
  secao.classList.add("secao-contas");

  const titulo = filtro === "pendente" ? "Contas a Pagar Pendentes"
               : filtro === "pago"     ? "Contas a Pagar Pagas"
               : "Contas a Pagar";

  secao.innerHTML = `
    <div class="titulo-secao">
      <div class="barra"></div>
      <h2>${titulo}</h2>
    </div>
    <div class="lista-contas-home"></div>
  `;
  main.appendChild(secao);

  try {
    const params = filtro !== "todos" ? `?status=${filtro}` : "";
    const contas = await window.api.get(`/contas-pagar${params}`);
    const lista  = secao.querySelector(".lista-contas-home");

    if (!Array.isArray(contas) || contas.length === 0) {
      lista.innerHTML = `<div class="vazio">Nenhuma conta encontrada</div>`;
      return;
    }

    contas.forEach(cp => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <div class="linha">
          <div class="ordem">
            <div class="label">Ordem de Produção</div>
            <div class="codigoOP">${cp.op_id ?? "-"}</div>
          </div>
          <div>
            <div class="label">Serviço</div>
            <div>${cp.produto ?? "-"}</div>
          </div>
          <div>
            <div class="label">Fornecedor</div>
            <div>${cp.fornecedor ?? "-"}</div>
          </div>
          <div>
            <div class="label">Vencimento</div>
            <div>${formatarData(cp.vencimento)}</div>
          </div>
          <div>
            <div class="label">Pagamento</div>
            <div>${formatarData(cp.pagamento)}</div>
          </div>
          <div class="${cp.status === "pendente" ? "pendente" : "pago"}">
            <span class="material-symbols-outlined">
              ${cp.status === "pendente" ? "priority_high" : "check_circle"}
            </span>
            ${cp.status === "pendente" ? "PENDENTE" : "PAGO"}
          </div>
        </div>
      `;
      lista.appendChild(card);
    });

  } catch (error) {
    console.error("Erro ao buscar contas:", error);
  }
}

async function retornaNomeProduto(id) {
  try {
    const produto = await window.api.get(`/produtos/${parseInt(id)}`);
    return produto.nome;
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    return "-";
  }
}

function formatarData(data) {
  if (!data) return "-";
  return new Date(data).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

document.addEventListener("DOMContentLoaded", carregarHome);