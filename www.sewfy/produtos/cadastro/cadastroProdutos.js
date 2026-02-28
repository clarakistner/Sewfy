import { mostrarToast } from "../../toast/toast.js";
import { formatarMoeda, converterMoedaParaNumero } from "../../assets/mascaras.js"

console.log("[DEBUG] Script cadastroProdutos.js carregado!");

// ABRIR MODAL
document.addEventListener("click", (e) => {
    if (e.target.closest(".botao-criar-produto")) {
        console.log('[MODAL] Clique em "Novo Produto"');

        fetch("/Sewfy/www.sewfy/produtos/cadastro/cadastroProdutos.html")
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
        document.querySelector("#produtoModal")?.remove();
    }
});


// INICIALIZAR EVENTOS
function inicializarEventosModal() {
    const form = document.querySelector("#Produto");
    console.log("[INIT] Form encontrado?", !!form);
    if (!form) return;

    // linka as variaveis com os inputs pelo id
    const codInput = document.getElementById("pCode");
    const tipoInput = document.getElementById("pTipo");
    const nomeInput = document.getElementById("pNome");
    const umInput = document.getElementById("pUm");
    const descInput = document.getElementById("pDesc");
    const precoInput = document.getElementById("pPreco");

    // MÁSCARA DE MOEDA
    precoInput.addEventListener("input", (e) => {
        let valor = e.target.value;

        // remove tudo que não é número
        valor = valor.replace(/\D/g, "");

        // transforma em centavos
        valor = (Number(valor) / 100).toFixed(2);

        // formata para BRL
        e.target.value = formatarMoeda(valor);
    });

    console.log("[INIT] Inputs:", {
        codInput,
        tipoInput,
        nomeInput,
        umInput,
        descInput,
        precoInput
    });

    form.addEventListener("submit", async (e) => {
        console.log("[SUBMIT] Evento submit disparado");
        e.preventDefault();
        e.stopPropagation();

        // manda pra função cadastrarProduto os dados que estão nas variaveis 
        await cadastrarProduto(
            codInput,
            tipoInput,
            nomeInput,
            umInput,
            descInput,
            precoInput
        );
    });
}


// função de cadastro
async function cadastrarProduto( // recebe os dados enviados no inicializarEventosModal
    codInput,
    tipoInput,
    nomeInput,
    umInput,
    descInput,
    precoInput
) {
    console.log("[CADASTRO] Iniciando");

    const cod = codInput.value.trim();
    const nome = nomeInput.value.trim();
    const desc = descInput.value.trim();
    const precoFormatado = precoInput.value.trim();
    console.log("preço antes de formatado: " , precoFormatado);
    const preco = converterMoedaParaNumero(precoFormatado); // remove a máscara
    console.log("preço depois de formatado: " , preco);
    const tipoValor = tipoInput.value.trim();
    const um   = umInput.value.trim();

    const tipo =
        tipoValor === 'IN' ? 1 :
        tipoValor === 'PA' ? 2 :
        (() => { throw new Error('Tipo inválido'); })();

    // exibe no console os dados armazenados 
    console.log("[CADASTRO] Dados capturados:", {
        cod,
        tipo,
        nome,
        um,
        desc,
        preco
    });

    //  validações de campos preenchidos
    if (!cod || !tipo || !nome || !um) {
        console.warn("[VALIDAÇÃO] Campos vazios");
        mostrarToast("Preencha todos os campos obrigatórios", "erro");
        return;
    }

    // validação de cod entre 4 e 10 caracteres
    if (cod.length < 4 || cod.length > 10) {
        console.warn("[VALIDAÇÃO] código inválido");
        mostrarToast("Código inválido, deve ter entre 4 e 10 caracteres", "erro");
        return;
    }

    // nome entre 5 e 30 caracteres
    if (nome.length < 5 || nome.length > 30) {
        console.warn("[VALIDAÇÃO] nome inválido");
        mostrarToast("Nome inválido, deve ter entre 5 e 30 caracteres", "erro");
        return;
    }

    // descrição > 60
    if (desc.length > 60) {
        console.warn("[VALIDAÇÃO] Descrição inválida");
        mostrarToast("Descrição deve ter menos de 60 caracteres", "erro");
        return;
    }

    // ENVIO BACKEND 
    try {
        const payload = {
            cod,
            tipo,
            nome,
            um,
            desc,
            preco
        };

        console.log("[FETCH] Enviando para backend:", payload);

        // espera a resposta do fetch
        const response = await fetch("/Sewfy/api/produtos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });


        //trata a resposta do fetch abaixo
        console.log("[FETCH] Status HTTP:", response.status);

        const retorno = await response.json();
        console.log("[FETCH] Resposta do servidor:", retorno);

        if (response.ok) {
            console.log("[SUCESSO] Backend retornou OK");
            mostrarToast("Produto cadastrado com sucesso!", "sucesso");

            document.querySelector("#produtoModal")?.remove();

            if (typeof atualizarListaProdutos === "function") {
                console.log("[UI] Atualizando lista de produtos");
                atualizarListaProdutos();
            }
        } else {
            console.error("[BACKEND ERRO]", retorno);
             mostrarToast(retorno.erro || "Erro ao cadastrar produto", "erro");
        }
    } catch (erro) {
        console.error("[FETCH ERRO CRÍTICO]", erro);
        mostrarToast("Erro ao conectar com o servidor", "erro");
    }
}
