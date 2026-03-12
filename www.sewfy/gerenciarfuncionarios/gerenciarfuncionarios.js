import { mascaraTelefone } from "../assets/mascaras.js";
import { mostrarToast } from "../toast/toast.js";
import { aplicarMascaraTelefone } from "../assets/mascaras.js";

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
  console.log("[FETCH] Buscando todos os funcionários");
  const tbody = document.getElementById("funcionarios-table");
  if (!tbody) {
    console.warn("[WARN] Tabela de funcionarios não encontrada");
    return;
  }
  tbody.innerHTML = `<tr><td colspan="4" class="mensagem-vazia">Carregando...</td></tr>`;
  const listaFuncionarios = await buscaTodosFuncionariosEmpresa();
  renderizaFuncionarios(listaFuncionarios);
}

export function limparLista() {
  document.querySelector("#funcionarios-table").innerHTML = "";
}

function aplicaPesquisa(listaFun, valorPesquisa) {
  if (!valorPesquisa) return listaFun;
  return listaFun.filter((fun) =>
    fun.USU_NOME.trim().toLowerCase().includes(valorPesquisa.trim().toLowerCase()) ||
    fun.USU_EMAIL.trim().toLowerCase().includes(valorPesquisa.trim().toLowerCase())
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
        <button class="botao-visualizar-funcionario" data-id="${funcionario.USU_ID}">
          <span class="material-symbols-outlined icone-visualizar-funcionario">visibility</span>
        </button>
      </td>`;

    tbody.appendChild(tr);
  });
}

// ─── MODAL EDITAR FUNCIONÁRIO ─────────────────────────────────────────────────

document.addEventListener("click", async (e) => {
  const botao = e.target.closest(".botao-visualizar-funcionario");
  if (!botao) return;

  window.funcionarioAtualId = botao.dataset.id;

  try {
    const modalHTML = await fetch(
      "/www.sewfy/editarfuncionario/editarFuncionario.html"
    ).then((res) => res.text());

    document.body.insertAdjacentHTML("afterbegin", modalHTML);

    const response = await window.api.get(`/empresa-usuario/${window.funcionarioAtualId}`);
    preencherModal(response);

  } catch (erro) {
    console.error(erro);
    mostrarToast(erro.message || "Erro ao carregar funcionário", "erro");
  }
});

function preencherModal(funcionario) {
  document.getElementById("edit-nome").value = funcionario.nome ?? "";
  document.getElementById("edit-email").value = funcionario.email ?? "";
  document.getElementById("edit-telefone").value = mascaraTelefone(funcionario.telefone ?? "");

  atualizarToggle(funcionario.ativo);

  const modulos = Array.from(funcionario.modulos ?? []);
  document.querySelectorAll(".modulo-check").forEach((cb) => {
    cb.checked = modulos.includes(cb.dataset.modulo);
  });

  aplicarMascaraTelefone(document.getElementById("edit-telefone"));

  iniciarEventosModal();
}

function atualizarToggle(ativo) {
  const btn = document.getElementById("toggle-ativo");
  const label = document.getElementById("toggle-label");
  if (!btn || !label) return;

  btn.dataset.ativo = ativo ? "true" : "false";
  btn.classList.toggle("ativo", ativo);
  btn.classList.toggle("inativo", !ativo);
  label.textContent = ativo ? "Ativo" : "Inativo";
}

function iniciarEventosModal() {
  document.getElementById("toggle-ativo")?.addEventListener("click", () => {
    const btn = document.getElementById("toggle-ativo");
    atualizarToggle(btn.dataset.ativo !== "true");
  });

  document.getElementById("btn-salvar-funcionario")?.addEventListener("click", salvarFuncionario);
  document.getElementById("btn-cancelar-editar")?.addEventListener("click", fecharModal);
  document.getElementById("btn-fechar-editar")?.addEventListener("click", fecharModal);
}

async function salvarFuncionario() {
  const nome = document.getElementById("edit-nome").value.trim();
  const telefone = document.getElementById("edit-telefone").value.trim().replace(/\D/g, "");
  const email = document.getElementById("edit-email").value.trim();
  const ativo = document.getElementById("toggle-ativo").dataset.ativo === "true";

  const modulos = [];
  document.querySelectorAll(".modulo-check:checked").forEach((cb) => {
    modulos.push(cb.dataset.modulo);
  });

  if (!nome || !telefone || !email) {
    mostrarToast("Preencha todos os campos obrigatórios", "erro");
    return;
  }
  if (nome.length < 4 || nome.length > 45) {
    mostrarToast("Nome inválido", "erro");
    return;
  }
  if (telefone.length < 10 || telefone.length > 11) {
    mostrarToast("Telefone inválido", "erro");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    mostrarToast("E-mail inválido", "erro");
    return;
  }

  try {
    const response = await window.api.put(
      `/empresa-usuario/${window.funcionarioAtualId}`,
      { nome, telefone, email, ativo, modulos }
    );

    mostrarToast(response.mensagem || "Funcionário atualizado com sucesso", "sucesso");
    fecharModal();
    carregarFuncionarios();

  } catch (erro) {
    console.error(erro);
    mostrarToast(erro.message || "Erro ao salvar funcionário", "erro");
  }
}

function fecharModal() {
  document.querySelector(".funcionario-modal")?.remove();
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

export function initGerenciarFuncionarios() {
  carregarFuncionarios();

  // Atualiza lista após salvar (chamado externamente se necessário)
  window.atualizarListaFuncionarios = carregarFuncionarios;
}