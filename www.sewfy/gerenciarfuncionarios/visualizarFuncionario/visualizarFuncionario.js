import {
  mascaraTelefone,
  aplicarMascaraTelefone,
} from "../../assets/mascaras.js";
import { mostrarToast } from "../../toast/toast.js";
import { initGerenciarFuncionarios } from "../gerenciarfuncionarios.js";
document.addEventListener("click", handleClick);

async function handleClick(e) {
  if (e.target.closest(".botao-visualizar-funcionario")) {
    const botao = e.target.closest(".botao-visualizar-funcionario");
    await abrirModal(parseInt(botao.dataset.id));
  }
  if (e.target.closest(".modal-close")) {
    fecharModal();
  }
  if (e.target.closest(".btn-editar-funcionario")) {
    ativarModoEdicao();
  }
}

async function buscaInfoFuncionario(id) {
  try {
    const response = await window.api.get(`/funcionario/${id}`);
    const funcionario = response.funcionario;
    return funcionario;
  } catch (error) {
    console.log(`Erro ao tentar buscar o funcionário: ${error}`);
    throw error;
  }
}

async function carregarInfoTela(id) {
  try {
    console.log(`ID do funcionario a ser pesquisado: ${id}`);
    const funcionario = await buscaInfoFuncionario(parseInt(id));
    const campoNome = document.querySelector("#modal-nome");
    const campoTel = document.querySelector("#modal-telefone");
    const campoEmail = document.querySelector("#modal-email");
    const campoAtivo = document.querySelector("#modal-ativo");
    const botaoEditar = document.querySelector(".btn-editar-funcionario");
    campoNome.textContent = `${funcionario.USU_NOME}`;
    campoTel.textContent = `${mascaraTelefone(funcionario.USU_NUM)}`;
    campoEmail.textContent = `${funcionario.USU_EMAIL}`;
    campoAtivo.textContent =
      parseInt(funcionario.USU_ATIV) === 1 ? "Ativo" : "Inativo";
    botaoEditar.id = id;
  } catch (error) {
    console.log(`Erro ao tentar carregar dados na tela: ${error}`);
    throw error;
  }
}

async function abrirModal(id) {
  const data = await fetch(
    "/www.sewfy/gerenciarfuncionarios/visualizarFuncionario/index.html",
  ).then((res) => {
    console.log("Status do fetch:", res.status);
    return res.text();
  });
  console.log("HTML carregado:", data);
  const telaGerenciar = document.querySelector(".gerenciarFuncionarios");
  if (!telaGerenciar) return;

  telaGerenciar.insertAdjacentHTML("afterbegin", data);
  await carregarInfoTela(id);
}
function fecharModal() {
  const modal = document.querySelector(".funcionariomodal");
  if (!modal) return;
  modal.remove();
}

function ativarModoEdicao() {
  document.querySelectorAll(".value").forEach((span) => {
    const field = span.dataset.field;
    const valor = span.textContent.trim();
    let el;

    if (field === "ativo") {
      el = document.createElement("select");
      el.innerHTML = `
                <option value="1">Ativo</option>
                <option value="0">Inativo</option>
            `;
      el.value = valor === "Ativo" ? "1" : "0";
    } else {
      el = document.createElement("input");
      el.type = "text";
      el.value = valor;
    }

    el.classList.add("input-edicao");
    el.dataset.field = field;
    el.id = span.id;

    if (field === "telefone") aplicarMascaraTelefone(el);

    span.replaceWith(el);
  });

  trocarBotaoParaSalvar();
}
function trocarBotaoParaSalvar() {
  const btn = document.querySelector(".btn-editar-funcionario");
  btn.textContent = "Salvar alterações";
  btn.replaceWith(btn.cloneNode(true));
  document
    .querySelector(".btn-editar-funcionario")
    .addEventListener("click", salvarFuncionario);
}

async function salvarFuncionario() {
  const modal = document.querySelector(".funcionariomodal");
  const botao = document.querySelector(".btn-editar-funcionario");
  const telefone = document
    .querySelector('[data-field="telefone"]')
    .value.trim()
    .replace(/\D/g, "");
  const ativo =
    document.querySelector('[data-field="ativo"]').value === "1" ? 1 : 0;

  if (!telefone) {
    mostrarToast("Preencha todos os campos", "erro");
    return;
  }

  if (telefone.length !== 11) {
    mostrarToast("Telefone inválido", "erro");
    return;
  }

  try {
    const dados = {
      telefone: telefone,
      ativo: ativo,
    };
    await window.api.put(`/funcionario/editar/${parseInt(botao.id)}`, dados);

    mostrarToast("Funcionário atualizado", "sucesso");
    modal.remove();
    initGerenciarFuncionarios();
  } catch (erro) {
    mostrarToast(erro.message, "erro");
  }
}

export async function importCssJsVisualizarFuncionario() {
  try {
    const responseCSS = await fetch(
      "/www.sewfy/gerenciarfuncionarios/visualizarFuncionario/visualizarFuncionario.css",
    );

    const cssText = await responseCSS.text();

    const style = document.createElement("style");
    style.id = "css-config-vF";
    style.textContent = cssText;

    const script = document.createElement("script");
    script.id = "js-config-vF";
    script.type = "module";
    script.src =
      "/www.sewfy/gerenciarfuncionarios/visualizarFuncionario/visualizarFuncionario.js";
    document.body.appendChild(script);
    document.head.appendChild(style);
  } catch (error) {
    console.log("Erro ao tentar importar arquivo js e css: " + error);
    throw error;
  }
}

export function retiraCssJsVisualizarFuncionario() {
  document.querySelector("#css-config-vF")?.remove();
  document.querySelector("#js-config-vF")?.remove();
}
