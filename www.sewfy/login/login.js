import { mostrarToast } from "../toast/toast.js";
import {
  initTelaCarregamento,
  removeTelaCarregamento,
} from "../telacarregamento/telacarregamento.js";

const API_BASE = "http://localhost:8000";

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

  // Esqueceu a senha
  document
    .getElementById("link-redefinir-senha")
    .addEventListener("click", async (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();

      if (!email) {
        mostrarToast("Digite seu email acima para redefinir a senha", "erro");
        return;
      }

      try {
        const toastCarregando = mostrarToast("Enviando email...", "carregando");

        const response = await fetch(`${API_BASE}/api/auth/redefinir-senha`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email }),
        });

        toastCarregando.remove();

        const data = await response.json();
        mostrarToast(data.mensagem || "Email enviado!", "sucesso");
      } catch (erro) {
        console.error("[ERRO FETCH]", erro);
        mostrarToast("Erro ao conectar com o servidor", "erro");
      }
    });

  // Login
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("[SUBMIT] Formulário enviado");

    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();

    if (!email || !senha) {
      mostrarToast("Preencha todos os campos", "erro");
      return;
    }

    try {

        initTelaCarregamento();
      

        console.log("EMail: "+ email + "\nSenha: "+senha);
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, senha}),
      });
      const data = await response.json();

      if (response.status === 401) {
        mostrarToast("Email ou senha incorretos", "erro");
        removeTelaCarregamento();
        return;
      }

      if (!response.ok) {
        mostrarToast(data.erro || "Erro ao fazer login", "erro");
        removeTelaCarregamento();
        return;
      }

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("empresas_ids", JSON.stringify(data.empresas_ids));
      sessionStorage.setItem("usuario_email", email);

      if (data.empresas_ids?.length === 1) {
        
        removeTelaCarregamento();
        window.location.href = "/www.sewfy/home";
      } else {
        removeTelaCarregamento();
        window.location.href = "/www.sewfy/selecionar-empresa";
      }
    } catch (erro) {
      console.error("[ERRO FETCH]", erro);
      mostrarToast("Erro ao conectar com o servidor", "erro");
    }
  });
});
