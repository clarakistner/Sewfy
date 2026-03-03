import { mostrarToast } from "../toast/toast.js";

const API_BASE = 'http://localhost:8000';

// Pega o token da URL
const params = new URLSearchParams(window.location.search);
const token = params.get('token');

// Se não tiver token na URL, redireciona
if (!token) {
    mostrarToast('Link inválido ou expirado', 'erro');
}

document.addEventListener('DOMContentLoaded', () => {

    // Toggle visibilidade das senhas
    document.querySelectorAll('.botao-senha').forEach(botao => {
        botao.addEventListener('click', () => {
            const input = botao.previousElementSibling;
            input.type = input.type === 'password' ? 'text' : 'password';
        });
    });

    // Envio do formulário
    document.querySelector('form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const senha         = document.getElementById('senha').value.trim();
        const confirmaSenha = document.getElementById('confirma-senha').value.trim();

        if (!senha || !confirmaSenha) {
            mostrarToast('Preencha todos os campos', 'erro');
            return;
        }

        if (senha.length < 8) {
            mostrarToast('A senha deve ter no mínimo 8 caracteres', 'erro');
            return;
        }

        if (senha !== confirmaSenha) {
            mostrarToast('As senhas não coincidem', 'erro');
            return;
        }

        if (!token) {
            mostrarToast('Link inválido ou expirado', 'erro');
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/api/convites/confirmar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ token, senha })
            });

            const data = await response.json();

            if (response.ok) {
                mostrarToast('Cadastro confirmado com sucesso!', 'sucesso');
                setTimeout(() => {
                    window.location.href = '/www.sewfy/login/index.html';
                }, 2000);
            } else {
                mostrarToast(data.erro || 'Erro ao confirmar cadastro', 'erro');
            }

        } catch (erro) {
            console.error('[ERRO FETCH]', erro);
            mostrarToast('Erro ao conectar com o servidor', 'erro');
        }
    });
});