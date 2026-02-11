import { mostrarToast } from "../../toast/toast.js";
import { formatarMoeda, converterMoedaParaNumero } from "../../assets/mascaras.js"

console.log("[DEBUG] Script visualizarProdutos.js carregado!");

// Abrir modal
document.addEventListener("click", async (e) => {
    const botao = e.target.closest(".botao-visualizar-produto");
    if (!botao) return;

    // recebe o id do produto em que foi pressionado
    window.produtoAtualId = botao.dataset.id;

    try {
        const modalHTML = await fetch(
            "/Sewfy/view/produtos/visualizar/visualizarProdutos.html"
        ).then(res => res.text());

        document.body.insertAdjacentHTML("afterbegin", modalHTML);

        const response = await fetch(
            `/Sewfy/controller/produtos/VisualizarProdutoController.php?id=${window.produtoAtualId}`
        );

        if (!response.ok) throw new Error();

        const produto = await response.json();

        // exibe os dados mandados pelo fetch 
        document.getElementById("modal-cod").textContent = produto.cod;
        document.getElementById("modal-tipo").textContent = produto.tipo;
        document.getElementById("modal-nome").textContent = produto.nome;
        document.getElementById("modal-um").textContent = produto.um;
        document.getElementById("modal-preco").textContent = formatarMoeda(produto.preco);
        document.getElementById("modal-cadastro").textContent = produto.ativo ? "Ativo" : "Inativo";
        document.getElementById("modal-desc").textContent = produto.desc;
        
        
    } catch {
        mostrarToast("Erro ao carregar produto", "erro");
    }
});

// Ativar edição
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-editar-produto")) {
        // ao pressionar o botão de edição, o modo edição abre
        ativarModoEdicao();
    }
});


// modo edição
function ativarModoEdicao() {
    // para cada span que exibe a informação ele vai criar uma variavel field e valor e vai trocar por input
    document.querySelectorAll(".value").forEach(span => {
        const field = span.dataset.field;
        const valor = span.textContent.trim();
        let el;

        // se for ativo ele faz um select ao inves de input e faz essas verificações para outros campos também
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

            // aplica máscara enquanto digita
            el.addEventListener("input", (e) => {
                let valor = e.target.value;

                // remove tudo que não é número
                valor = valor.replace(/\D/g, "");

                // transforma em centavos
                valor = (Number(valor) / 100).toFixed(2);

                // formata para BRL
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

    // chama a função que troca o conteúdo do botão
    trocarBotaoParaSalvar();
}

// função do botão
function trocarBotaoParaSalvar() {
    const btn = document.querySelector(".btn-editar-produto");
    btn.textContent = "Salvar alterações";
    btn.classList.add("modo-salvar");
    btn.replaceWith(btn.cloneNode(true));
    document.querySelector(".btn-editar-produto")
        .addEventListener("click", salvarProduto);
}

// manda os dados novos para o back
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
    const tipo = tipoInput.value.trim();
    const ativo = ativoInput.value === "1" ? 1 : 0;
    const nome = nomeInput.value.trim();
    const um = umInput.value.trim();
    const desc = descInput.value.trim();
    const preco = converterMoedaParaNumero(precoInput.value.trim());

    if (!cod || !tipo || !nome || !um) {
        mostrarToast("Preencha todos os campos obrigatórios", "erro");
        return;
    }

    // mesmas validações do cadastro

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

    // joga todos os dados dentro de formData
    const formData = new FormData();
    formData.append("id", window.produtoAtualId);
    formData.append("cod", cod);
    formData.append("tipo", tipo);
    formData.append("nome", nome);
    formData.append("um", um);
    formData.append("desc", desc);
    formData.append("preco", preco);
    formData.append("ativo", ativo);

    try {
        const response = await fetch(
            "/Sewfy/controller/produtos/EditarProdutoController.php",
            { method: "POST", body: formData } // faz o fecht com o controller da edição e envia os dados de formData
        );

        const resultado = await response.text();

        if (!response.ok) throw new Error(resultado);

        // atualiza o modal de visualização com os novos dados
        atualizarModalComDados({ cod, tipo, nome, um, desc, preco, ativo });
        // muda o conteúdo do botão para original
        trocarBotaoParaEditar();
        // atualiza a lista de produtos
        window.atualizarListaProdutos?.();
        mostrarToast(resultado, "sucesso");

    } catch (e) {
        mostrarToast(e.message, "erro");
    }
}


// modal após o salvamento das edições
function atualizarModalComDados(dados) {
    // para cada input ele vai criar um span
    document.querySelectorAll(".detail").forEach(detail => {
        const input = detail.querySelector(".input-edicao");
        if (!input) return;

        const span = document.createElement("span");
        span.classList.add("value");
        span.dataset.field = input.dataset.field;
        span.id = input.id;

        // trata os dados especiais como ativo, tipo e a máscara de preço R$ 00,00
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

// função para o conteúdo do botão ser de edição
function trocarBotaoParaEditar() {
    const btn = document.querySelector(".btn-editar-produto");
    btn.textContent = "Editar Produto";
    btn.classList.remove("modo-salvar");
    btn.replaceWith(btn.cloneNode(true));
    document.querySelector(".btn-editar-produto")
        .addEventListener("click", ativarModoEdicao);
}

// Fechar modal
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-close")) {
        document.querySelector(".produtomodal")?.remove();
    }
});
