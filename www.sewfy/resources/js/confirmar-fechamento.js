import "../css/confirmar-fechamento.css";
import { mostrarToast } from "./toast/toast.js";
import { getOrdemProducao } from "./modalOrdemDeProducao.js";
import { getBaseUrl } from "./API_JS/api.js";
import { listarOrdensProducao, invalidarCache } from "./gerenciarOrdensDeProducao.js";

const url = getBaseUrl();

document.addEventListener("click", async (e) => {
    if (e.target.id === "cancelClose" || e.target.closest("#btnFecharCF")) {
        fecharConfirmarFechamento();
    }
    if (e.target.id === "confirmClose") {
        await enviarFechamento();
    }
});

document.addEventListener("input", (e) => {
    if (e.target.id === "quantidadeQuebra") {
        const qtdeQuebra = e.target;
        let valor = qtdeQuebra.value;
        valor = valor.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        qtdeQuebra.value = valor;
    }
});

async function enviarFechamento() {
    try {
        const qtdeQuebra = parseInt(document.getElementById("quantidadeQuebra").value);
        const op = getOrdemProducao();

        if (qtdeQuebra > parseInt(op.qtdOP)) {
            mostrarToast("Quantidade de quebra não pode ser maior que a quantidade da OP", "erro");
            return;
        }
        if (qtdeQuebra === "" || isNaN(qtdeQuebra) || qtdeQuebra < 0) {
            mostrarToast("Quantidade de quebra inválida", "erro");
            return;
        }

        await window.api.put("/ordemdeproducao/fechar", {
            opID: op.idOP,
            quebra: qtdeQuebra,
        });

        fecharConfirmarFechamento();
        document.querySelector("#detailsModal")?.remove();
        mostrarToast("Ordem de Produção Fechada!");
        invalidarCache();
        await listarOrdensProducao(null, null);
        window.atualizarListaOrdens?.();
    } catch (error) {
        console.error("Erro ao enviar fechamento:", error);
        mostrarToast("Erro ao enviar fechamento", "erro");
    }
}

export async function initConfirmarFechamento() {
    try {
        const [dataResponse, cssResponse] = await Promise.all([
            fetch(`${url}/confirmar-fechamento`),
            fetch(`${url}/confirmar-fechamento.css`),
        ]);
        const html = await dataResponse.text();
        const css  = await cssResponse.text();

        if (!document.getElementById("confirmar-fechamento-style")) {
            const style     = document.createElement("style");
            style.id        = "confirmar-fechamento-style";
            style.textContent = css;
            document.head.appendChild(style);
        }

        document.body.insertAdjacentHTML("afterbegin", html);

        const modal = document.querySelector("#modal-confirmar-fechamento");
        setTimeout(() => modal.classList.add("load"), 10);
    } catch (error) {
        console.error("Erro ao inicializar confirmação de fechamento:", error);
        mostrarToast("Erro ao abrir confirmação de fechamento", "erro");
    }
}

function fecharConfirmarFechamento() {
    document.querySelector("#modal-confirmar-fechamento")?.classList.remove("load");
    document.querySelector("#fundo-confirmar-fechamento")?.remove();
    document.getElementById("confirmar-fechamento-style")?.remove();
}