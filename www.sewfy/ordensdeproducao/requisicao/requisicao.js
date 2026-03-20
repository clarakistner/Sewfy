// Importa funções auxiliares
import { mostrarToast } from "../../toast/toast.js";
import {
  listarOrdensProducao,
  limparLista,
} from "../gerenciar/gerenciarOrdensDeProducao.js";
import {
  removeTelaCarregamento,
  initTelaCarregamento,
} from "../../telacarregamento/telacarregamento.js";

// ─────────────────────────────────────────
// ESTADO GLOBAL
// ─────────────────────────────────────────

let listaProdutos = null;

const PROD_TIPO = {
  INSUMO: "insumo",
  FINAL: "produto acabado",
  CONJUNTO: "Desconhecido",
};

const op = {
  PROD_NOME: null,
  PROD_ID: null,
  OP_QTD: null,
};

const OPINs = [];

// ─────────────────────────────────────────
// INICIALIZAÇÃO
// ─────────────────────────────────────────

document.addEventListener("DOMContentLoaded", iniciaRequisicao);
document.addEventListener("click", handleGlobalClick);

function iniciaRequisicao() {
  carregarProdutosEmSelect("final");
  renderLista();
}

// ─────────────────────────────────────────
// HANDLER GLOBAL DE CLIQUES
// ─────────────────────────────────────────

async function handleGlobalClick(e) {
  if (
    e.target.closest(".icone-adicionar-ordem") ||
    e.target.closest(".botao-criar-ordem")
  ) {
    abrirModal();
  }

  if (e.target.closest(".modal-close") || e.target.closest(".cancelar")) {
    await fecharModal();
  }

  if (e.target.closest(".proximo.dadosProduto")) {
    navegarParaInsumos(e);
  }

  if (e.target.closest(".finalizar")) {
    navegarParaMostrarOrdem(e);
  }

  if (e.target.closest(".voltar")) {
    e.preventDefault();
    const ordemVisivel = document.querySelector(".boxDadosOrdem");
    if (ordemVisivel && ordemVisivel.style.display === "block") {
      irOutraTela(".boxDadosOrdem", ".boxDadosInsumos");
    } else {
      irOutraTela(".boxDadosInsumos", ".boxDadosProduto");
    }
  }

  if (e.target.closest(".confirmar")) {
    await confirmarOrdem();
  }

  if (e.target.closest(".adicionar")) {
    e.preventDefault();
    await adicionarInsumo();
  }

  if (e.target.closest(".voltarProduto")) {
    e.preventDefault();
    irOutraTela(".boxDadosInsumos", ".boxDadosProduto");
  }
}

// ─────────────────────────────────────────
// NAVEGAÇÃO
// ─────────────────────────────────────────

function abrirModal() {
  window.location.href = "../requisicao";
}

async function fecharModal() {
  OPINs.length = 0;
  listaProdutos = await window.api.get("/produtos");
  window.location.href = "../gerenciar/";
}

function navegarParaInsumos(e) {
  e.preventDefault();

  const selectProduto = document.querySelector("select.input-produto");
  const opcao = selectProduto.options[selectProduto.selectedIndex];
  const campoQuant = document.querySelector("input.input-produto");
  const quantidade = parseInt(campoQuant.value);
  const campoFor = document.querySelector(".campoFornecedor");

  if (opcao.value === "Produto" || !quantidade) {
    mostrarToast("Todos os campos devem ser preenchidos corretamente!", "erro");
    return;
  }

  if (quantidade <= 0) {
    mostrarToast("A quantidade deve ser maior que 0!", "erro");
    return;
  }

  op.PROD_NOME = opcao.value;
  op.PROD_ID = parseInt(opcao.id);
  op.OP_QTD = quantidade;

  listaProdutos = listaProdutos.filter((p) => p.id !== op.PROD_ID);
  console.log("op.PROD_ID: " + op.PROD_ID);

  irOutraTela(".boxDadosProduto", ".boxDadosInsumos");
  carregarProdutosEmSelect("insumos");
  carregaFornecedores(campoFor);
}

function navegarParaMostrarOrdem(e) {
  e.preventDefault();

  if (OPINs.length <= 0) {
    mostrarToast("Insira ao menos um insumo na ordem de produção!", "erro");
    return;
  }

  irOutraTela(".boxDadosInsumos", ".boxDadosOrdem");
  organizaDados();
}

function irOutraTela(atual, proxima) {
  document.querySelector(atual).style.display = "none";
  document.querySelector(proxima).style.display = "block";
}

// ─────────────────────────────────────────
// INSUMOS — ADICIONAR / RENDERIZAR
// ─────────────────────────────────────────

