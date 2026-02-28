import { mostrarToast } from "../toast/toast.js";
import { aplicarMascaraTelefone } from "../assets/mascaras.js";

document.addEventListener('DOMContentLoaded', () => {
    console.log('[INIT] DOM carregado');

    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const confirmaSenhaInput = document.getElementById('confirma-senha');
    const numeroInput = document.getElementById('numero');

    // Máscara para o campo de número de telefone
    aplicarMascaraTelefone(numeroInput);


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
        console.log('[SUBMIT] Formulário enviado');

        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();
        const confirmaSenha = confirmaSenhaInput.value.trim();
        const numero = numeroInput.value.replace(/\D/g, ''); // remove a mascara e deixa só os números

        console.log('[DADOS] Valores capturados:', {
            email,
            senhaLength: senha.length,
            confirmaSenhaLength: confirmaSenha.length,
            numero
        });

        // Verificação de campos preenchidos
        if (!email || !senha || !confirmaSenha || !numero) {
            mostrarToast('Preencha todos os campos', 'erro');
            return;
        }
        console.log('[VALIDAÇÃO] Campos preenchidos');


        // o que deve conter na senha (um carcatere maiusculo, um caractere especial e no minimo 10 caracteres)
        const senhaRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{10,}$/;

        if (!senhaRegex.test(senha)) {
            mostrarToast(
                'A senha deve ter no mínimo 10 caracteres, ' +
                '1 letra maiúscula e 1 caractere especial.',
                'erro'
            );
            return;
        }
        console.log('[VALIDAÇÃO] Senha válida');

        //Verificação de email válido
        if (email.length > 35){
            mostrarToast('O email deve ter no máximo 35 caracteres', 'erro');
            return;
        }
        console.log('[VALIDAÇÃO] Email válido');
        

        // Verificação de senhas coincidentes
        if (senha !== confirmaSenha) {
            mostrarToast('As senhas não coincidem', 'erro');
            return;
        }
        console.log('[VALIDAÇÃO] Senhas coincidem');


        // Verificação do número de telefone (deve ter exatamente 11 dígitos)
        if (numero.length !== 11) {
            mostrarToast('O número deve ter exatamente 11 dígitos', 'erro');
            return;
        }
        console.log('[VALIDAÇÃO] Número de telefone válido');


        // Envio dos dados para o backend
        try {
            console.log('[FETCH] Enviando dados para o servidor');

            const response = await fetch('/Sewfy/controller/usuarios/CadastroController.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    email: email,
                    senha: senha,
                    numero: numero
                })
            });

            console.log('[FETCH] Status da resposta:', response.status);

            const resultado = await response.text();
            console.log('[FETCH] Resposta do servidor:', resultado);

            if (response.ok) {
                console.log('[SUCESSO] Usuário cadastrado');
                mostrarToast('Usuário cadastrado com sucesso!', 'sucesso');
                // Redireciomamento do usuário para a página de login após 1 segundo
                setTimeout(() => {
                    window.location.href = '../../www.sewfy/login/login.html';
                }, 1000);
                form.reset();
            } else {
                console.log('[ERRO BACKEND] Falha ao cadastrar usuário:', resultado);
                mostrarToast(resultado, 'erro');
            }

        } catch (erro) {
            console.error('[ERRO FETCH] ', erro);
            mostrarToast('Erro ao conectar com o servidor', 'erro');
        }
    });
});
