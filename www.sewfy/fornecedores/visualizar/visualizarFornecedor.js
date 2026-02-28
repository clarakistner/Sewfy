import { mostrarToast } from "../../toast/toast.js";
import {
    mascaraCpfCnpj,
    mascaraTelefone,
    aplicarMascaraCpfCnpj,
    aplicarMascaraTelefone
} from "../../assets/mascaras.js";
import { validarCpfCnpj } from "../../assets/validacoes.js";

console.log("[DEBUG] Script visualizarFornecedor.js carregado!");

// ABRIR MODAL
document.addEventListener("click", async (e) => {
    const botao = e.target.closest(".botao-visualizar-fornecedor");
    if (!botao) return;

    window.fornecedorAtualId = botao.dataset.id;

    try {
        const modalHTML = await fetch(
            "/Sewfy/www.sewfy/fornecedores/visualizar/visualizarFornecedores.html"
        ).then(res => res.text());

        document.body.insertAdjacentHTML("afterbegin", modalHTML);

        const response = await fetch(
            `/Sewfy/api/fornecedores/${window.fornecedorAtualId}`
        );

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.erro || "Erro ao buscar fornecedor");
        }

        const fornecedor = await response.json();

        document.getElementById("modal-nome").textContent = fornecedor.nome;
        document.getElementById("modal-cpfcnpj").textContent = mascaraCpfCnpj(fornecedor.cpfCnpj);
        document.getElementById("modal-telefone").textContent = mascaraTelefone(fornecedor.telefone);
        document.getElementById("modal-endereco").textContent = fornecedor.endereco;
        document.getElementById("modal-ativo").textContent = fornecedor.ativo ? "Ativo" : "Inativo";

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

// SALVAR 
async function salvarFornecedor() {

    const nome = document.querySelector('[data-field="nome"]').value.trim();
    const cpf = document.querySelector('[data-field="cpfCnpj"]').value.trim().replace(/\D/g, "");
    const telefone = document.querySelector('[data-field="telefone"]').value.trim().replace(/\D/g, "");
    const endereco = document.querySelector('[data-field="endereco"]').value.trim();
    const ativo = document.querySelector('[data-field="ativo"]').value === "1" ? 1 : 0;

    if (!nome || !cpf || !telefone || !endereco) {
        mostrarToast("Preencha todos os campos", "erro");
        return;
    }

    if (nome.length < 4 || nome.length > 45) {
        mostrarToast("Nome inválido", "erro");
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

    try {
        const response = await fetch(
            `/Sewfy/api/fornecedores/${window.fornecedorAtualId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome,
                    cpfCnpj: cpf,
                    telefone,
                    endereco,
                    ativo
                })
            }
        );

        const resultado = await response.json();

        if (!response.ok) {
            throw new Error(resultado.erro || "Erro ao atualizar fornecedor");
        }

        atualizarModalComDados({ nome, cpf, telefone, endereco, ativo });
        trocarBotaoParaEditar();
        window.atualizarListaFornecedores?.();

        mostrarToast(resultado.mensagem || "Fornecedor atualizado", "sucesso");

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
            span.textContent = mascaraCpfCnpj(dados.cpf);
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