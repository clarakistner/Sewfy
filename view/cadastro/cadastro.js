document.addEventListener('DOMContentLoaded', () => {
    console.log('[INIT] DOM carregado');

    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const confirmaSenhaInput = document.getElementById('confirma-senha');
    const numeroInput = document.getElementById('numero');

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
        const numero = numeroInput.value.trim();

        console.log('[DADOS] Valores capturados:', {
            email,
            senhaLength: senha.length,
            confirmaSenhaLength: confirmaSenha.length,
            numero
        });

        // Verificação de campos preenchidos
        if (!email || !senha || !confirmaSenha || !numero) {
            alert('Preencha todos os campos');
            return;
        }
        console.log('[VALIDAÇÃO] Campos preenchidos');


        // o que deve conter na senha (um carcatere maiusculo, um caractere especial e no minimo 10 caracteres)
        const senhaRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{10,}$/;

        if (!senhaRegex.test(senha)) {
            alert(
                'A senha deve ter no mínimo 10 caracteres, ' +
                '1 letra maiúscula e 1 caractere especial.'
            );
            return;
        }
        console.log('[VALIDAÇÃO] Senha válida');

        
        // Verificação de senhas coincidentes
        if (senha !== confirmaSenha) {
            alert('As senhas não coincidem');
            return;
        }
        console.log('[VALIDAÇÃO] Senhas coincidem');


        // Envio dos dados para o backend
        try {
            console.log('[FETCH] Enviando dados para o servidor');

            const response = await fetch('/Sewfy/controller/CadastroController.php', {
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
                alert(resultado);
                form.reset();
            } else {
                console.log('[ERRO BACKEND] Falha ao cadastrar usuário:', resultado);
                alert(resultado);
            }

        } catch (erro) {
            console.error('[ERRO FETCH] ', erro);
            alert('Erro ao conectar com o servidor');
        }
    });
});
