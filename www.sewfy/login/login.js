import { mostrarToast } from "../toast/toast.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("[INIT] DOM carregado");

  const form = document.querySelector("form");
  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");

  // Toggle visibilidade da senha
  document.querySelectorAll(".botao-senha").forEach((botao) => {
    botao.addEventListener("click", () => {
      const input = botao.previousElementSibling;
      input.type = input.type === "password" ? "text" : "password";
    });
  });

  // Envio do formulário
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("[SUBMIT] Formulário enviado");

    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();

    console.log("[DADOS] Valores capturados:", {
      email,
      senhaLength: senha.length,
    });

    // Verificação de campos preenchidos
    if (!email || !senha) {
      mostrarToast("Preencha todos os campos", "erro");
      return;
    }
    console.log("[VALIDAÇÃO] Campos preenchidos");

    // Envio dos dados para o backend
    try {
      console.log("[FETCH] Enviando dados para o servidor");

      const dados = {
        email: email,
        senha: senha,
      };
      const response = await window.api.post("/auth/login", dados);

      sessionStorage.setItem("token", response.token);
      sessionStorage.setItem(
        "empresas_ids",
        JSON.stringify(response.empresas_ids),
      );

      const empresasIds = response.empresas_ids;
      if (empresasIds.length === 1) {
        window.location.href = "/www.sewfy/home";
      } else {
        window.location.href = "/www.sewfy/selecionar-empresa";
      }
    } catch (erro) {
      console.error("[ERRO FETCH] ", erro);
      mostrarToast("Erro ao conectar com o servidor", "erro");
    }
  });
});
