console.log("JS carregado");

const btnMaisFiltros = document.getElementById("btn-mais-filtros");
const dropdown = document.getElementById("dropdown-filtros");
const containerFiltros = document.getElementById("container-filtros");

console.log("Botão encontrado?", btnMaisFiltros);
console.log("Dropdown encontrado?", dropdown);
console.log("Container filtros?", containerFiltros);

// Abrir / fechar dropdown
// Estado inicial (garante que começa fechado)
dropdown.style.display = "none";

// Abrir / fechar
btnMaisFiltros.addEventListener("click", (e) => {
    e.stopPropagation(); // impede o document click de fechar imediatamente

    console.log("clicou no botão");

    dropdown.style.display =
        dropdown.style.display === "flex" ? "none" : "flex";
});

// Fechar clicando fora
document.addEventListener("click", (e) => {
    if (!e.target.closest(".mais-filtros")) {
        dropdown.style.display = "none";
    }
});

// Clique nas opções
dropdown.addEventListener("click", (e) => {
    const botao = e.target.closest("button");
    if (!botao) return;

    const tipoFiltro = botao.dataset.filtro;

    if (tipoFiltro === "tempo") inserirFiltroTempo();
    if (tipoFiltro === "valor") inserirFiltroValor();

    dropdown.style.display = "none";
});

function inserirFiltroTempo() {

    // Evita duplicar
    if (document.getElementById("filtro-tempo")) return;

    const filtro = document.createElement("div");
    filtro.classList.add("filtro-extra");
    filtro.id = "filtro-tempo";

    filtro.innerHTML = `
        <span class="material-symbols-outlined icone-novo-calendario">calendar_month</span>

        <input type="date" class="input-data-inicial">
        <span>até</span>
        <input type="date" class="input-data-final">

        <button class="material-symbols-outlined btn-remover-filtronovo">close</button>
    `;

    containerFiltros.appendChild(filtro);

    filtro.querySelector(".btn-remover-filtronovo").addEventListener("click", () => {
        filtro.remove();
    });
}

function inserirFiltroValor() {

    // Evita duplicar
    if (document.getElementById("filtro-valor")) return;

    const filtro = document.createElement("div");
    filtro.classList.add("filtro-extra");
    filtro.id = "filtro-valor";

    filtro.innerHTML = `
        <span class="material-symbols-outlined icone-novo-dinheiro">attach_money</span>

        <input type="text" placeholder="R$ 00.00" class="input-valor-min">
        <span>até</span>
        <input type="text" placeholder="R$ 00.00" class="input-valor-max">

        <button class="material-symbols-outlined btn-remover-filtronovo">close</button>
    `;

    containerFiltros.appendChild(filtro);

    filtro.querySelector(".btn-remover-filtronovo").addEventListener("click", () => {
        filtro.remove();
    });
}