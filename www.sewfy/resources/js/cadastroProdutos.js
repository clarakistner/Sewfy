import { mostrarToast } from "../../toast/toast.js";
import { formatarMoeda, converterMoedaParaNumero } from "../../assets/mascaras.js";

// ABRIR MODAL
document.addEventListener("click", (e) => {
    if (e.target.closest(".botao-criar-produto")) {
        fetch("/www.sewfy/produtos/cadastro/index.html")
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
        document.querySelector("#produtoModal")?.remove();
    }
});

// INICIALIZAR EVENTOS
function inicializarEventosModal() {
    const form = document.querySelector("#Produto");
    if (!form) return;

    const codInput    = document.getElementById("pCode");
    const tipoInput   = document.getElementById("pTipo");
    const nomeInput   = document.getElementById("pNome");
    const umInput     = document.getElementById("pUm");
    const descInput   = document.getElementById("pDesc");
    const precoInput  = document.getElementById("pPreco");
    const checkCliFor = document.getElementById("checkCliFor");
    const toggleLabel = document.querySelector(".toggle-label");

    precoInput.addEventListener("input", (e) => {
        let valor = e.target.value.replace(/\D/g, "");
        valor = (Number(valor) / 100).toFixed(2);
        e.target.value = formatarMoeda(valor);
    });

    checkCliFor.addEventListener("change", () => {
        toggleLabel.textContent = checkCliFor.checked ? "Sim" : "Não";
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await cadastrarProduto(codInput, tipoInput, nomeInput, umInput, descInput, precoInput, checkCliFor);
    });
}

// CADASTRAR
async function cadastrarProduto(codInput, tipoInput, nomeInput, umInput, descInput, precoInput, checkCliFor) {
    const cod   = codInput.value.trim();
    const nome  = nomeInput.value.trim();
    const desc  = descInput.value.trim();
    const preco = converterMoedaParaNumero(precoInput.value.trim());
    const tipo  = tipoInput.value;
    const um    = umInput.value;
    const necessitaCliFor = checkCliFor.checked;

    if (!cod || !nome || !tipo || !um) {
        mostrarToast("Preencha todos os campos obrigatórios", "erro");
        return;
    }
    if (cod.length < 4 || cod.length > 10) {
        mostrarToast("Código inválido, deve ter entre 4 e 10 caracteres", "erro");
        return;
    }
    if (nome.length < 5 || nome.length > 30) {
        mostrarToast("Nome inválido, deve ter entre 5 e 30 caracteres", "erro");
        return;
    }
    if (desc.length > 60) {
        mostrarToast("Descrição deve ter menos de 60 caracteres", "erro");
        return;
    }

    try {
        const response = await window.api.post("/produtos", {
            PROD_COD:         cod,
            PROD_NOME:        nome,
            PROD_TIPO:        tipo,
            PROD_UM:          um,
            PROD_DESC:        desc  || null,
            PROD_PRECO:       preco || null,
            NECESSITA_CLIFOR: necessitaCliFor
        });

        mostrarToast(response.mensagem || "Produto cadastrado com sucesso!", "sucesso");
        document.querySelector("#produtoModal")?.remove();
        window.atualizarListaProdutos?.();

    } catch (erro) {
        console.error("[FETCH ERRO]", erro);
        mostrarToast(erro.message || "Erro ao cadastrar produto", "erro");
    }
}