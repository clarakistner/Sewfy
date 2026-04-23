import { mascaraTelefone } from "../js/assets/mascaras.js";
import { mostrarToast } from "./toast/toast.js";
import { getBaseUrl } from "./API_JS/api.js";
import { carregaJsCssEditarFuncionario, preencherCamposBasicos, carregarDadosFuncionarioExterno } from "./editarfuncionarios.js";

let timeout;
document.addEventListener("input", handleInput);
document.addEventListener("change", handleChange);

function handleChange(e) {
    if (e.target.closest("#status-filtro")) {
        aplicarFiltros();
    }
}

function handleInput(e) {
    if (e.target.closest("#barrapesquisa")) {
        clearTimeout(timeout);
        timeout = setTimeout(() => aplicarFiltros(), 300);
    }
}

async function buscaTodosFuncionariosEmpresa() {
    try {
        const response = await window.api.get("/empresa-usuarios/funcionarios");
        return Array.from(response.funcionarios);
    } catch (error) {
        console.log("Erro ao buscar funcionários: " + error);
        throw error;
    }
}

async function carregarFuncionarios() {
    const tbody = document.getElementById("funcionarios-table");
    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="4" class="mensagem-vazia">Carregando...</td></tr>`;
    const listaFuncionarios = await buscaTodosFuncionariosEmpresa();
    renderizaFuncionarios(listaFuncionarios);
}

export function limparLista() {
    document.querySelector("#funcionarios-table").innerHTML = "";
}

function aplicaPesquisa(listaFun, valorPesquisa) {
    if (!valorPesquisa) return listaFun;
    return listaFun.filter(
        (fun) =>
            fun.USU_NOME.trim().toLowerCase().includes(valorPesquisa.trim().toLowerCase()) ||
            fun.USU_EMAIL.trim().toLowerCase().includes(valorPesquisa.trim().toLowerCase()),
    );
}

async function aplicarFiltros() {
    try {
        limparLista();
        const valorPesquisa = document.getElementById("barrapesquisa")?.value ?? "";
        const statusFiltro  = document.getElementById("status-filtro")?.value ?? "";

        let listaFuns = await buscaTodosFuncionariosEmpresa();

        if (valorPesquisa.trim()) {
            listaFuns = listaFuns.filter(fun =>
                fun.USU_NOME.trim().toLowerCase().includes(valorPesquisa.trim().toLowerCase()) ||
                fun.USU_EMAIL.trim().toLowerCase().includes(valorPesquisa.trim().toLowerCase())
            );
        }

        if (statusFiltro === "ativo") {
            listaFuns = listaFuns.filter(fun => fun.USU_ATIV === 1);
        } else if (statusFiltro === "inativo") {
            listaFuns = listaFuns.filter(fun => fun.USU_ATIV === 0);
        }

        renderizaFuncionarios(listaFuns);
    } catch (error) {
        console.log(`Erro ao filtrar funcionários: ${error}`);
    }
}

function renderizaFuncionarios(funcionarios) {
    const tbody = document.getElementById("funcionarios-table");
    tbody.innerHTML = "";

    if (!Array.isArray(funcionarios) || funcionarios.length === 0) {
        tbody.innerHTML = `
            <tr class="linha-vazia">
                <td colspan="4" class="mensagem-vazia">Nenhum funcionário encontrado</td>
            </tr>`;
        return;
    }

    funcionarios.forEach((funcionario) => {
        const tr = document.createElement("tr");
        tr.classList.add("table-row");
        if (funcionario.USU_ATIV === 0) tr.classList.add("funcionario-inativo");

        tr.innerHTML = `
            <td class="table-cell">${funcionario.USU_NOME}</td>
            <td class="table-cell">${funcionario.USU_EMAIL}</td>
            <td class="table-cell">${mascaraTelefone(funcionario.USU_NUM)}</td>
            <td class="table-cell">
                <button
                    type="button"
                    class="botao-visualizar-funcionario"
                    data-id="${funcionario.USU_ID}"
                    data-nome="${funcionario.USU_NOME}"
                    data-email="${funcionario.USU_EMAIL}"
                    data-telefone="${funcionario.USU_NUM}"
                    data-ativo="${funcionario.USU_ATIV}"
                >
                    <span class="material-symbols-outlined icone-visualizar-funcionario">visibility</span>
                </button>
            </td>`;

        tbody.appendChild(tr);
    });
}

document.addEventListener("click", async (e) => {
    const botao = e.target.closest(".botao-visualizar-funcionario");
    if (!botao) return;

    e.preventDefault();
    e.stopPropagation();

    const url = getBaseUrl();
    window.funcionarioAtualId = botao.dataset.id;

    try {
        await carregaJsCssEditarFuncionario();

        const htmlCompleto = await fetch(`${url}/editar-funcionario`).then((r) => r.text());
        const parser = new DOMParser();
        const doc    = parser.parseFromString(htmlCompleto, "text/html");
        const modal  = doc.querySelector("#modal-editar-funcionario");

        if (!modal) return;

        document.body.insertAdjacentHTML("beforeend", modal.outerHTML);

        preencherCamposBasicos(botao.dataset);

        await carregarDadosFuncionarioExterno();

    } catch (erro) {
        console.error(erro);
        mostrarToast("Erro ao abrir modal", "erro");
    }
});

export function initGerenciarFuncionarios() {
    carregarFuncionarios();
    window.atualizarListaFuncionarios = carregarFuncionarios;
}
