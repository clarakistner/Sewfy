import { getBaseUrl } from './API_JS/api.js';

const urlBase = getBaseUrl() || window.BASE_URL;

let modalModoCache = null;

async function carregarModalModoHTML() {
    if (modalModoCache) return modalModoCache;
    modalModoCache = await fetch(`${urlBase}/modal-modo-edicao`).then(res => res.text());
    return modalModoCache;
}

document.addEventListener("DOMContentLoaded", () => {
    carregarModalModoHTML();
});

document.addEventListener("click", (e) => {
    if (e.target.id === "btn-fechar-modo") {
        fecharModalModo();
    }
});

export function fecharModalModo() {
    const modal = document.getElementById("modal-modo-edicao");
    if (modal) {
        modal.style.display = "none";
        modal.remove();
        modalModoCache = null;
    }
}

/**
 * Exibe o mini modal de modo de edição.
 * @param {Function} onEsta    — callback para "Só esta parcela"
 * @param {Function} onFuturas — callback para "Esta e todas as futuras"
 */
export async function mostrarModalModo(onEsta, onFuturas) {
    fecharModalModo();

    const html = await carregarModalModoHTML();
    document.body.insertAdjacentHTML("beforeend", html);

    const modal = document.getElementById("modal-modo-edicao");
    modal.style.display = "flex";

    document.getElementById("btn-modo-esta").onclick = () => {
        fecharModalModo();
        onEsta();
    };

    document.getElementById("btn-modo-futuras").onclick = () => {
        fecharModalModo();
        onFuturas();
    };
}