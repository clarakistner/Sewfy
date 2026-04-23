import { mostrarToast } from "./toast/toast.js";
import {
    initTelaCarregamento,
    removeTelaCarregamento,
} from "./telacarregamento.js";

import { getCookie, setCookie, deleteCookie } from "./API_JS/api.js";

const API_BASE = import.meta.env.VITE_API_BASE ?? "https://www.sewfy.com.br";

document.addEventListener("DOMContentLoaded", () => {
    console.log("[INIT] DOM carregado");

    window.inicializarCsrf();

    const form       = document.querySelector("form");
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");

    document.querySelectorAll(".botao-senha").forEach((botao) => {
        botao.addEventListener("click", () => {
            const input = botao.previousElementSibling;
            input.type  = input.type === "password" ? "text" : "password";
        });
    });

    document.getElementById("link-redefinir-senha").addEventListener("click", async (e) => {
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
                headers: { "Content-Type": "application/json", Accept: "application/json" },
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

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();

        if (!email || !senha) {
            mostrarToast("Preencha todos os campos", "erro");
            return;
        }

        try {
            initTelaCarregamento();

            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-XSRF-TOKEN": decodeURIComponent(getCookie("XSRF-TOKEN") ?? ""),
                },
                body: JSON.stringify({ email, senha }),
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

            deleteCookie("url_anterior");
            setCookie("user_name", data.nome, 120);

            // Salva módulos no cookie para o View Composer e cadastrousuario.js
            if (data.modulos && data.ids_modulos) {
                const modulosData = {
                    modulos:    data.modulos,
                    idsModulos: data.ids_modulos,
                };
                const expires = new Date(Date.now() + 10 * 60 * 1000).toUTCString();
                document.cookie = `modulos_cache=${encodeURIComponent(JSON.stringify(modulosData))}; expires=${expires}; path=/; SameSite=Lax`;
            }

            removeTelaCarregamento();

            if (parseInt(data.quantidade_empresas) > 1) {
                setCookie("empresas_ids", data.empresas_ids, 120);
                window.location.replace("/selecionar-empresa");
                return;
            }

            setCookie("empresa_id", data.empresas_ids[0], 120);
            window.location.replace("/home");
        } catch (erro) {
            console.error("[ERRO FETCH]", erro);
            mostrarToast("Erro ao conectar com o servidor", "erro");
            removeTelaCarregamento();
        }
    });
});