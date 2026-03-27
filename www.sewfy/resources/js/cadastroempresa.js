import { aplicarMascaraCpfCnpj, aplicarMascaraTelefone, apenasNumeros } from "./../assets/mascaras.js";
import { validarCNPJ } from "./../assets/validacoes.js";
import { verificarAuth, apiFetch } from "../assets/auth.js";
import { mostrarToast } from "./toast/toast.js";

// Verifica autenticação ao carregar a página
verificarAuth();



// Configura eventos após o DOM estar pronto
document.addEventListener('DOMContentLoaded', () => {
  

    // Aplica máscaras nos campos
    aplicarMascaraCpfCnpj(document.getElementById("cnpj"));
    aplicarMascaraTelefone(document.getElementById("telefone"));
    aplicarMascaraTelefone(document.getElementById("num"));

    document.getElementById("btn-cadastrar-empresa").addEventListener("click", cadastrarEmpresa);
});


// Função principal para cadastrar empresa
async function cadastrarEmpresa() {
    const nome          = document.getElementById("nome")?.value.trim();
    const cnpj          = document.getElementById("cnpj")?.value.trim();
    const email         = document.getElementById("email")?.value.trim();
    const telefone      = document.getElementById("telefone")?.value.trim();
    const razao         = document.getElementById("razao-social")?.value.trim();
    const convNome      = document.getElementById("usuario")?.value.trim();
    const convEmail     = document.getElementById("email-usuario")?.value.trim();
    const numUsuario    = document.getElementById("num")?.value.trim();
    const emailConfirma = document.getElementById("email-usuario-confirma")?.value.trim();

    const modulos = Array.from(
        document.querySelectorAll(".modulos-grid input[type=checkbox]:checked")
    ).map(cb => parseInt(cb.value));

    // Validações
    if (!nome || !cnpj || !email || !razao || !convNome || !convEmail || !telefone || !numUsuario || !emailConfirma) {
        mostrarToast("Preencha todos os campos obrigatórios", "erro");
        return;
    }

    if (convEmail !== emailConfirma) {
        mostrarToast("Os emails não coincidem", "erro");
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

    // Limpa formatações para validação e envio
    const cnpjLimpo     = apenasNumeros(cnpj);
    const telefoneLimpo = apenasNumeros(telefone);
    const numLimpo      = apenasNumeros(numUsuario);

    if (!validarCNPJ(cnpjLimpo)) {
        mostrarToast("CNPJ inválido", "erro");
        return;
    }

    if (modulos.length === 0) {
        mostrarToast("Selecione ao menos um módulo", "erro");
        return;
    }

    // Prepara payload para envio
    const payload = {
        EMPP_NOME:  nome,
        EMPP_RAZ:   razao,
        EMPP_CNPJ:  cnpjLimpo,
        EMPP_EMAIL: email,
        EMPP_NUM:   telefoneLimpo || null,
        ADM_ID:     1,
        modulos:    modulos,
        CONV_NOME:  convNome,
        CONV_EMAIL: convEmail,
        CONV_NUM:   numLimpo
    };

    try {
      
        const toastCarregando = mostrarToast("Enviando cadastro...", "carregando");

        // Envia requisição para API
        const response = await apiFetch("/api/adm/convites/owner", {
            method: "POST",
            body: JSON.stringify(payload)
        });

        // Remove toast de carregamento
        toastCarregando.remove();

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


// Função para limpar o formulário após cadastro
function limparFormulario() {
    document.getElementById("nome").value             = "";
    document.getElementById("cnpj").value             = "";
    document.getElementById("email").value            = "";
    document.getElementById("telefone").value         = "";
    document.getElementById("razao-social").value     = "";
    document.getElementById("usuario").value          = "";
    document.getElementById("email-usuario").value    = "";
    document.getElementById("num").value              = "";
    document.getElementById("email-usuario-confirma").value = "";

    document.querySelectorAll(".modulos-grid input[type=checkbox]")
        .forEach(cb => cb.checked = false);
}