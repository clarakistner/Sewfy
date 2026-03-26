import { mascaraTelefone } from "../assets/mascaras.js";
import { mostrarToast } from "../toast/toast.js";


document.addEventListener("click", async (e) => {
  if (e.target.closest(".botaoSalvar")) {
    await editarOwner();
  }
});

let ownerAbortController = null;

async function carregarOwner() {
  if (ownerAbortController) ownerAbortController.abort();
  ownerAbortController = new AbortController();
  const signal = ownerAbortController.signal;

  const toast = mostrarToast("Carregando dados do proprietário...", "carregando");

  try {
    const owner = await buscaOwner(signal);
    if (signal.aborted) return; // página já trocou, ignora
    if (!owner) {
      console.warn("[WARN] Proprietário não encontrado!");
      return;
    }
    renderizaOwner(owner);
  } finally {
    if (!signal.aborted) toast.remove();
  }
}

async function buscaOwner(signal) {
  try {
    const response = await window.api.get("/funcionario/owner/resgatar", { signal });
    return response.owner;
  } catch (error) {
    if (error.name === "AbortError") return null;
    console.log("Erro ao buscar proprietário: " + error);
    throw error;
  }
}

function renderizaOwner(owner) {
  const container = document.querySelector(".editarUsuario")
  if (!container) return;

  const nome = container.querySelector("#nome");
  const email = container.querySelector("#email");
  if (email) {
    email.value = owner.USU_EMAIL ?? "";
    email.setAttribute("readonly", true);
    email.style.opacity = "0.6";
    email.style.cursor = "not-allowed";
  }
  const telefone = container.querySelector("#telefone");

  if (!nome || !email || !telefone) {
    console.warn("[WARN] Campos não encontrados!");
    return;
  }

  nome.value = owner.USU_NOME;
  email.value = owner.USU_EMAIL;
  telefone.value = mascaraTelefone(owner.USU_NUM);
}

function retornaNumerosTelefone(telefone) {
  return telefone.replace(/\D/g, "");
}

async function editarOwner() {

  const container = document.querySelector(".containerConfigOwner");
  if (!container) return;

  const campoN = container.querySelector("#nome");
  const campoE = container.querySelector("#email");
  const campoT = container.querySelector("#telefone");

  if (!verificaCampos(campoN, campoE, campoT)) return;

  try {
    const dados = {
      nome: campoN.value,
      email: campoE.value,
      telefone: retornaNumerosTelefone(campoT.value),
    };

    const toast = mostrarToast("Carregando...", "carregando");
    await window.api.put("/funcionario/owner/editar", dados);
    toast.remove();
    mostrarToast("Proprietário atualizado!");
  } catch (error) {
    console.log("Erro ao tentar editar o proprietário: " + error);
    throw error;
  }
}

function verificaCampos(nome, email, telefone) {
  if (!nome || !email || !telefone) {
    console.warn("[WARN] Campos não encontrados!");
    return false;
  }
  if ([nome, email, telefone].some((c) => c.value.trim() === "")) {
    mostrarToast("Nenhum campo pode ficar vazio!", "erro");
    carregarOwner();
    return false;
  }
  return true;
}

export function initEditarOwner() {
  carregarOwner();
}