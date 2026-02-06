import { mostrarToast } from "../../toast/toast.js";
import { aplicarMascaraCpfCnpj, aplicarMascaraTelefone } from "../../assets/mascaras.js";                       
import { validarCpfCnpj } from "../../assets/validacoes.js";

console.log("[DEBUG] Script cadastroFornecedores.js carregado!");

// ABRIR MODAL
document.addEventListener("click", (e) => {
    if (e.target.closest(".botao-criar-fornecedor")) {
        console.log('[MODAL] Clique em "Novo Fornecedor"');

        fetch("/Sewfy/view/fornecedores/cadastro/cadastroFornecedores.html")
            .then(res => {
                console.log("[MODAL] Fetch HTML status:", res.status);
                return res.text();
            })
            .then(html => {
                console.log("[MODAL] HTML carregado");
                document.body.insertAdjacentHTML("afterbegin", html);

                setTimeout(() => {
                    console.log("[MODAL] Inicializando eventos");
                    inicializarEventosModal();
                }, 50);
            })
            .catch(err => {
                console.error("[MODAL] Erro ao carregar modal:", err);
                mostrarToast("Erro ao abrir formulário", "erro");
            });
    }
});

// FECHAR MODAL
document.addEventListener("click", (e) => {
    if (e.target.closest(".btn-submit")) return;

    if (
        e.target.classList.contains("icone-fechar-modal") ||
        e.target.closest(".btn-cancel")
    ) {
        console.log("[MODAL] Fechando modal");
        document.querySelector("#fornecedorModal")?.remove();
    }
});

// INICIALIZAR EVENTOS
function inicializarEventosModal() {
    const form = document.querySelector("#fornecedor");
    console.log("[INIT] Form encontrado?", !!form);
    if (!form) return;

    const nomeInput = document.getElementById("fNome");
    const cpfCnpjInput = document.getElementById("pCode");
    const telefoneInput = document.getElementById("fPhone");
    const enderecoInput = document.getElementById("fend");

    console.log("[INIT] Inputs:", {
        nomeInput,
        cpfCnpjInput,
        telefoneInput,
        enderecoInput
    });

    aplicarMascaraCpfCnpj(cpfCnpjInput);
    aplicarMascaraTelefone(telefoneInput);

    form.addEventListener("submit", async (e) => {
        console.log("[SUBMIT] Evento submit disparado");
        e.preventDefault();
        e.stopPropagation();

        await cadastrarFornecedor(
            nomeInput,
            cpfCnpjInput,
            telefoneInput,
            enderecoInput
        );
    });
}

// CADASTRAR FORNECEDOR
async function cadastrarFornecedor(
    nomeInput,
    cpfCnpjInput,
    telefoneInput,
    enderecoInput
) {
    console.log("[CADASTRO] Iniciando");

    const nome = nomeInput.value.trim();
    const cpfCnpj = cpfCnpjInput.value.trim();
    const telefone = telefoneInput.value.trim();
    const endereco = enderecoInput.value.trim();

    console.log("[CADASTRO] Dados capturados:", {
        nome,
        cpfCnpj,
        telefone,
        endereco
    });

    //  validações de campos preenchidos
    if (!nome || !cpfCnpj || !telefone || !endereco) {
        console.warn("[VALIDAÇÃO] Campos vazios");
        mostrarToast("Preencha todos os campos obrigatórios", "erro");
        return;
    }

    // validação de nome >= 4 caracteres
    if (nome.length < 4 || nome.length > 45) {
        console.warn("[VALIDAÇÃO] Nome inválido");
        mostrarToast("Nome inválido, deve ter entre 4 e 45 caracteres", "erro");
        return;
    }

    // validação CPF/CNPJ e telefone
    if (!validarCpfCnpj(cpfCnpj)) {
        console.warn("[VALIDAÇÃO] CPF/CNPJ inválido:", cpfCnpj);
        mostrarToast("CPF/CNPJ inválido", "erro");
        return;
    }

    // validação telefone 11 dígitos
    const telefoneNumeros = telefone.replace(/\D/g, "");
    if (telefoneNumeros.length !== 11) {
        console.warn("[VALIDAÇÃO] Telefone inválido:", telefoneNumeros);
        mostrarToast("Telefone inválido", "erro");
        return;
    }

    // validação endereço entre 10 e 45 caracteres
    if (endereco.length < 10 || endereco.length > 45) {
        console.warn("[VALIDAÇÃO] Endereço inválido");
        mostrarToast("Endereço deve ter entre 10 e 45 caracteres", "erro");
        return;
    }

    // ENVIO BACKEND 
    try {
        const payload = new URLSearchParams({
            nome,
            cpfCnpj,
            telefone,
            endereco,
            ativo: 1
        });

        console.log("[FETCH] Enviando para backend:", payload.toString());

        const response = await fetch(
            "/Sewfy/controller/fornecedores/CadastroFornecedorController.php",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: payload
            }
        );

        console.log("[FETCH] Status HTTP:", response.status);

        const retorno = await response.text();
        console.log("[FETCH] Resposta do servidor:", retorno);

        if (response.ok) {
            console.log("[SUCESSO] Backend retornou OK");
            mostrarToast("Fornecedor cadastrado com sucesso!", "sucesso");

            document.querySelector("#fornecedorModal")?.remove();

            if (typeof atualizarListaFornecedores === "function") {
                console.log("[UI] Atualizando lista de fornecedores");
                atualizarListaFornecedores();
            }
        } else {
            console.error("[BACKEND ERRO]", retorno);
            mostrarToast(retorno, "erro");
        }
    } catch (erro) {
        console.error("[FETCH ERRO CRÍTICO]", erro);
        mostrarToast("Erro ao conectar com o servidor", "erro");
    }
}
