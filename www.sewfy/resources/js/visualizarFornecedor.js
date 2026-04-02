import { mostrarToast } from "./toast/toast.js";
import {
    mascaraCpfCnpj,
    mascaraTelefone,
    aplicarMascaraCpfCnpj,
    aplicarMascaraTelefone
} from "../js/assets/mascaras.js";
import { validarCpfCnpj } from "../js/assets/validacoes.js";

let modalHTMLCache = null;

async function carregarModalHTML() {
    if (modalHTMLCache) return modalHTMLCache;
    modalHTMLCache = await fetch(`${window.BASE_URL}/visualizar-fornecedor`)
        .then(res => res.text());
    return modalHTMLCache;
}

document.addEventListener("DOMContentLoaded", () => {
    carregarModalHTML();
});

// ABRIR MODAL
document.addEventListener("click", async (e) => {
    const botao = e.target.closest(".botao-visualizar-fornecedor");
    if (!botao) return;

    window.fornecedorAtualId = botao.dataset.id;

    try {
        const modalHTML = await carregarModalHTML();
        document.body.insertAdjacentHTML("afterbegin", modalHTML);

        const d = botao.dataset;

        document.getElementById("modal-nome").textContent     = d.nome;
        document.getElementById("modal-ativo").textContent    = d.ativo === "1" ? "Ativo" : "Inativo";
        document.getElementById("modal-cpfcnpj").textContent  = mascaraCpfCnpj(d.cpfcnpj);
        document.getElementById("modal-telefone").textContent = mascaraTelefone(d.telefone);
        document.getElementById("modal-endereco").textContent = d.endereco || '—';

    } catch (erro) {
        console.error(erro);
        mostrarToast(erro.message, "erro");
    }
});

// ATIVAR EDIÇÃO
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
            el.type  = "text";
            el.value = valor;
        }

        el.classList.add("input-edicao");
        el.dataset.field = field;
        el.id = span.id;

        if (field === "telefone") aplicarMascaraTelefone(el);
        if (field === "cpfCnpj")  aplicarMascaraCpfCnpj(el);

        span.replaceWith(el);
    });

    trocarBotaoParaSalvar();
}

// SALVAR
async function salvarFornecedor() {
    const nomeInput     = document.querySelector('[data-field="nome"]');
    const cpfInput      = document.querySelector('[data-field="cpfCnpj"]');
    const telefoneInput = document.querySelector('[data-field="telefone"]');
    const enderecoInput = document.querySelector('[data-field="endereco"]');
    const ativoInput    = document.querySelector('[data-field="ativo"]');

    const nome     = nomeInput.value.trim();
    const cpfCnpj  = cpfInput.value.trim();
    const telefone = telefoneInput.value.trim();
    const endereco = enderecoInput.value.trim();
    const ativo    = ativoInput.value === "1" ? 1 : 0;

    if (!nome || !cpfCnpj || !telefone || !endereco) {
        mostrarToast("Preencha todos os campos", "erro");
        return;
    }
    if (nome.length < 4 || nome.length > 45) {
        mostrarToast("Nome inválido", "erro");
        return;
    }
    if (!validarCpfCnpj(cpfCnpj)) {
        mostrarToast("CPF/CNPJ inválido", "erro");
        return;
    }
    if (cpfCnpj.replace(/\D/g, "").length !== 11 && cpfCnpj.replace(/\D/g, "").length !== 14) {
        mostrarToast("CPF/CNPJ inválido", "erro");
        return;
    }
    if (telefone.replace(/\D/g, "").length !== 11) {
        mostrarToast("Telefone inválido", "erro");
        return;
    }

    try {
        const response = await window.api.put(`/clifor/${window.fornecedorAtualId}`, {
            CLIFOR_TIPO:    "fornecedor",
            CLIFOR_NOME:    nome,
            CLIFOR_CPFCNPJ: cpfCnpj,
            CLIFOR_NUM:     telefone,
            CLIFOR_END:     endereco,
            CLIFOR_ATIV:    ativo
        });

        atualizarModalComDados({ nome, cpfCnpj, telefone, endereco, ativo });
        trocarBotaoParaEditar();
        window.atualizarListaFornecedores?.();
        mostrarToast(response.mensagem || "Fornecedor atualizado", "sucesso");

    } catch (erro) {
        mostrarToast(erro.message, "erro");
    }
}

// ATUALIZA MODAL
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
        } else if (input.dataset.field === "cpfCnpj") {
            span.textContent = mascaraCpfCnpj(dados.cpfCnpj);
        } else if (input.dataset.field === "telefone") {
            span.textContent = mascaraTelefone(dados.telefone);
        } else {
            span.textContent = input.value;
        }

        detail.replaceChild(span, input);
    });
}

function trocarBotaoParaSalvar() {
    const btn = document.querySelector(".btn-editar-fornecedor");
    btn.textContent = "Salvar alterações";
    btn.replaceWith(btn.cloneNode(true));
    document.querySelector(".btn-editar-fornecedor")
        .addEventListener("click", salvarFornecedor);
}

function trocarBotaoParaEditar() {
    const btn = document.querySelector(".btn-editar-fornecedor");
    btn.textContent = "Editar fornecedor";
    btn.replaceWith(btn.cloneNode(true));
    document.querySelector(".btn-editar-fornecedor")
        .addEventListener("click", ativarModoEdicao);
}

// FECHAR MODAL
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-close")) {
        document.querySelector(".fornecedormodal")?.remove();
    }
});