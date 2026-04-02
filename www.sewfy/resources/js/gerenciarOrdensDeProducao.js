
import "../js/menu.js";
import "../js/configmenu.js";
import "../js/modalOrdemDeProducao.js";
import "../js/edicaoOrdemDeProducao.js";
import "../js/API_JS/api.js";

const cacheProdutos = new Map();

let cacheOPs = null;
let cacheProdutosOPs = null;
let timeout;
let carregando = false;
document.addEventListener("input", handleInput);
document.addEventListener("change", handleChange);
document.addEventListener("click", (e) => {
  if (
    e.target.closest(".icone-adicionar-ordem") ||
    e.target.closest(".botao-criar-ordem")
  ) {
    abrirRequisicao();
  }
});
document.addEventListener("DOMContentLoaded", initGerenciarOPs);
function abrirRequisicao() {
  window.location.href = "../criar-ordemdeproducao";
}
async function initGerenciarOPs() {
  const { initTelaCarregamento, removeTelaCarregamento } =
    await import("../js/telacarregamento.js");

  initTelaCarregamento();
  await listarOrdensProducao(null, null);
  removeTelaCarregamento();
}
function handleInput(e) {
  if (e.target.closest("#barraPesquisa")) {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      limparLista();
      await listarOrdensProducao(String(e.target.value), null);
    }, 300);
  }
}

function handleChange(e) {
  if (e.target.closest("#tipos-filtro")) {
    limparLista();
    listarOrdensProducao(null, String(e.target.value));
  }
}

// Busca e organiza a lista do banco
async function buscarEOrganizarOPs() {
  const listaOPsBanco = await window.api.get("/ordemdeproducao/listar");
  let listaOPs = listaOPsBanco.ordensProducao;
  listaOPs.sort((a, b) => {
    const getNum = (str) => parseInt(str.match(/(\d+)$/)[1], 10);
    return getNum(a.idOP) - getNum(b.idOP);
  });
  return listaOPs;
}

// Aplica os filtros de pesquisa e status
function filtrarOPs(listaOPs, valorPesquisa, filtro) {
  if (valorPesquisa) {
    listaOPs = listaOPs.filter((op) => op.idOP.includes(String(valorPesquisa)));
  }
  if (filtro) {
    listaOPs = listaOPs.filter((op) => {
      if (filtro === "abertas") return !op.datae;
      if (filtro === "fechadas") return op.datae;
      return op;
    });
  }
  return listaOPs;
}

// Cria o card de uma OP
async function criarCardOP(op, mapaProdutos) {
  const cardsOrdens = document.createElement("div");
  cardsOrdens.className = "card-ordem";

  const contentOrdem = document.createElement("div");
  contentOrdem.className = "content-ordem";

  contentOrdem.appendChild(criarCabecalhoOP(op));

  const nomeProduto = mapaProdutos.get(op.prodIDOP);
  const dataAbertura = new Date(op.dataa).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
  const dataFechamento = op.datae
    ? new Date(op.datae).toLocaleDateString("pt-BR", { timeZone: "UTC" })
    : "------";

  contentOrdem.appendChild(
    criarInfoOrdem("package_2", "Produto", nomeProduto || "Sem Nome"),
  );
  contentOrdem.appendChild(
    criarInfoOrdem(
      "package_2",
      "Quantidade",
      parseInt(op.qtdOP).toLocaleString("pt-BR"),
    ),
  );
  contentOrdem.appendChild(
    criarInfoOrdem(
      "calendar_month",
      "Data de Abertura",
      dataAbertura || "01/01/2026",
    ),
  );
  contentOrdem.appendChild(
    criarInfoOrdem("calendar_month", "Data de Fechamento", dataFechamento),
  );
  contentOrdem.appendChild(criarBotaoVerOP(op.idOP));
  if (!!op.datae) {
    contentOrdem.classList.add("ordem-fechada");
  }
  cardsOrdens.appendChild(contentOrdem);

  return cardsOrdens;
}

// Cria o cabeçalho do card
function criarCabecalhoOP(op) {
  const ordemCodigoStatus = document.createElement("div");
  ordemCodigoStatus.className = "ordem-codigo-status";

  const labelOrdem = document.createElement("div");
  labelOrdem.className = "label-ordem";
  labelOrdem.textContent = "Ordem de Produção";

  const codigoOrdem = document.createElement("div");
  codigoOrdem.className = "codigo-ordem";
  codigoOrdem.textContent = op.idOP;

  const statusClass = !op.datae ? "aberta" : "fechada";
  const statusTexto = !op.datae ? "Aberta" : "Fechada";
  console.log("DATAE: " + op.datae);

  const statusOrdem = document.createElement("div");
  statusOrdem.className = `status-ordem ${statusClass}`;

  const iconeStatus = document.createElement("span");
  iconeStatus.className = "icone-status";
  iconeStatus.textContent = "⏱";

  statusOrdem.appendChild(iconeStatus);
  statusOrdem.appendChild(document.createTextNode("\n" + statusTexto + "\n"));

  ordemCodigoStatus.appendChild(labelOrdem);
  ordemCodigoStatus.appendChild(codigoOrdem);
  ordemCodigoStatus.appendChild(statusOrdem);

  return ordemCodigoStatus;
}

