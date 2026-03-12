import { mostrarToast } from "../../toast/toast.js";
import { aplicarMascaraTelefone, mascaraTelefone } from "../../assets/mascaras.js";

console.log("[DEBUG] Script editarFuncionario.js carregado!");

// ABRIR MODAL
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

// PREENCHE O MODAL COM OS DADOS DO FUNCIONÁRIO
function preencherModal(funcionario) {
  document.getElementById("edit-nome").value = funcionario.nome ?? "";
  document.getElementById("edit-telefone").value = mascaraTelefone(funcionario.telefone ?? "");
  document.getElementById("edit-email").value = funcionario.email ?? "";

  // Toggle ativo/inativo
  atualizarToggle(funcionario.ativo);

  // Checkboxes de módulos
  const modulos = Array.from(funcionario.modulos ?? []);
  document.querySelectorAll(".modulo-check").forEach((checkbox) => {
    checkbox.checked = modulos.includes(checkbox.dataset.modulo);
  });

  // Máscara no campo de telefone
  const telInput = document.getElementById("edit-telefone");
  aplicarMascaraTelefone(telInput);

  // Eventos
  iniciarEventos();
}

// TOGGLE ATIVO/INATIVO
function atualizarToggle(ativo) {
  const btn = document.getElementById("toggle-ativo");
  const label = document.getElementById("toggle-label");
  if (!btn || !label) return;

  if (ativo) {
    btn.dataset.ativo = "true";
    btn.classList.add("ativo");
    btn.classList.remove("inativo");
    label.textContent = "Ativo";
  } else {
    btn.dataset.ativo = "false";
    btn.classList.remove("ativo");
    btn.classList.add("inativo");
    label.textContent = "Inativo";
  }
}

// INICIAR EVENTOS DO MODAL
function iniciarEventos() {
  // Toggle clique
  document.getElementById("toggle-ativo")?.addEventListener("click", () => {
    const btn = document.getElementById("toggle-ativo");
    const ativoAtual = btn.dataset.ativo === "true";
    atualizarToggle(!ativoAtual);
  });

  // Salvar
  document.getElementById("btn-salvar-funcionario")?.addEventListener("click", salvarFuncionario);

  // Cancelar / fechar
  document.getElementById("btn-cancelar-editar")?.addEventListener("click", fecharModal);
  document.getElementById("btn-fechar-editar")?.addEventListener("click", fecharModal);
}

// SALVAR
async function salvarFuncionario() {
  const nome = document.getElementById("edit-nome").value.trim();
  const telefone = document.getElementById("edit-telefone").value.trim().replace(/\D/g, "");
  const email = document.getElementById("edit-email").value.trim();
  const ativo = document.getElementById("toggle-ativo").dataset.ativo === "true";

  const modulos = [];
  document.querySelectorAll(".modulo-check:checked").forEach((cb) => {
    modulos.push(cb.dataset.modulo);
  });

  // Validações
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
    window.atualizarListaFuncionarios?.();

  } catch (erro) {
    console.error(erro);
    mostrarToast(erro.message || "Erro ao salvar funcionário", "erro");
  }
}

// FECHAR MODAL
function fecharModal() {
  document.querySelector(".funcionario-modal")?.remove();
}