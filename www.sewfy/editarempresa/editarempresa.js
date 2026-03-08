import { mascaraCpfCnpj, mascaraTelefone, apenasNumeros, aplicarMascaraTelefone } from "../assets/mascaras.js";
import { verificarAuth, apiFetch } from "../assets/auth.js";
import { mostrarToast } from "../toast/toast.js";

verificarAuth();

const empId = new URLSearchParams(window.location.search).get("id");

if (!empId) {
    window.location.href = "/www.sewfy/listaempresas/listaempresas.html";
}

let emailOwnerOriginal = null;

document.addEventListener("DOMContentLoaded", async () => {
    await carregarEmpresa();

    document
        .getElementById("btn-salvar-empresa")
        ?.addEventListener("click", salvarEmpresa);

    document
        .querySelector(".modal-close")
        ?.addEventListener("click", fecharModal);

    // CNPJ somente leitura
    const campoCnpj = document.getElementById("cnpj");
    if (campoCnpj) {
        campoCnpj.setAttribute("readonly", true);
        campoCnpj.style.opacity = "0.6";
        campoCnpj.style.cursor  = "not-allowed";
    }

    // Máscaras
    const telefoneInput = document.getElementById("telefone");
    if (telefoneInput) aplicarMascaraTelefone(telefoneInput);

    const numInput = document.getElementById("num");
    if (numInput) aplicarMascaraTelefone(numInput);
});

function fecharModal() {
    const origem = sessionStorage.getItem("listaEmpresas_origem");
    if (origem) {
        sessionStorage.removeItem("listaEmpresas_origem");
        window.location.href = origem;
    } else {
        window.location.href = "/www.sewfy/listaempresas/listaempresas.html";
    }
}

async function carregarEmpresa() {
    try {
        const response = await apiFetch(`/api/adm/empresas/${empId}`, {
            method: "GET"
        });

        if (!response) return;

        if (response.status === 404) {
            mostrarToast("Empresa não encontrada.", "erro");
            desabilitarFormulario();
            return;
        }

        if (!response.ok) throw new Error("Erro ao buscar empresa.");

        const empresa = await response.json();
        preencherFormulario(empresa);

    } catch (error) {
        console.error("Erro ao carregar empresa:", error);
        mostrarToast("Não foi possível carregar os dados da empresa.", "erro");
        desabilitarFormulario();
    }
}

function preencherFormulario(empresa) {
    document.getElementById("cnpj").value                   = mascaraCpfCnpj(empresa.cnpj || "");
    document.getElementById("nome").value                   = empresa.nome || "";
    document.getElementById("email").value                  = empresa.email || "";
    document.getElementById("telefone").value               = mascaraTelefone(empresa.num || "");
    document.getElementById("razao-social").value           = empresa.raz || "";
    document.getElementById("status").value                 = String(empresa.ativo ?? "1");
    document.getElementById("usuario").value                = empresa.usuarioNome  || "";
    document.getElementById("email-usuario").value          = empresa.usuarioEmail || "";
    document.getElementById("num").value                    = mascaraTelefone(empresa.usuarioNum || "");
    document.getElementById("email-usuario-confirma").value = empresa.usuarioEmail || "";

    emailOwnerOriginal = empresa.usuarioEmail || "";

    const mapaModulos = {
        'rh':          'recursos humanos',
        'producao':    'producao',
        'faturamento': 'faturamento',
        'financeiro':  'financeiro',
        'compras':     'compras',
        'relatorios':  'relatorios'
    };

    const modulosAtivos = Array.isArray(empresa.modulos)
        ? empresa.modulos.map(m => normalizar(mapaModulos[m] ?? m))
        : [];

    document.querySelectorAll(".modulos-grid input[type='checkbox']").forEach(cb => {
        const spanTexto = cb.closest("label")?.querySelector("span")?.textContent?.trim();
        cb.checked = modulosAtivos.includes(normalizar(spanTexto));
    });
}

