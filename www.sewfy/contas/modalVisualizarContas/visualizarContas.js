import { mostrarToast } from '../../toast/toast.js'

console.log("[DEBUG] Script visualizarContas.js carregado!");

// ABRIR MODAL
document.addEventListener("click", (e) => {
    if (e.target.closest(".icone-visualizar-conta")) {
        fetch('/Sewfy/www.sewfy/contas/modalVisualizarContas/visualizarContas.html')
            .then(response => response.text())
            .then(data => {
                document.body.insertAdjacentHTML("afterbegin", data);
            });
    }
});

// FECHAR MODAL
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-fecha")) {
        document.querySelector("#conta-modal")?.remove();
    }
});

// BOTÃO PRINCIPAL — escuta delegada no documento
document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-submit");
    if (!btn) return;

    if (btn.dataset.modo === "salvar") {
        salvarConta();
    } else {
        ativarModoEdicao();
    }
});

function ativarModoEdicao() {
    const camposEditaveis = ["dataVencimento", "dataPagamento"];

    document.querySelectorAll(".value").forEach(span => {
        const field = span.dataset.field;
        if (!camposEditaveis.includes(field)) return;

        const el = document.createElement("input");
        el.type = "date";
        el.classList.add("input-edicao");
        el.dataset.field = field;
        el.id = span.id;

        // guarda o valor original como fallback
        el.dataset.valorOriginal = span.textContent.trim();

        // converte DD/MM/AAAA para AAAA-MM-DD pro input date
        const partes = span.textContent.trim().split("/");
        if (partes.length === 3) {
            el.value = `${partes[2]}-${partes[1]}-${partes[0]}`;
        }

        span.replaceWith(el);
    });

    const btn = document.querySelector(".btn-submit");
    btn.textContent = "Salvar alterações";
    btn.dataset.modo = "salvar";
}

function salvarConta() {
    const inputs = document.querySelectorAll(".input-edicao");

    // valida se alguma data ficou vazia
    for (const input of inputs) {
        if (!input.value) {
            mostrarToast("Preencha todas as datas antes de salvar", "erro");
            return;
        }
    }

    inputs.forEach(input => {
        const span = document.createElement("span");
        span.classList.add("value");
        span.dataset.field = input.dataset.field;
        span.id = input.id;

        // converte AAAA-MM-DD de volta pra DD/MM/AAAA
        const partes = input.value.split("-");
        if (partes.length === 3 && input.value) {
            span.textContent = `${partes[2]}/${partes[1]}/${partes[0]}`;
        } else {
            // fallback pro valor original caso algo dê errado
            span.textContent = input.dataset.valorOriginal;
        }

        input.replaceWith(span);
    });

    const btn = document.querySelector(".btn-submit");
    btn.textContent = "Editar Conta";
    btn.dataset.modo = "editar";

    mostrarToast("Alterações na conta salvas!");
}