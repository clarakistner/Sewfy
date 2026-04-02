import { mostrarToast } from "./toast/toast.js";

const API_BASE = 'http://localhost:8000'; 

document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');

    // Toggle visibilidade da senha
    document.querySelectorAll('.botao-senha').forEach(botao => {
        botao.addEventListener('click', () => {
            const input = botao.previousElementSibling;
            input.type = input.type === 'password' ? 'text' : 'password';
        });
    });

    // Envio do formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();

        if (!email || !senha) {
            mostrarToast('Preencha todos os campos', 'erro');
            return;
        }

        try {

            const response = await fetch(`${API_BASE}/api/auth/adm/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, senha })
            });

            const data = await response.json();

            if (response.ok) {
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('email', data.email);
                window.location.href = '/www.sewfy/homeadm/index.html'; // ajuste o caminho
            } else {
                mostrarToast(data.erro || 'Erro ao fazer login', 'erro');
            }

        } catch (erro) {
            console.error('[ERRO FETCH] ', erro);
            mostrarToast('Erro ao conectar com o servidor', 'erro');
        }
    });
});