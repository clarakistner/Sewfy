import { mostrarToast } from "./toast/toast.js";
import { aplicarMascaraCpfCnpj, aplicarMascaraTelefone } from "../js/assets/mascaras.js";
import { validarCpfCnpj } from "../js/assets/validacoes.js";
import { getBaseUrl } from "./API_JS/api.js";


const url = getBaseUrl();
// ABRIR MODAL
document.addEventListener("click", (e) => {
    if (e.target.closest(".botao-criar-fornecedor")) {
        fetch(url+"/cadastro-fornecedor")
            .then(res => res.text())
            .then(html => {
                document.body.insertAdjacentHTML("afterbegin", html);
                setTimeout(() => inicializarEventosModal(), 50);
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
        document.querySelector("#fornecedorModal")?.remove();
    }
});

// INICIALIZAR EVENTOS
function inicializarEventosModal() {
    const form = document.querySelector("#fornecedor");
    if (!form) return;

    const nomeInput     = document.getElementById("fNome");
    const cpfCnpjInput  = document.getElementById("pCode");
    const telefoneInput = document.getElementById("fPhone");
    const enderecoInput = document.getElementById("fend");

    aplicarMascaraCpfCnpj(cpfCnpjInput);
    aplicarMascaraTelefone(telefoneInput);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await cadastrarFornecedor(nomeInput, cpfCnpjInput, telefoneInput, enderecoInput);
    });
}

// CADASTRAR FORNECEDOR
async function cadastrarFornecedor(nomeInput, cpfCnpjInput, telefoneInput, enderecoInput) {
    const nome     = nomeInput.value.trim();
    const cpfCnpj  = cpfCnpjInput.value.trim();
    const telefone = telefoneInput.value.trim();
    const endereco = enderecoInput.value.trim();

    if (!nome || !cpfCnpj || !telefone || !endereco) {
        mostrarToast("Preencha todos os campos obrigatórios", "erro");
        return;
    }
    if (nome.length < 4 || nome.length > 45) {
        mostrarToast("Nome inválido, deve ter entre 4 e 45 caracteres", "erro");
        return;
    }
    if (!validarCpfCnpj(cpfCnpj)) {
        mostrarToast("CPF/CNPJ inválido", "erro");
        return;
    }
    if (telefone.replace(/\D/g, "").length !== 11) {
        mostrarToast("Telefone inválido", "erro");
        return;
    }
    if (endereco.length < 10 || endereco.length > 45) {
        mostrarToast("Endereço deve ter entre 10 e 45 caracteres", "erro");
        return;
    }

    try {
        const response = await window.api.post("/clifor", {
            CLIFOR_TIPO:    "fornecedor",
            CLIFOR_NOME:    nome,
            CLIFOR_CPFCNPJ: cpfCnpj,
            CLIFOR_NUM:     telefone,
            CLIFOR_END:     endereco
        });

        mostrarToast(response.mensagem ?? "Fornecedor cadastrado!", "sucesso");
        document.querySelector("#fornecedorModal")?.remove();
        window.atualizarListaFornecedores?.();

    } catch (erro) {
        mostrarToast(erro.message ?? "Erro ao cadastrar fornecedor", "erro");
    }
}