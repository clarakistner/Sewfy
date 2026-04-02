import { mostrarToast } from "./toast/toast.js";
import {
  aplicarMascaraTelefone,
  mascaraTelefone,
} from "../js/assets/mascaras.js";

// ─── BUSCA E PREENCHE ─────────────────────────────────────────────────────────

async function carregarDadosFuncionario() {
  try {
    
    const response = await window.api.get(
      `/empresa-usuario/${window.funcionarioAtualId}`,
    );
    preencherModal(response);
  } catch (erro) {
    console.error(erro);
    mostrarToast(erro.message || "Erro ao carregar funcionário", "erro");
  }
}

function preencherModal(funcionario) {
  document.getElementById("edit-nome").value = funcionario.nome ?? "";
  document.getElementById("edit-telefone").value = mascaraTelefone(
    funcionario.telefone ?? "",
  );


  const campoEmail = document.getElementById("edit-email");
  if (campoEmail) {
    campoEmail.value = funcionario.email ?? "";
    campoEmail.setAttribute("readonly", true);
    campoEmail.style.opacity = "0.6";
    campoEmail.style.cursor = "not-allowed";
  }

  atualizarToggle(funcionario.ativo);

  const modulos = Array.from(funcionario.modulos ?? []);
  document.querySelectorAll(".modulo-check").forEach((cb) => {
    cb.checked = modulos.includes(cb.dataset.modulo);
  });

  aplicarMascaraTelefone(document.getElementById("edit-telefone"));

  iniciarEventos();
}

// ─── TOGGLE ───────────────────────────────────────────────────────────────────

function atualizarToggle(ativo) {
  const btn = document.getElementById("toggle-ativo");
  const label = document.getElementById("toggle-label");
  if (!btn || !label) return;

  btn.dataset.ativo = ativo ? "true" : "false";
  btn.classList.toggle("ativo", ativo);
  btn.classList.toggle("inativo", !ativo);
  label.textContent = ativo ? "Ativo" : "Inativo";
}

// ─── EVENTOS ──────────────────────────────────────────────────────────────────

function iniciarEventos() {
  document.getElementById("toggle-ativo")?.addEventListener("click", () => {
    const btn = document.getElementById("toggle-ativo");
    atualizarToggle(btn.dataset.ativo !== "true");
  });

  document
    .getElementById("btn-salvar-funcionario")
    ?.addEventListener("click", salvarFuncionario);
  document
    .getElementById("btn-cancelar-editar")
    ?.addEventListener("click", fecharModal);
  document
    .getElementById("btn-fechar-editar")
    ?.addEventListener("click", fecharModal);
}

// ─── SALVAR ───────────────────────────────────────────────────────────────────

async function salvarFuncionario() {
  const nome = document.getElementById("edit-nome").value.trim();
  const telefone = document
    .getElementById("edit-telefone")
    .value.trim()
    .replace(/\D/g, "");
  const ativo =
    document.getElementById("toggle-ativo").dataset.ativo === "true";

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
      { nome, telefone, email, ativo, modulos },
    );

    mostrarToast(
      response.mensagem || "Funcionário atualizado com sucesso",
      "sucesso",
    );
    fecharModal();
    window.atualizarListaFuncionarios?.();
  } catch (erro) {
    console.error(erro);
    mostrarToast(erro.message || "Erro ao salvar funcionário", "erro");
  }
}

// ─── FECHAR ───────────────────────────────────────────────────────────────────

function fecharModal() {
  document.querySelector("#modal-editar-funcionario")?.remove();
  observer.observe(document.body, { childList: true });
}

export async function carregaJsCssEditarFuncionario() {
  // ─── DETECTA QUANDO O MODAL É INSERIDO NO DOM ─────────────────────────────────

  const observer = new MutationObserver(async (mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1 && node.id === "modal-editar-funcionario") {
          observer.disconnect();
          await carregarDadosFuncionario();
          return;
        }
      }
    }
  });

  const target = document.querySelector(".gerenciarFuncionarios");
  observer.observe(target, { childList: true });
  try {
    const responseCSS = await fetch(
      "/www.sewfy/funcionarios/editarfuncionarios/editarfuncionarios.css",
    );

    const cssText = await responseCSS.text();

    const style = document.createElement("style");
    style.id = "css-editar-funcionario";
    style.textContent = cssText;

    const scriptEditar = document.createElement("script");
    scriptEditar.id = "js-editar-funcionario";
    scriptEditar.type = "module";
    scriptEditar.src =
      "/www.sewfy/funcionarios/editarfuncionarios/editarfuncionarios.js";

    document.body.appendChild(scriptEditar);
    document.head.appendChild(style);
  } catch (error) {
    console.log("Erro ao tentar importar arquivo js e css: " + error);
    throw error;
  }
}

export function retiraCssJsEditarFuncionario() {
  document.querySelector("#css-editar-funcionario")?.remove();
  document.querySelector("#js-editar-funcionario")?.remove();
}
