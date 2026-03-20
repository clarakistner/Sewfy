let timeout;
let carregando = false;
document.addEventListener("input", handleInput);
document.addEventListener("change", handleChange);
document.addEventListener("DOMContentLoaded", initGerenciarOPs);

async function initGerenciarOPs() {
  console.trace("initGerenciarOPs chamada");
  const { initTelaCarregamento, removeTelaCarregamento } =
    await import("../../telacarregamento/telacarregamento.js");

  initTelaCarregamento();

  await listarOrdensProducao(null, null);
  setTimeout(() => {
    removeTelaCarregamento();
  }, 3300);
}
function handleInput(e) {
  if (e.target.closest("#barraPesquisa")) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      limparLista();
      listarOrdensProducao(String(e.target.value), null);
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
async function criarCardOP(op) {
  const cardsOrdens = document.createElement("div");
  cardsOrdens.className = "card-ordem";

  const contentOrdem = document.createElement("div");
  contentOrdem.className = "content-ordem";

  contentOrdem.appendChild(criarCabecalhoOP(op));

  const nomeProduto = await retornaNomeProduto(op.prodIDOP);
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
export async function listarOrdensProducao(
  valorPesquisa = null,
  filtro = null,
) {
  if (carregando) return;
  carregando = true;
  try {
    limparLista();
    const listaOrdensDOM = document.querySelector(".lista-ordens");
    let listaOPs = await buscarEOrganizarOPs();
    listaOPs = filtrarOPs(listaOPs, valorPesquisa, filtro);

    if (listaOPs.length == 0) {
      listaOrdensDOM.appendChild(criaCardSemOPs());
      return;
    }

    for (const op of listaOPs) {
      console.log("Criando card para OP:", op.idOP);
      const card = await criarCardOP(op);
      listaOrdensDOM.appendChild(card);
    }
  } catch (error) {
    console.log(`Erro ao listar as ordens de produção: ${error}`);
  } finally {
    carregando = false;
  }
}

// Função para buscar o nome do produto pelo ID
async function retornaNomeProduto(id) {
  try {
    // Faz requisição para buscar dados do produto

    console.log("ID DO PRODUTOOOOOOOOOOOOOOOOO: " + id);
    const produto = await window.api.get(`/produtos/${parseInt(id)}`);

    // Log de debug
    console.log(
      ` DENTRO DA FUNÇÃO retornaNomeProduto() -> PROD_NOME:${produto.nome}`,
    );

    return produto.nome;
  } catch (error) {
    console.log(`Erro ao buscar produto: ${error}`);
  }
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

// Executa a função de listagem ao carregar o módulo