async function adicionarInsumo() {
  try {
    const tabelaInsumos = document.getElementById("tabelaInsumos");
    const campoInsumo = document.querySelector(".campoInsumo");
    const campoQuant = document.querySelector(".campoQuant");
    const campoFor = document.querySelector(".campoFornecedor");

    const opInsumo = obterValorSelect(campoInsumo);
    const quant =
      parseInt(campoQuant.value) <= 0 || isNaN(campoQuant.value)
        ? 0
        : parseInt(campoQuant.value);
    const fornecedor = obterValorSelect(campoFor);

    if (!validarCamposInsumo(opInsumo, quant)) return;

    console.log("Campo quant: " + campoQuant.value);

    const produto = await window.api.get(`/produtos/${parseInt(opInsumo.id)}`);
    const custou = parseFloat(produto.preco);
    const custot = custou * quant;

    const insumo = {
      IDFORNECEDOR: valorIdFornecedor("id", fornecedor),
      QTDIN: quant,
      CUSTOT: custot,
      CUSTOU: custou,
      UM: produto.um,
      INSUNOME: opInsumo.textContent,
      INSUID: parseInt(opInsumo.id),
    };

    OPINs.push(insumo);

    listaProdutos = listaProdutos.filter(
      (p) => parseInt(p.id) !== parseInt(opInsumo.id),
    );
    carregarProdutosInsumo(listaProdutos, campoInsumo);

    renderLista();
    limparCamposInsumo(campoInsumo, campoQuant, campoFor);
  } catch (error) {
    console.log(`Erro ao adicionar insumo: ${error}`);
  }
}

function renderLista() {
  const listaCards = document.getElementById("tabelaInsumos");
  if (!listaCards) return;

  listaCards.innerHTML = "";

  if (OPINs.length === 0) {
    const p = document.createElement("p");
    p.className = "lista-vazia";
    p.textContent = "Nenhum insumo adicionado ainda.";
    listaCards.appendChild(p);
    return;
  }

  OPINs.forEach(function (insumo, index) {
    const card = document.createElement("div");
    card.className = "insumo-card";
    card.innerHTML =
      '<div class="insumo-card-field">' +
      '<span class="insumo-card-label">' +
      svgScissors("#9b59b6") +
      " INSUMO/SERVIÇO</span>" +
      '<span class="insumo-card-value">' +
      esc(insumo.INSUNOME) +
      "</span>" +
      "</div>" +
      '<div class="insumo-card-field">' +
      '<span class="insumo-card-label">' +
      svgUser("#e74c3c") +
      " FORNECEDOR</span>" +
      '<span class="insumo-card-value">' +
      esc(valorNomeFornecedor(insumo.IDFORNECEDOR)) +
      "</span>" +
      "</div>" +
      '<div class="insumo-card-actions">' +
      '<span class="insumo-card-actions-label">' +
      svgCircle("#9ca3af") +
      " AÇÕES</span>" +
      "</div>" +
      '<button class="btn-remover" data-index="' +
      index +
      '">Remover</button>';
    listaCards.appendChild(card);
  });

  listaCards.querySelectorAll(".btn-remover").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const idx = Number(this.dataset.index);
      listaProdutos.push({
        id: OPINs[idx].INSUID,
        nome: OPINs[idx].INSUNOME,
        tipo: PROD_TIPO.INSUMO,
        ativo: 1,
      });
      OPINs.splice(idx, 1);
      const campoInsumo = document.querySelector(".campoInsumo");
      carregarProdutosInsumo(listaProdutos, campoInsumo);
      renderLista();
    });
  });
}

// ─────────────────────────────────────────
// CONFIRMAÇÃO DA ORDEM
// ─────────────────────────────────────────

async function confirmarOrdem() {
  try {
    const dados = {
      OP_QTD: op.OP_QTD,
      OP_DATAA: dataFormatada(),
      OP_CUSTOU: calculaCustoU(),
      OP_CUSTOT: calculaCustoT(),
      PROD_ID: op.PROD_ID,
      INSUMOS: [...OPINs],
    };

    OPINs.length = 0;
    initTelaCarregamento();
    await window.api.post("/ordemdeproducao/criar", dados);
    removeTelaCarregamento();

    mostrarToast("Ordem de Produção criada!");
    setTimeout(() => {
      window.location.href = "../gerenciar/";
    }, 1000);
  } catch (error) {
    console.log(`Erro ao confirmar ordem: ${error}`);
  }
}

// ─────────────────────────────────────────
// TELA DE CONFIRMAÇÃO (boxDadosOrdem)
// ─────────────────────────────────────────

function organizaDados() {
  document.querySelector("#nomeProduto").innerHTML = op.PROD_NOME;
  document.querySelector("#quantidadeProduto").innerHTML = parseInt(
    op.OP_QTD,
  ).toLocaleString("pt-BR");
  document.querySelector("#custot").innerHTML = calculaCustoT().toLocaleString(
    "pt-BR",
    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  );
  document.querySelector("#custou").innerHTML = calculaCustoU().toLocaleString(
    "pt-BR",
    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  );

  carregaDadosInsumos();
}

