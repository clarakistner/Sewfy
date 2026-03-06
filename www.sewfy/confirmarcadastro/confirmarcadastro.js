import { mostrarToast } from "../toast/toast.js";

const API_BASE = 'http://localhost:8000';

// Pega o token da URL
const params = new URLSearchParams(window.location.search);
const token = params.get('token');

document.addEventListener('DOMContentLoaded', async () => {

    // Se não tiver token na URL, exibe erro imediatamente
    if (!token) {
        mostrarErroToken('invalido');
        return;
    }

    // Verifica o status do token antes de exibir o formulário
    try {
        const statusResponse = await fetch(`${API_BASE}/api/convites/verificar?token=${token}`, {
            headers: { 'Accept': 'application/json' }
        });
        const statusData = await statusResponse.json();

        if (statusData.status === 'usado') {
            mostrarMensagemSucesso();
            return;
        }

        if (statusData.status === 'invalido' || statusData.status === 'expirado') {
            mostrarErroToken(statusData.status);
            return;
        }

    } catch (erro) {
        console.error('[ERRO] Falha ao verificar token:', erro);
        mostrarToast('Erro ao conectar com o servidor', 'erro');
        return;
    }

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

        const senha        = document.getElementById('senha').value.trim();
        const confirmaSenha = document.getElementById('confirma-senha').value.trim();

        if (!senha || !confirmaSenha) {
            mostrarToast('Preencha todos os campos', 'erro');
            return;
        }

        // Validação de senha: mínimo 10 caracteres, 1 letra maiúscula e 1 caractere especial
        const senhaRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{10,}$/;
        if (!senhaRegex.test(senha)) {
            mostrarToast(
                'A senha deve ter no mínimo 10 caracteres, 1 letra maiúscula e 1 caractere especial.',
                'erro'
            );
            return;
        }

        if (senha !== confirmaSenha) {
            mostrarToast('As senhas não coincidem', 'erro');
            return;
        }

        try {
            // Envia requisição para confirmar cadastro
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
                mostrarMensagemSucesso();
                return;
            }

            if (response.status === 401) {
                mostrarToast('Senha incorreta para este usuário', 'erro');
                return;
            }

            mostrarToast(data.erro || 'Erro ao confirmar cadastro', 'erro');

        } catch (erro) {
            console.error('[ERRO FETCH]', erro);
            mostrarToast('Erro ao conectar com o servidor', 'erro');
        }
    });
});

// Exibe mensagem de sucesso após confirmação
function mostrarMensagemSucesso() {
    document.querySelector('.box-confirmacao').innerHTML = `
        <h2>Cadastro Concluído!</h2>
        <p style="margin: 20px 0; color: #444; font-size: 15px; text-align: center;">
            Seu cadastro foi confirmado com sucesso. Acesse o sistema pelo 
            <a href="/www.sewfy/login/index.html" style="color: #0e59fe; font-weight: bold;">Login</a>.
        </p>
    `;
}

// Exibe mensagem de erro para token inválido ou expirado
function mostrarErroToken(status) {
    const mensagem = status === 'expirado'
        ? 'Este link expirou. Solicite um novo convite.'
        : 'Link inválido ou não encontrado.';

    document.querySelector('.box-confirmacao').innerHTML = `
        <h2 style="color: #e53e3e;">Link Inválido</h2>
        <p style="margin: 20px 0; color: #666; font-size: 15px; text-align: center;">${mensagem}</p>
    `;
}