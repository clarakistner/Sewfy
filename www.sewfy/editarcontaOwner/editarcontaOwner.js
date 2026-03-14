import { mascaraTelefone } from "../assets/mascaras.js";
import { mostrarToast } from "../toast/toast.js";

document.addEventListener("click", async (e) => {
  if (e.target.closest(".btn-editar-owner")) {
    await editarOwner();
  }
});

async function buscaOwner() {
  try {
    const response = await window.api.get("/funcionario/owner/resgatar");
    console.log(`Owner: ${response.owner}`);
    const owner = response.owner;
    return owner;
  } catch (error) {
    console.log("Erro ao buscar proprietário: " + erro);
    throw error;
  }
}

async function carregarOwner() {
  console.log("[FETCH] Buscando o owner");

  const toast = mostrarToast("Carregando dados do proprietário...", "carregando");
  const owner = await buscaOwner();
  
  

  if (!owner) {
    console.warn("[WARN] Proprietário não encontrado!");
    return;
  }

  renderizaOwner(owner);
  toast.remove();
}

function renderizaOwner(owner) {
  const nome = document.querySelector(".value#nome");
  const email = document.querySelector(".value#email");
  const telefone = document.querySelector(".value#telefone");

  if (!nome || !email || !telefone) {
    console.warn("[WARN] Campos não encontrados!!!!!!!!!!!!!!");
    return;
  }

  
  nome.value = `${owner.USU_NOME}`;
  email.value = `${owner.USU_EMAIL}`;
  telefone.value = `${mascaraTelefone(owner.USU_NUM)}`;
}
function retornaNumerosTelefone(telefone) {
  return telefone.replace(/\D/g, "");
}
async function editarOwner() {
  try {
    const campoN = document.querySelector("#nome");
    const campoE = document.querySelector("#email");
    const campoT = document.querySelector("#telefone");


    if(!verificaCampos(campoN, campoE, campoT)) return;

    const nome = campoN.value;
    const telefone = campoT.value;
    const email = campoE.value;

    const dados = {
      email: email,
      nome: nome,
      telefone: retornaNumerosTelefone(telefone),
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
    console.warn("[WARN] Campos não encontrados!!!!!!!!!!!!!!");
    return false;
  }
  if (
    nome.value.trim() === "" ||
    email.value.trim() === "" ||
    telefone.value.trim() === ""
  ) {
    mostrarToast(
      "Proprietário não atualizado! Nenhum campo pode ficar vazio!",
      "erro",
    );
    carregarOwner();
    return false;
  }
  return true;
}

export function initEditarOwner() {
  carregarOwner();
}
