import { mostrarToast } from "../toast/toast.js";
import { mascaraTelefone } from "../assets/mascaras.js";

const modulosDOM = {
  financeiro: "Financeiro",
  rh: "Recursos Humanos",
  faturamento: "Faturamento",
  producao: "Producao",
  relatorios: "Relatorios",
  compras: "Compras",
};
document.addEventListener("input", handleInput);
document.addEventListener("click", handleClick);
function handleClick(e) {
  if (e.target.closest(".botaoCadastrar")) {
    cadastrarFuncionario();
  }
}
function handleInput(e) {
  if (e.target.id === "telefone") {
    e.target.value = mascaraTelefone(e.target.value);
  }
}

async function cadastrarFuncionario() {
  try {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = retornaNumerosTelefone(
      document.getElementById("telefone").value,
    );
    const modulosSelecionados = retornaIdsModulosSelecionados();
    verificaCampos(nome, email, telefone, modulosSelecionados);

    

    const data = {
      CONV_EMAIL: email,
      CONV_NOME: nome,
      CONV_NUM: telefone,
      modulos: modulosSelecionados,
    };

    await window.api.post("/convites", data);
    limparFormulario();

    mostrarToast("Convite enviado com sucesso!");
  } catch (error) {
    console.error("Erro ao cadastrar funcionário:", error);
    throw error;
  }
}

function retornaNumerosTelefone(telefone) {
  return telefone.replace(/\D/g, "");
}

function verificaCampos(nome, email, telefone, modulosSelecionados) {
  if (
    !nome ||
    !email ||
    !telefone ||
    nome.trim() === "" ||
    email.trim() === "" ||
    telefone.trim() === ""
  ) {
    mostrarToast("Preencha todos os campos!", "erro");
    throw new Error("Campos obrigatórios não preenchidos");
  }
  if (modulosSelecionados.length === 0) {
    mostrarToast("Selecione pelo menos um módulo!", "erro");
    throw new Error("Nenhum módulo selecionado");
  }
  if (nome.length < 5 || nome.length > 100) {
    mostrarToast("Nome inválido!", "erro");
    throw new Error("Nome inválido");
  }
  if (
    email.length < 5 ||
    email.length > 100 ||
    !email.includes("@") ||
    !email.includes(".") ||
    /[^a-zA-Z0-9@.]/.test(email)
  ) {
    mostrarToast("Email inválido!", "erro");
    throw new Error("Email inválido");
  }

  if (telefone.length < 10 || telefone.length > 11) {
    mostrarToast("Telefone inválido!", "erro");
    throw new Error("Telefone inválido");
  }
  if (telefone.length === 11 && telefone[2] !== "9") {
    mostrarToast("Telefone inválido!", "erro");
    throw new Error("Telefone inválido");
  }
}

async function criaMapaModulos() {
  try {
    const data = await window.api.get("/modulos-usuario");
    return Object.fromEntries(
      data.modulos.map((modulo, i) => [modulo, data.idsModulos[i]]),
    );
  } catch (error) {
    console.error("Erro ao criar mapa de módulos:", error);
    throw error;
  }
}

function criaModuloItem(nomeModulo, idModulo) {
  const label = document.createElement("label");
  label.classList.add("modulo-item");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = idModulo;

  const span = document.createElement("span");
  span.textContent = modulosDOM[nomeModulo] || nomeModulo;

  label.append(checkbox, span);
  return label;
}

async function exibirModulos() {
  try {
    const mapaModulos = await criaMapaModulos();
    const modulosGrid = document.querySelector(".modulos-grid");
    modulosGrid.innerHTML = "";

    for (const [nomeModulo, idModulo] of Object.entries(mapaModulos)) {
      modulosGrid.appendChild(criaModuloItem(nomeModulo, idModulo));
    }
  } catch (error) {
    console.error("Erro ao exibir módulos:", error);
    throw error;
  }
}

function retornaIdsModulosSelecionados() {
  const checkboxes = document.querySelectorAll(
    ".modulos-grid input[type=checkbox]",
  );
  return Array.from(checkboxes)
    .filter((cb) => cb.checked)
    .map((cb) => parseInt(cb.value));
}
function limparFormulario() {
  document.getElementById("nome").value = "";
  document.getElementById("email").value = "";
  document.getElementById("telefone").value = "";
  document
    .querySelectorAll(".modulos-grid input[type=checkbox]")
    .forEach((cb) => (cb.checked = false));
}

export function initCadastroFuncionario() {
  exibirModulos();
}
