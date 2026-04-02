import { mascaraCpfCnpj, mascaraTelefone } from "../js/assets/mascaras.js";
import { verificarAuth, apiFetch } from "../js/assets/auth.js";

import "../js/menuadm.js";

verificarAuth();

document.addEventListener("DOMContentLoaded", () => {
    carregarEmpresas();

    document
        .getElementById("input-busca")
        ?.addEventListener("input", aplicarFiltros);

    document
        .getElementById("select-status")
        ?.addEventListener("change", aplicarFiltros);
});

let todasEmpresas = [];

async function carregarEmpresas() {
    try {
        const response = await apiFetch('/api/adm/empresas', {
            method: 'GET'
        });

        if (!response || !response.ok) throw new Error('Erro ao buscar empresas');

        todasEmpresas = await response.json();
        aplicarFiltros();

    } catch (error) {
        console.error('Erro ao carregar empresas:', error);
    }
}

function aplicarFiltros() {
    const busca = (
        document.getElementById("input-busca")?.value || ""
    ).toLowerCase();

    const statusFiltro =
        document.getElementById("select-status")?.value || "todas";

    const filtradas = todasEmpresas.filter(emp => {

        const nome  = (emp.nome || "").toLowerCase();
        const raz   = (emp.raz  || "").toLowerCase();
        const cnpj  = (emp.cnpj || "").toLowerCase();
        const ativo = Number(emp.ativo);

        const correspondeBusca =
            nome.includes(busca) ||
            raz.includes(busca)  ||
            cnpj.includes(busca);

        let correspondeStatus = true;

        if (statusFiltro === "ativa") {
            correspondeStatus = ativo === 1;
        } else if (statusFiltro === "inativa") {
            correspondeStatus = ativo === 0;
        }

        return correspondeBusca && correspondeStatus;
    });

    renderizarEmpresas(filtradas);
}

function renderizarEmpresas(empresas) {
    const container      = document.getElementById("empresas-lista");
    const semResultados  = document.getElementById("sem-resultados");

    container.innerHTML = "";

    if (!empresas || empresas.length === 0) {
        semResultados.style.display = "block";
        return;
    }

    semResultados.style.display = "none";

    empresas.forEach(empresa => {

        const ativo = Number(empresa.ativo);
        const ativa = ativo === 1;

        const statusClasse = ativa ? "ativa"         : "inativa";
        const statusTexto  = ativa ? "Ativa"          : "Inativa";
        const statusIcone  = ativa ? "check_circle"   : "cancel";

        const modulos = Array.isArray(empresa.modulos) ? empresa.modulos : [];

        const modulosHTML = modulos.length > 0
            ? modulos.map(mod => `<span class="modulo-tag">${mod}</span>`).join("")
            : `<span class="modulo-tag">Sem módulos</span>`;

        const cnpjFormatado     = mascaraCpfCnpj(empresa.cnpj || "");
        const telefoneFormatado = mascaraTelefone(empresa.num  || "");

        const card = document.createElement("div");
        card.classList.add("empresa-card");

        card.innerHTML = `
            <button class="btn-acessar" onclick="acessarEmpresa(${empresa.id})">
                <span class="material-symbols-outlined">login</span>
            </button>

            <div class="empresa-header">
                <h2 class="empresa-nome">${empresa.nome || ""}</h2>
                <div class="empresa-status ${statusClasse}">
                    <span class="material-symbols-outlined">${statusIcone}</span>
                    ${statusTexto}
                </div>
            </div>

            <p class="empresa-razao">${empresa.raz || ""}</p>

            <div class="empresa-info">
                <div class="info-grupo">
                    <span class="info-label">CNPJ</span>
                    <span class="info-valor">${cnpjFormatado}</span>
                </div>

                <div class="info-grupo">
                    <span class="info-label">Telefone</span>
                    <span class="info-valor">${telefoneFormatado || "—"}</span>
                </div>

                <div class="info-grupo">
                    <span class="info-label">Email</span>
                    <span class="info-valor">${empresa.email || ""}</span>
                </div>
            </div>

            <div class="empresa-modulos">
                <span class="info-label">Módulos Ativos</span>
                <div class="modulos-lista">
                    ${modulosHTML}
                </div>
            </div>

            <button class="btn-editar" onclick="editarEmpresa(${empresa.id})">
                <span class="material-symbols-outlined">edit</span>
            </button>
        `;

        container.appendChild(card);
    });
}

async function acessarEmpresa(id) {
    try {
        const response = await apiFetch(`/api/adm/empresas/${id}/acessar`, {
            method: 'POST'
        });

        if (!response || !response.ok) {
            mostrarToast('Erro ao acessar empresa', 'erro');
            return;
        }

        const data = await response.json();

        // Salva o empresa_id no sessionStorage para o header X-Empresa-Id
        sessionStorage.setItem('empresa_id', data.empresa_id);
        sessionStorage.setItem('empresa_nome', data.empresa_nome);

        // Redireciona para o painel da empresa
        window.location.href = '/home';

    } catch (erro) {
        console.error('[ERRO]', erro);
        mostrarToast('Erro ao conectar com o servidor', 'erro');
    }
}
window.acessarEmpresa = acessarEmpresa;

function editarEmpresa(id) {
    sessionStorage.setItem("listaEmpresas_origem", window.location.href);
    window.location.href = `/www.sewfy/editarempresa/index.html?id=${id}`;
}
window.editarEmpresa = editarEmpresa;