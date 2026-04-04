import { mostrarToast } from "./toast/toast.js";
let ordemProducao = null;
let insumosBanco = [];

const setOrdemProducao = (op) => {
    ordemProducao = op;
};
export const getOrdemProducao = () => ordemProducao;

export const setInsumosBanco = (insumos) => {
    insumosBanco = insumos;
};
export const getInsumosBanco = () => insumosBanco;

document.addEventListener("click", handleClick);

async function handleClick(e) {
    const botao = e.target.closest(".btn-verop, .verop");
    if (botao) {
        abrirModal(botao.id);
    }
    if (e.target.closest(".ver-modal-close")) {
        fecharModal();
    }
    if (e.target.closest(".fecharOP")) {
        fecharOrdemProd();
    }
}

async function fecharOrdemProd() {
    try {
        const op = getOrdemProducao();
        window.api.put("/ordemdeproducao/fechar", { opID: op.idOP });
        const { listarOrdensProducao, invalidarCache } =
            await import("../js/gerenciarOrdensDeProducao.js");
        fecharModal();
        invalidarCache();
        listarOrdensProducao(null, null);
    } catch (error) {
        console.log("Erro ao tentar fechar ordem de produção: " + error);
        throw error;
    }
}
export async function abrirModal(id) {
    try {
        const response = await fetch(`${window.BASE_URL}/modal-ordem`);

        await resgataOPCompletaBanco(id);
        const data = await response.text();
        document.body.insertAdjacentHTML("afterbegin", data);
        await insereDetalhesNaTela();

        const modal = document.querySelector("#detailsModal");
        modal.classList.add("load");

        ordemAbertah();
    } catch (error) {
        console.error("Erro ao abrir modal:", error);
        mostrarToast("Erro ao abrir modal", "erro");
        throw error;
    }
}
function ordemAbertah() {
    const btnEditar = document.querySelector(".editar");
    const btnFecharOP = document.querySelector(".fecharOP");
    const op = getOrdemProducao();

    if (!btnEditar || !btnFecharOP) {
        console.log("Botões não encontrados");
        return;
    }
    if (!!op.datae) {
        btnEditar.remove();
        btnFecharOP.remove();
    }
}
export function fecharModal() {
    document.querySelector("#detailsModal")?.classList.remove("load");
    document.querySelector("#detailsModal")?.remove();
}

async function resgataOPCompletaBanco(id) {
    try {
        const busca = await window.api.get(`/ordemdeproducao/detalhes/${id}`);
        setInsumosBanco(busca.opinS);
        setOrdemProducao(busca.op);
    } catch (error) {
        console.log(`Erro ao buscar OP: ${error}`);
        mostrarToast("Erro ao buscar OP", "erro");
        throw error;
    }
}

export async function retornaNomeProduto(id) {
    try {
        const produto = await window.api.get(`/produtos/${id}`);
        return produto.nome;
    } catch (error) {
        console.log(`Erro ao buscar produto: ${error}`);
        mostrarToast("Erro ao buscar produto", "erro");
        throw error;
    }
}

async function insereInsumosTabela() {
    try {
        const tabelaDOM = document.querySelector(".tabelaInsumos");

        const promessas = getInsumosBanco().map((insumo) =>
            retornaNomeProduto(insumo.prodIdOPIN),
        );
        const nomes = await Promise.all(promessas);

        getInsumosBanco().forEach((insumo, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>
          <div class="detalhes-insumo-card">
            <div>
              <p class="detalhes-insumo-nome">${nomes[index]}</p>
              <p class="detalhes-insumo-qtd">${insumo.qtdOPIN} ${insumo.umOPIN}</p>
            </div>
            <p class="detalhes-insumo-valor">
              ${parseFloat(insumo.custotOPIN).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
          </div>
        </td>
      `;
            tabelaDOM.appendChild(tr);
        });
    } catch (error) {
        console.log(`Erro ao inserir insumos na tabela: ${error}`);
        mostrarToast("Erro ao inserir insumos na tabela", "erro");
        throw error;
    }
}

async function insereDetalhesNaTela() {
    const campoNome = document.querySelector("#nomeProd");
    const campoQuant = document.querySelector("#quantProd");
    const campoCustou = document.querySelector("#custou");
    const campoCustot = document.querySelector("#custot");

    if (!getOrdemProducao() || !campoNome || !campoQuant) return;

    const [nomeProd] = await Promise.all([
        retornaNomeProduto(parseInt(getOrdemProducao().prodIDOP)),
        insereInsumosTabela(),
    ]);

    campoNome.textContent = nomeProd;
    campoQuant.textContent = parseInt(getOrdemProducao().qtdOP).toLocaleString(
        "pt-BR",
    );
    campoCustou.textContent = parseFloat(
        getOrdemProducao().custou,
    ).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
    campoCustot.textContent = parseFloat(
        getOrdemProducao().custot,
    ).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}
