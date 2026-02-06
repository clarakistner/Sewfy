import { mostrarToast } from "../../toast/toast.js";
import {
    mascaraCpfCnpj,
    mascaraTelefone,
    aplicarMascaraCpfCnpj,
    aplicarMascaraTelefone
} from "../../assets/mascaras.js";
import { validarCpfCnpj } from "../../assets/validacoes.js";

console.log("[DEBUG] Script visualizarFornecedor.js carregado!");

// Abrir modal
document.addEventListener("click", async (e) => {
    const botao = e.target.closest(".botao-visualizar-fornecedor");
    if (!botao) return;

    window.fornecedorAtualId = botao.dataset.id;

    try {
        const modalHTML = await fetch(
            "/Sewfy/view/fornecedores/visualizar/visualizarFornecedores.html"
        ).then(res => res.text());

        document.body.insertAdjacentHTML("afterbegin", modalHTML);

        const response = await fetch(
            `/Sewfy/controller/fornecedores/VisualizarFornecedorController.php?id=${window.fornecedorAtualId}`
        );

        if (!response.ok) throw new Error();

        const fornecedor = await response.json();

        document.getElementById("modal-nome").textContent = fornecedor.nome;
        document.getElementById("modal-cpfcnpj").textContent = mascaraCpfCnpj(fornecedor.cpfCnpj);
        document.getElementById("modal-telefone").textContent = mascaraTelefone(fornecedor.telefone);
        document.getElementById("modal-endereco").textContent = fornecedor.endereco;
        document.getElementById("modal-ativo").textContent = fornecedor.ativo ? "Ativo" : "Inativo";

    } catch {
        mostrarToast("Erro ao carregar fornecedor", "erro");
    }
});

// Ativar edição
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-editar-fornecedor")) {
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
        } else {
            el = document.createElement("input");
            el.type = "text";
            el.value = valor;
        }

        el.classList.add("input-edicao");
        el.dataset.field = field;
        el.id = span.id;

        if (field === "telefone") aplicarMascaraTelefone(el);
        if (field === "cpfCnpj") aplicarMascaraCpfCnpj(el);

        span.replaceWith(el);
    });

    trocarBotaoParaSalvar();
}

function trocarBotaoParaSalvar() {
    const btn = document.querySelector(".btn-editar-fornecedor");
    btn.textContent = "Salvar alterações";
    btn.classList.add("modo-salvar");
    btn.replaceWith(btn.cloneNode(true));
    document.querySelector(".btn-editar-fornecedor")
        .addEventListener("click", salvarFornecedor);
}

async function salvarFornecedor() {

    const nomeInput = document.querySelector('[data-field="nome"]');
    const cpfInput = document.querySelector('[data-field="cpfCnpj"]');
    const telInput = document.querySelector('[data-field="telefone"]');
    const endInput = document.querySelector('[data-field="endereco"]');
    const ativoInput = document.querySelector('[data-field="ativo"]');

    if (!nomeInput || !cpfInput || !telInput || !endInput || !ativoInput) {
        mostrarToast("Erro interno no formulário", "erro");
        return;
    }

    const nome = nomeInput.value.trim();
    const cpf = cpfInput.value.trim().replace(/\D/g, "");
    const telefone = telInput.value.trim().replace(/\D/g, "");
    const endereco = endInput.value.trim();
    const ativo = ativoInput.value === "1" ? 1 : 0;

    if (!nome || !cpf || !telefone || !endereco) {
        mostrarToast("Preencha todos os campos", "erro");
        return;
    }

    if (nome.length < 4 || nome.length > 45) {
        mostrarToast("Nome inválido, deve ter entre 4 e 45 caracteres", "erro");
        return;
    }

    if (!validarCpfCnpj(cpf)) {
        mostrarToast("CPF/CNPJ inválido", "erro");
        return;
    }

    if (telefone.length !== 11) {
        mostrarToast("Telefone inválido", "erro");
        return;
    }

    if (endereco.length < 10 || endereco.length > 45) {
        mostrarToast("Endereço deve ter entre 10 e 45 caracteres", "erro");
        return;
    }

    const formData = new FormData();
    formData.append("id", window.fornecedorAtualId);
    formData.append("nome", nome);
    formData.append("cpfCnpj", cpf);
    formData.append("telefone", telefone);
    formData.append("endereco", endereco);
    formData.append("ativo", ativo);

    try {
        const response = await fetch(
            "/Sewfy/controller/fornecedores/EditarFornecedorController.php",
            { method: "POST", body: formData }
        );

        const resultado = await response.text();

        if (!response.ok) throw new Error(resultado);

        atualizarModalComDados({ nome, cpf, telefone, endereco, ativo });
        trocarBotaoParaEditar();
        window.atualizarListaFornecedores?.();
        mostrarToast(resultado, "sucesso");

    } catch (e) {
        mostrarToast(e.message, "erro");
    }
}

function atualizarModalComDados(dados) {
    document.querySelectorAll(".detail").forEach(detail => {
        const input = detail.querySelector(".input-edicao");
        if (!input) return;

        const span = document.createElement("span");
        span.classList.add("value");
        span.dataset.field = input.dataset.field;
        span.id = input.id;

        if (input.dataset.field === "ativo") {
            span.textContent = dados.ativo ? "Ativo" : "Inativo";
        } else {
            span.textContent = input.value;
        }

        detail.replaceChild(span, input);
    });
}

function trocarBotaoParaEditar() {
    const btn = document.querySelector(".btn-editar-fornecedor");
    btn.textContent = "Editar fornecedor";
    btn.classList.remove("modo-salvar");
    btn.replaceWith(btn.cloneNode(true));
    document.querySelector(".btn-editar-fornecedor")
        .addEventListener("click", ativarModoEdicao);
}

// Fechar modal
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-close")) {
        document.querySelector(".fornecedormodal")?.remove();
    }
});
