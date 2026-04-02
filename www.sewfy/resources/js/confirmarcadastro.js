import { mostrarToast } from "./toast/toast.js";
import "../css/confirmarcadastro.css";

const API_BASE = 'http://localhost:8000';

const params = new URLSearchParams(window.location.search);
const token  = params.get('token');

// Configurações de exibição por tipo
const config = {
    owner: {
        titulo:  'Confirmar Cadastro',
        botao:   'Salvar Informações',
        sucesso: 'Empresa cadastrada com sucesso!',
    },
    funcionario: {
        titulo:  'Confirmar Acesso',
        botao:   'Salvar Informações',
        sucesso: 'Acesso confirmado com sucesso!',
    },
    troca_owner: {
        titulo:  'Confirmar Propriedade',
        botao:   'Confirmar',
        sucesso: 'Você agora é o proprietário da empresa!',
    },
    troca_email: {
        titulo:  'Confirmar Novo Email',
        botao:   'Confirmar Troca',
        sucesso: 'Email atualizado com sucesso!',
    },
    redef_senha: {
        titulo:  'Redefinir Senha',
        botao:   'Salvar Nova Senha',
        sucesso: 'Senha redefinida com sucesso!',
    }
};

document.addEventListener('DOMContentLoaded', async () => {

    if (!token) {
        mostrarErroToken('invalido');
        return;
    }

    // Verifica o status e o tipo do token
    let tipo = null;
    try {
        const statusResponse = await fetch(`${API_BASE}/api/convites/verificar?token=${token}`, {
            headers: { 'Accept': 'application/json' }
        });
        const statusData = await statusResponse.json();

        if (statusData.status === 'usado') {
            mostrarMensagemSucesso(statusData.tipo);
            return;
        }

        if (statusData.status === 'invalido' || statusData.status === 'expirado') {
            mostrarErroToken(statusData.status);
            return;
        }

        tipo = statusData.tipo;

    } catch (erro) {
        console.error('[ERRO] Falha ao verificar token:', erro);
        mostrarToast('Erro ao conectar com o servidor', 'erro');
        return;
    }

    // Atualiza título e botão conforme o tipo
    const cfg = config[tipo] ?? config.owner;
    document.querySelector('.box-confirmacao h2').textContent = cfg.titulo;
    document.querySelector('form button[type="submit"]').textContent = cfg.botao;

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
            const toastCarregando = mostrarToast('Aguarde...', 'carregando');

            const response = await fetch(`${API_BASE}/api/convites/confirmar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept':       'application/json',
                },
                body: JSON.stringify({ token, senha })
            });

            toastCarregando.remove();

            const data = await response.json();

            if (response.ok) {
                mostrarMensagemSucesso(tipo);
                return;
            }

            if (response.status === 401) {
                mostrarToast('Senha incorreta para este usuário', 'erro');
                return;
            }

            mostrarToast(data.erro || 'Erro ao confirmar', 'erro');

        } catch (erro) {
            console.error('[ERRO FETCH]', erro);
            mostrarToast('Erro ao conectar com o servidor', 'erro');
        }
    });
});

function mostrarMensagemSucesso(tipo) {
    const cfg = config[tipo] ?? config.owner;
    document.querySelector('.box-confirmacao').innerHTML = `
        <h2>${cfg.sucesso}</h2>
        <p style="margin: 20px 0; color: #444; font-size: 15px; text-align: center;">
            Acesse o sistema pelo 
            <a href="/login style="color: #0e59fe; font-weight: bold;">Login</a>.
        </p>
    `;
}

function mostrarErroToken(status) {
    const mensagem = status === 'expirado'
        ? 'Este link expirou. Solicite um novo convite.'
        : 'Link inválido ou não encontrado.';

    document.querySelector('.box-confirmacao').innerHTML = `
        <h2 style="color: #e53e3e;">Link Inválido</h2>
        <p style="margin: 20px 0; color: #666; font-size: 15px; text-align: center;">${mensagem}</p>
    `;
}