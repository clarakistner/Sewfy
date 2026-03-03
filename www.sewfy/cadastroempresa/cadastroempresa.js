import { aplicarMascaraCpfCnpj, aplicarMascaraTelefone, apenasNumeros } from "./../assets/mascaras.js";
import { validarCNPJ } from "./../assets/validacoes.js";
import { verificarAuth, apiFetch } from "../assets/auth.js";
import { mostrarToast } from "../toast/toast.js";

verificarAuth();

console.log("[DEBUG] Script cadastroEmpresas.js carregado!");

document.addEventListener('DOMContentLoaded', () => {
    console.log("[INIT] DOM carregado!");

    const cnpjInput    = document.getElementById("cnpj");
    const telefoneInput = document.getElementById("telefone");

    aplicarMascaraCpfCnpj(cnpjInput);
    aplicarMascaraTelefone(telefoneInput);

    document.getElementById("btn-cadastrar-empresa").addEventListener("click", cadastrarEmpresa);
});


async function cadastrarEmpresa() {
    const nome       = document.getElementById("nome")?.value.trim();
    const cnpj       = document.getElementById("cnpj")?.value.trim();
    const email      = document.getElementById("email")?.value.trim();
    const telefone   = document.getElementById("telefone")?.value.trim();
    const razao      = document.getElementById("razao-social")?.value.trim();
    const convNome   = document.getElementById("usuario")?.value.trim();
    const convEmail  = document.getElementById("email-usuario")?.value.trim();

    // Pega os módulos selecionados
    const modulos = Array.from(
        document.querySelectorAll(".modulos-grid input[type=checkbox]:checked")
    ).map(cb => parseInt(cb.value));

    // Validações
    if (!nome || !cnpj || !email || !razao || !convNome || !convEmail) {
        mostrarToast("Preencha todos os campos obrigatórios", "erro");
        return;
    }

    if (nome.length > 50) {
        mostrarToast("Nome da empresa deve ter no máximo 50 caracteres", "erro");
        return;
    }

    if (razao.length > 100) {
        mostrarToast("Razão social deve ter no máximo 100 caracteres", "erro");
        return;
    }

    if (email.length > 50) {
        mostrarToast("Email deve ter no máximo 50 caracteres", "erro");
        return;
    }

    const cnpjLimpo = apenasNumeros(cnpj);
    if (!validarCNPJ(cnpjLimpo)) {
        mostrarToast("CNPJ inválido", "erro");
        return;
    }

    if (modulos.length === 0) {
        mostrarToast("Selecione ao menos um módulo", "erro");
        return;
    }

    const payload = {
        EMPP_NOME:  nome,
        EMPP_RAZ:   razao,
        EMPP_CNPJ:  cnpjLimpo,
        EMPP_EMAIL: email,
        EMPP_NUM:   telefone || null,
        ADM_ID:     1,
        modulos:    modulos,
        CONV_NOME:  convNome,
        CONV_EMAIL: convEmail
    };

    try {
        console.log("[FETCH] Enviando cadastro de empresa...", payload);
        const toastCarregando = mostrarToast("Enviando cadastro...", "carregando");

        const response = await apiFetch("/api/adm/convites/owner", {
            method: "POST",
            body: JSON.stringify(payload)
        });

        toastCarregando.remove(); // remove o toast de carregando

        if (!response) return;

        const data = await response.json();

        if (response.ok) {
            mostrarToast("Convite enviado com sucesso!", "sucesso");
            limparFormulario();
        } else {
            mostrarToast(data.erro || "Erro ao cadastrar empresa", "erro");
        }

    } catch (erro) {
        console.error("[ERRO FETCH]", erro);
        mostrarToast("Erro ao conectar com o servidor", "erro");
    }
}


function limparFormulario() {
    document.getElementById("nome").value        = "";
    document.getElementById("cnpj").value        = "";
    document.getElementById("email").value       = "";
    document.getElementById("telefone").value    = "";
    document.getElementById("razao-social").value = "";
    document.getElementById("usuario").value     = "";
    document.getElementById("email-usuario").value = "";

    document.querySelectorAll(".modulos-grid input[type=checkbox]")
        .forEach(cb => cb.checked = false);
}