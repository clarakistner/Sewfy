import { mascaraTelefone } from "../../assets/mascaras.js";
import { mostrarToast } from "../../toast/toast.js";
import { aplicarMascaraTelefone } from "../../assets/mascaras.js";

console.log("Script de gerenciamento de funcionários carregado");

let timeout;
document.addEventListener("input", handleInput);

function handleInput(e) {
  if (e.target.closest("#barrapesquisa")) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      limparLista();
      pesquisaFuncionarios(String(e.target.value));
    }, 300);
  }
}

// ─── BUSCA / LISTAGEM ────────────────────────────────────────────────────────

async function buscaTodosFuncionariosEmpresa() {
  try {
    const response = await window.api.get("/empresa-usuarios/funcionarios");
    return Array.from(response.funcionarios);
  } catch (error) {
    console.log("Erro ao buscar funcionários: " + error);
    throw error;
  }
}

async function carregarFuncionarios() {
  const tbody = document.getElementById("funcionarios-table");
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="4" class="mensagem-vazia">Carregando...</td></tr>`;
  const listaFuncionarios = await buscaTodosFuncionariosEmpresa();
  renderizaFuncionarios(listaFuncionarios);
}

export function limparLista() {
  document.querySelector("#funcionarios-table").innerHTML = "";
}

function aplicaPesquisa(listaFun, valorPesquisa) {
  if (!valorPesquisa) return listaFun;
  return listaFun.filter(
    (fun) =>
      fun.USU_NOME.trim()
        .toLowerCase()
        .includes(valorPesquisa.trim().toLowerCase()) ||
      fun.USU_EMAIL.trim()
        .toLowerCase()
        .includes(valorPesquisa.trim().toLowerCase()),
  );
}

async function pesquisaFuncionarios(valorPesquisa = null) {
  try {
    limparLista();
    let listaFuns = await buscaTodosFuncionariosEmpresa();
    listaFuns = aplicaPesquisa(listaFuns, valorPesquisa);
    renderizaFuncionarios(listaFuns);
  } catch (error) {
    console.log(`Erro ao listar os funcionarios pesquisados: ${error}`);
  }
}

function renderizaFuncionarios(funcionarios) {
  const tbody = document.getElementById("funcionarios-table");
  tbody.innerHTML = "";

  if (!Array.isArray(funcionarios) || funcionarios.length === 0) {
    tbody.innerHTML = `
      <tr class="linha-vazia">
        <td colspan="4" class="mensagem-vazia">Nenhum funcionário encontrado</td>
      </tr>`;
    return;
  }

  funcionarios.forEach((funcionario) => {
    const tr = document.createElement("tr");
    tr.classList.add("table-row");
    if (funcionario.USU_ATIV === 0) tr.classList.add("funcionario-inativo");

    tr.innerHTML = `
      <td class="table-cell">${funcionario.USU_NOME}</td>
      <td class="table-cell">${funcionario.USU_EMAIL}</td>
      <td class="table-cell">${mascaraTelefone(funcionario.USU_NUM)}</td>
      <td class="table-cell">
        <button type="button" class="botao-visualizar-funcionario" data-id="${funcionario.USU_ID}">
          <span class="material-symbols-outlined icone-visualizar-funcionario">visibility</span>
        </button>
      </td>`;

    tbody.appendChild(tr);
  });
}

// ─── ABRIR MODAL ──────────────────────────────────────────────────────────────

document.addEventListener("click", async (e) => {
  const botao = e.target.closest(".botao-visualizar-funcionario");
  if (!botao) return;

  e.preventDefault();
  e.stopPropagation();

  window.funcionarioAtualId = botao.dataset.id;
  const { carregaJsCssEditarFuncionario } = await import("../editarfuncionarios/editarfuncionarios.js");
  await carregaJsCssEditarFuncionario();
  try {
    const modalHTML = await fetch(
      "/www.sewfy/funcionarios/editarfuncionarios/index.html",
    ).then((r) => r.text());
    const telaGerenciar = document.querySelector(".gerenciarFuncionarios");
    if (!telaGerenciar) return;
    telaGerenciar.insertAdjacentHTML("afterbegin", modalHTML);
  } catch (erro) {
    console.error(erro);
    mostrarToast("Erro ao abrir modal", "erro");
  }
});

// ─── INIT ─────────────────────────────────────────────────────────────────────

export function initGerenciarFuncionarios() {
  carregarFuncionarios();
  window.atualizarListaFuncionarios = carregarFuncionarios;
}