// Cria o botão de ver OP
function criarBotaoVerOP(idOP) {
  const verop = document.createElement("div");
  verop.className = "verop";
  verop.id = idOP;

  const btnVerop = document.createElement("button");
  btnVerop.classList.add("btn-verop");
  btnVerop.id = idOP;
  btnVerop.textContent = "\nVer Ordem de Produção\n";

  verop.appendChild(btnVerop);
  return verop;
}

// Cria Card de aviso quando não há OPs

function criaCardSemOPs() {
  const cardSemOPs = document.createElement("div");
  cardSemOPs.className = "card-ordem";
  cardSemOPs.style.fontSize = "27px";
  cardSemOPs.style.fontWeight = "bold";
  cardSemOPs.style.display = "flex";
  cardSemOPs.style.justifyContent = "center";
  cardSemOPs.style.alignItems = "center";
  cardSemOPs.textContent = "Não há Ordens de Produção";

  return cardSemOPs;
}

// Função principal
export async function listarOrdensProducao(valorPesquisa = null, filtro = null) {
  if (carregando) return;
  carregando = true;
  try {
    limparLista();
    const listaOrdensDOM = document.querySelector(".lista-ordens");

    // Só busca do backend na primeira vez
    if (!cacheOPs) {
      cacheOPs = await buscarEOrganizarOPs();
    }

    let listaOPs = filtrarOPs(cacheOPs, valorPesquisa, filtro);
    const ids = [...new Set(listaOPs.map((op) => op.prodIDOP))];

    if (!cacheProdutosOPs || cacheProdutosOPs.size === 0) {
      const produtos = await window.api.get(`/produtos?ids=${ids.join(",")}`);
      cacheProdutosOPs = new Map(produtos.map((p) => [p.id, p.nome]));
    }

    if (listaOPs.length === 0) {
      listaOrdensDOM.appendChild(criaCardSemOPs());
      return;
    }

    const cards = await Promise.all(listaOPs.map((op) => criarCardOP(op, cacheProdutosOPs)));
    const fragment = document.createDocumentFragment();
    cards.forEach((card) => fragment.appendChild(card));
    listaOrdensDOM.appendChild(fragment);

  } catch (error) {
    console.log(`Erro ao listar as ordens de produção: ${error}`);
  } finally {
    carregando = false;
  }
}

// Função para buscar o nome do produto pelo ID
async function retornaNomeProduto(id) {
  if (!cacheProdutos.has(id)) {
    const promessa = window.api.get(`/produtos/${parseInt(id)}`);
    cacheProdutos.set(id, promessa);
  }

  const produto = await cacheProdutos.get(id);
  return produto.nome;
}

// Função auxiliar para criar elementos de informação da ordem
function criarInfoOrdem(icone, label, valor) {
  // Cria o container principal da informação
  const infoOrdem = document.createElement("div");
  infoOrdem.className = "info-ordem";

  // Cria o elemento do ícone
  const iconeElement = document.createElement("span");
  iconeElement.className = "material-symbols-outlined icone";
  iconeElement.textContent =
    "\n                            " + icone + "\n                        ";

  // Cria container para label e valor
  const divContainer = document.createElement("div");

  // Cria o label da informação
  const labelInfo = document.createElement("div");
  labelInfo.className = "label-info";
  labelInfo.textContent = label;

  // Cria o elemento que exibe o valor
  const valorInfo = document.createElement("div");
  valorInfo.className = "valor-info";
  valorInfo.textContent = valor;

  // Monta a estrutura
  divContainer.appendChild(labelInfo);
  divContainer.appendChild(valorInfo);

  infoOrdem.appendChild(iconeElement);
  infoOrdem.appendChild(divContainer);

  return infoOrdem;
}

// Objeto com dados de configuração
const dados = {
  iconeStatus: "⏱",
};

// Função para limpar a lista de ordens do DOM
export function limparLista() {
  const listaOrdensDOM = document.querySelector(".lista-ordens");
  listaOrdensDOM.innerHTML = "";
}
export function invalidarCache() {
  cacheOPs = null;
  cacheProdutosOPs = null;
}
