import { mostrarToast } from "../../toast/toast.js";
import { formatarMoeda, converterMoedaParaNumero } from "../../assets/mascaras.js"

console.log("[DEBUG] Script visualizarProdutos.js carregado!");

// ABRIR MODAL
document.addEventListener("click", async (e) => {
    const botao = e.target.closest(".botao-visualizar-produto");
    if (!botao) return;

    window.produtoAtualId = botao.dataset.id;

    try {
        console.log(window.produtoAtualId);
        const modalHTML = await fetch(
            "/Sewfy/view/produtos/visualizar/visualizarProdutos.html"
        ).then(res => res.text());

        document.body.insertAdjacentHTML("afterbegin", modalHTML);

        const response = await fetch(
            `/Sewfy/api/produtos/${window.produtoAtualId}`
        );

        const produto = await response.json();

        if (!response.ok) {
            throw new Error(produto.erro || "Erro ao buscar produto");
        }

        document.getElementById("modal-cod").textContent = produto.cod;
        document.getElementById("modal-tipo").textContent = produto.tipo;
        document.getElementById("modal-nome").textContent = produto.nome;
        document.getElementById("modal-um").textContent = produto.um;
        document.getElementById("modal-preco").textContent = formatarMoeda(produto.preco);
        document.getElementById("modal-cadastro").textContent = produto.ativo ? "Ativo" : "Inativo";
        document.getElementById("modal-desc").textContent = produto.desc ?? "";

    } catch (erro) {
        mostrarToast(erro.message || "Erro ao carregar produto", "erro");
    }
});


// ATIVAR EDIÇÃO
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-editar-produto")) {
        ativarModoEdicao();
    }
});


function ativarModoEdicao() {

    document.querySelectorAll(".value").forEach(span => {
        const field = span.dataset.field;
        const valor = span.textContent.trim();
        let el;

        if (field === "ativo") {
            el = document.createElement("select");
            el.innerHTML = `
                <option value="1">Ativo</option>
                <option value="0">Inativo</option>
            `;
            el.value = valor === "Ativo" ? "1" : "0";

        } else if (field === "um") {
            el = document.createElement("select");
            el.innerHTML = `
                <option value="UN">UN</option>
                <option value="KG">KG</option>
                <option value="MT">MT</option>
            `;
            el.value = valor;

        } else if (field === "tipo") {
            el = document.createElement("select");
            el.innerHTML = `
                <option value="1">Insumo</option>
                <option value="2">Produto Acabado</option>
            `;
            el.value = valor === "Insumo" ? "1" : "2";

        } else if (field === "preco") {
            el = document.createElement("input");
            el.type = "text";
            el.value = valor;

            el.addEventListener("input", (e) => {
                let valor = e.target.value;
                valor = valor.replace(/\D/g, "");
                valor = (Number(valor) / 100).toFixed(2);
                e.target.value = formatarMoeda(valor);
            });

        } else {
            el = document.createElement("input");
            el.type = "text";
            el.value = valor;
        }

        el.classList.add("input-edicao");
        el.dataset.field = field;
        el.id = span.id;

        span.replaceWith(el);
    });

    trocarBotaoParaSalvar();
}


// TROCAR BOTÃO
function trocarBotaoParaSalvar() {
    const btn = document.querySelector(".btn-editar-produto");
    btn.textContent = "Salvar alterações";
    btn.classList.add("modo-salvar");
    btn.replaceWith(btn.cloneNode(true));
    document.querySelector(".btn-editar-produto")
        .addEventListener("click", salvarProduto);
}


// SALVAR PRODUTO
async function salvarProduto() {

    const codInput = document.querySelector('[data-field="codigo"]');
    const tipoInput = document.querySelector('[data-field="tipo"]');
    const ativoInput = document.querySelector('[data-field="ativo"]');
    const nomeInput = document.querySelector('[data-field="nome"]');
    const umInput = document.querySelector('[data-field="um"]');
    const descInput = document.querySelector('[data-field="descricao"]');
    const precoInput = document.querySelector('[data-field="preco"]');

    if (!codInput || !tipoInput || !nomeInput || !umInput || !ativoInput) {
        mostrarToast("Erro interno no formulário", "erro");
        return;
    }

    const cod = codInput.value.trim();
    const tipo = Number(tipoInput.value.trim());
    const ativo = ativoInput.value === "1" ? 1 : 0;
    const nome = nomeInput.value.trim();
    const um = umInput.value.trim();
    const desc = descInput.value.trim();
    const preco = converterMoedaParaNumero(precoInput.value.trim());

    if (!cod || !tipo || !nome || !um) {
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

    const payload = {
        id: window.produtoAtualId,
        cod,
        tipo,
        nome,
        um,
        desc,
        preco,
        ativo
    };

    try {
        const response = await fetch(
            `/Sewfy/api/produtos/${window.produtoAtualId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    cod,
                    tipo,
                    nome,
                    um,
                    desc,
                    preco,
                    ativo
                })
            }
        );

        const texto = await response.text();
        console.log("Resposta bruta:", texto);

        let resultado;

        try {
            resultado = JSON.parse(texto);
        } catch (e) {
            throw new Error("Resposta inválida do servidor");
        }

        if (!response.ok) {
            throw new Error(resultado.erro || "Erro ao editar produto");
        }

        atualizarModalComDados(payload);
        trocarBotaoParaEditar();
        window.atualizarListaProdutos();
        mostrarToast("Produto atualizado com sucesso", "sucesso");

    } catch (e) {
        mostrarToast(e.message, "erro");
    }
}


// ATUALIZAR MODAL
function atualizarModalComDados(dados) {

    document.querySelectorAll(".detail").forEach(detail => {
        const input = detail.querySelector(".input-edicao");
        if (!input) return;

        const span = document.createElement("span");
        span.classList.add("value");
        span.dataset.field = input.dataset.field;
        span.id = input.id;

        if (input.dataset.field === "ativo") {
            span.textContent = input.value === "1" ? "Ativo" : "Inativo";

        } else if (input.dataset.field === "tipo") {
            span.textContent = input.value === "1"
                ? "Insumo"
                : "Produto Acabado";

        } else if (input.dataset.field === "preco") {
            span.textContent = formatarMoeda(
                converterMoedaParaNumero(input.value)
            );
        } else {
            span.textContent = input.value;
        }

        detail.replaceChild(span, input);
    });
}


// VOLTAR BOTÃO
function trocarBotaoParaEditar() {
    const btn = document.querySelector(".btn-editar-produto");
    btn.textContent = "Editar Produto";
    btn.classList.remove("modo-salvar");
    btn.replaceWith(btn.cloneNode(true));
    document.querySelector(".btn-editar-produto")
        .addEventListener("click", ativarModoEdicao);
}


// FECHAR MODAL
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-close")) {
        document.querySelector(".produtomodal")?.remove();
    }
});