function carregaDadosInsumos() {
  const tabela = document.querySelector("#tabelaIN");
  tabela.innerHTML = "";

  OPINs.forEach((insumo) => {
    const div = document.createElement("div");
    div.className = "insumo-revisao-item";
    div.innerHTML = `
      <p class="insumo-revisao-nome">
        ${parseInt(insumo.QTDIN).toLocaleString("pt-BR")} ${insumo.UM} de ${esc(insumo.INSUNOME)}
      </p>
      <p class="insumo-revisao-fornecedor">
        Fornecedor: <span>${esc(valorNomeFornecedor(insumo.IDFORNECEDOR))}</span>
      </p>
    `;
    tabela.appendChild(div);
  });

  const placeholder = document.getElementById("insumosVazio");
  if (placeholder) {
    placeholder.classList.toggle("hidden", OPINs.length > 0);
  }
}

// ─────────────────────────────────────────
// SELECTS — CARREGAR PRODUTOS / FORNECEDORES
// ─────────────────────────────────────────

const getListaProdutosBanco = async () => {
  if (!listaProdutos) {
    listaProdutos = await window.api.get("/produtos");
  }
  return listaProdutos;
};

async function carregarProdutosEmSelect(tipo) {
  try {
    const lista = await getListaProdutosBanco();

    if (tipo === "final") {
      const selectProduto = document.querySelector("select.input-produto");
      if (selectProduto) carregarProdutosFinal(lista, selectProduto);
    } else {
      const selectInsumo = document.querySelector(".campoInsumo");
      if (selectInsumo) carregarProdutosInsumo(lista, selectInsumo);
    }
  } catch (error) {
    console.log(`Erro ao buscar produtos: ${error}`);
  }
}

function carregarProdutosFinal(listaProd, selectProduto) {
  selectProduto.innerHTML = `<option value="">Produto</option>`;
  listaProd.forEach((p) => {
    if (
      (p.tipo === PROD_TIPO.FINAL || p.tipo === PROD_TIPO.CONJUNTO) &&
      p.ativo === 1
    ) {
      selectProduto.appendChild(criarOptionProduto(p));
    }
  });
}

function carregarProdutosInsumo(listaProd, selectInsumo) {
  selectInsumo.innerHTML = `<option value="">Insumo</option>`;
  listaProd.forEach((p) => {
    if (p.tipo === PROD_TIPO.INSUMO && p.ativo === 1) {
      selectInsumo.appendChild(criarOptionProduto(p));
    }
  });
}

async function carregaFornecedores(campo) {
  try {
    const fornecedores = await window.api.get("/clifor");
    fornecedores.forEach((fornecedor) => {
      const option = document.createElement("option");
      option.id = `${fornecedor.id}`;
      option.innerHTML = `${fornecedor.nome}`;
      campo.appendChild(option);
    });
  } catch (error) {
    console.log(`Erro ao carregar fornecedores: ${error}`);
  }
}

function criarOptionProduto(produto) {
  const option = document.createElement("option");
  option.id = `${produto.id}`;
  option.innerHTML = `${produto.nome}`;
  return option;
}

// ─────────────────────────────────────────
// UTILITÁRIOS
// ─────────────────────────────────────────

function obterValorSelect(selectElement) {
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  return selectedOption.value === "" ? null : selectedOption;
}

function validarCamposInsumo(opInsumo, quant) {
  if (!opInsumo || !quant) {
    mostrarToast("Preencha todos os campos!", "erro");
    return false;
  }
  if (quant === 0) {
    mostrarToast("A quantidade deve ser maior que 0!", "erro");
    return false;
  }
  return true;
}

function limparCamposInsumo(campoInsumo, campoQuant, campoFor) {
  campoInsumo.value = "";
  campoQuant.value = "";
  campoFor.value = "";
}

function valorIdFornecedor(atributo, fornecedor) {
  if (atributo === "valor") {
    return !fornecedor ? "Sem fornecedor" : fornecedor.value;
  }
  return !fornecedor ? null : parseInt(fornecedor.id);
}

function valorNomeFornecedor(idFornecedor) {
  if (!idFornecedor) return "Sem fornecedor";
  const option = document.querySelector(
    `.campoFornecedor option[id="${idFornecedor}"]`,
  );
  return option ? option.textContent : "Sem fornecedor";
}

function dataFormatada() {
  const data = new Date();
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  const h = data.getHours();
  const min = data.getMinutes();
  const seg = data.getSeconds();
  return `${ano}-${mes}-${dia} ${h}:${min}:${seg}`;
}

function calculaCustoT() {
  return OPINs.reduce((total, insumo) => total + parseFloat(insumo.CUSTOT), 0);
}

function calculaCustoU() {
  return parseFloat((calculaCustoT() / parseFloat(op.OP_QTD)).toFixed(2));
}

// ─── SVG helpers ───

function svgScissors(color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`;
}

function svgUser(color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
}

function svgCircle(color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`;
}

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
