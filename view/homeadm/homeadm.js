import { mascaraCpfCnpj, mascaraTelefone } from "../assets/mascaras.js";

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
        const response = await fetch("/Sewfy/api/adm/empresas", {
            method: "GET",
            credentials: "include"
        });

        if (response.status === 401) {
            window.location.href = "/adm/login.html";
            return;
        }

        if (!response.ok) throw new Error("Erro ao buscar empresas");

        todasEmpresas = await response.json();

        aplicarFiltros();

    } catch (error) {
        console.error("Erro ao carregar empresas:", error);
    }
}

function aplicarFiltros() {
    const busca = (
        document.getElementById("input-busca")?.value || ""
    ).toLowerCase();

    const statusFiltro =
        document.getElementById("select-status")?.value || "todas";

    const filtradas = todasEmpresas.filter(emp => {

        const nome = (emp.nome || "").toLowerCase();
        const razao = (emp.razao || "").toLowerCase();
        const cnpj = (emp.cnpj || "").toLowerCase();
        const ativo = Number(emp.ativo);

        const correspondeBusca =
            nome.includes(busca) ||
            razao.includes(busca) ||
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
    const container = document.getElementById("empresas-lista");
    const semResultados = document.getElementById("sem-resultados");

    container.innerHTML = "";

    if (!empresas || empresas.length === 0) {
        semResultados.style.display = "block";
        return;
    }

    semResultados.style.display = "none";

    empresas.forEach(empresa => {

        const ativo = Number(empresa.ativo);
        const ativa = ativo === 1;

        const statusClasse = ativa ? "ativa" : "inativa";
        const statusTexto = ativa ? "Ativa" : "Inativa";
        const statusIcone = ativa ? "check_circle" : "cancel";

        const modulos = Array.isArray(empresa.modulos)
            ? empresa.modulos
            : [];

        const modulosHTML = modulos.length > 0
            ? modulos.map(mod =>
                `<span class="modulo-tag">${mod}</span>`
              ).join("")
            : `<span class="modulo-tag">Sem módulos</span>`;

        const cnpjFormatado = mascaraCpfCnpj(empresa.cnpj || "");
        const telefoneFormatado = mascaraTelefone(empresa.numero || "");

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

            <p class="empresa-razao">${empresa.razao || ""}</p>

            <div class="empresa-info">
                <div class="info-grupo">
                    <span class="info-label">CNPJ</span>
                    <span class="info-valor">${cnpjFormatado}</span>
                </div>

                <div class="info-grupo">
                    <span class="info-label">Telefone</span>
                    <span class="info-valor">${telefoneFormatado}</span>
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

function acessarEmpresa(id) {
    console.log("Acessar empresa:", id);
}

function editarEmpresa(id) {
    sessionStorage.setItem("listaEmpresas_origem", window.location.href);
    window.location.href = `/Sewfy/view/editarempresa/editarempresa.html?id=${id}`;
}
window.editarEmpresa = editarEmpresa;