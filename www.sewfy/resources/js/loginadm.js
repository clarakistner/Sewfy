import { mostrarToast } from "./toast/toast.js";
import { getCookie, setCookie } from "./API_JS/api";
import "./API_JS/api.js";
const API_BASE = import.meta.env.VITE_API_BASE ?? "https://www.sewfy.com.br";

document.addEventListener("DOMContentLoaded", () => {
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

        await window.inicializarCsrf();
        const xsrfToken = decodeURIComponent(getCookie("XSRF-TOKEN") ?? "");
        console.log("XCSR: " + xsrfToken);
        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();

        if (!email || !senha) {
            mostrarToast("Preencha todos os campos", "erro");
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/api/auth/adm/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-XSRF-TOKEN": xsrfToken,
                },
                body: JSON.stringify({ email, senha }),
            });

            const data = await response.json();

            if (response.ok) {
                setCookie("token", data.token, 120);
                setCookie("email", data.email, 120);
                window.location.href = "/home-adm";
            } else {
                mostrarToast(data.erro || "Erro ao fazer login", "erro");
            }
        } catch (erro) {
            console.error("[ERRO FETCH] ", erro);
            mostrarToast("Erro ao conectar com o servidor", "erro");
        }
    });
});