// Normaliza string para comparação: minúsculas e sem acentos
function normalizar(str = "") {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

async function salvarEmpresa() {
    const btn = document.getElementById("btn-salvar-empresa");

    const nome     = document.getElementById("nome")?.value.trim();
    const email    = document.getElementById("email")?.value.trim();
    const telefone = document.getElementById("telefone")?.value.trim();
    const razao    = document.getElementById("razao-social")?.value.trim();
    const status   = document.getElementById("status")?.value ?? "1";
    const cnpj     = document.getElementById("cnpj")?.value.trim();

    const usuarioNome          = document.getElementById("usuario")?.value.trim();
    const usuarioEmail         = document.getElementById("email-usuario")?.value.trim();
    const usuarioEmailConfirma = document.getElementById("email-usuario-confirma")?.value.trim();
    const usuarioNum           = document.getElementById("num")?.value.trim();

    if (!nome || !email || !razao || !telefone) {
        mostrarToast("Preencha todos os campos obrigatórios", "erro");
        return;
    }

    if (!usuarioNome || !usuarioEmail || !usuarioEmailConfirma || !usuarioNum) {
        mostrarToast("Preencha todos os campos do usuário principal", "erro");
        return;
    }

    if (usuarioEmail !== usuarioEmailConfirma) {
        mostrarToast("Os emails do usuário principal não coincidem", "erro");
        return;
    }

    const modulos = Array.from(
        document.querySelectorAll(".modulos-grid input[type='checkbox']:checked")
    ).map(cb => parseInt(cb.value));

    if (modulos.length === 0) {
        mostrarToast("Selecione ao menos um módulo", "erro");
        return;
    }

    btn.disabled    = true;
    btn.textContent = "Salvando...";

    const toastCarregando = mostrarToast("Salvando alterações...", "carregando");

    try {
        const response = await apiFetch(`/api/adm/empresas/${empId}`, {
            method: "PUT",
            body: JSON.stringify({
                EMP_NOME:     nome,
                EMP_RAZ:      razao,
                EMP_CNPJ:     apenasNumeros(cnpj),
                EMP_EMAIL:    email,
                EMP_NUM:      apenasNumeros(telefone),
                EMP_ATIV:     Number(status),
                modulos:      modulos,
                usuarioNome:  usuarioNome,
                usuarioEmail: emailOwnerOriginal,
                usuarioNum:   apenasNumeros(usuarioNum) || null,
            })
        });

        toastCarregando.remove();

        if (!response) return;

        const data = await response.json();

        if (!response.ok) {
            mostrarToast(data.erro || "Erro ao salvar alterações", "erro");
            return;
        }

        // Se o email mudou, dispara convite de troca de owner
        if (usuarioEmail !== emailOwnerOriginal) {
            const toastConvite = mostrarToast("Enviando convite para o novo proprietário...", "carregando");

            const conviteResponse = await apiFetch(`/api/adm/convites/trocar-owner`, {
                method: "POST",
                body: JSON.stringify({
                    EMP_ID:     parseInt(empId),
                    CONV_NOME:  usuarioNome,
                    CONV_EMAIL: usuarioEmail,
                    CONV_NUM:   apenasNumeros(usuarioNum) || null,
                })
            });

            toastConvite.remove();

            const conviteData = await conviteResponse.json();

            if (!conviteResponse.ok) {
                mostrarToast(conviteData.erro || "Erro ao enviar convite de troca de proprietário", "erro");
                return;
            }

            mostrarToast("Alterações salvas! Convite enviado para o novo proprietário.", "sucesso");
        } else {
            mostrarToast(data.mensagem || "Alterações salvas com sucesso!", "sucesso");
        }

    } catch (error) {
        toastCarregando.remove();
        console.error("Erro ao salvar empresa:", error);
        mostrarToast("Falha na comunicação com o servidor.", "erro");
    } finally {
        btn.disabled    = false;
        btn.textContent = "Salvar Alterações";
    }
}

function desabilitarFormulario() {
    document.querySelectorAll("input, select, button").forEach(el => {
        el.disabled = true;
    });
}