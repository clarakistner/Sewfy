import { mostrarToast } from "./toast/toast.js";
import { formatarMoeda, converterMoedaParaNumero } from "./assets/mascaras.js";
import {
    atualizarBarraProgresso,
    inicializarIconesOriginais,
} from "./progressoEtapas.js";
import "../js/configmenu.js";
import "../js/menu.js";
import { getBaseUrl } from "../js/API_JS/api.js";

const url = getBaseUrl();
let listaProdutos = null;

const PROD_TIPO = {
    INSUMO: "insumo",
    FINAL: "produto acabado",
    CONJUNTO: "conjunto",
};

const op = {
    PROD_NOME: null,
    PROD_ID: null,
    OP_QTD: null,
    PROD_TIPO: null,
};

const OPINs = [];

const selectProduto = {
    triggerId: "triggerProduto",
    dropdownId: "dropdownProduto",
    listaId: "listaProduto",
    labelId: "labelProduto",
    hiddenId: "product",
    opcoes: [],
};

const selectInsumo = {
    triggerId: "triggerInsumo",
    dropdownId: "dropdownInsumo",
    listaId: "listaInsumo",
    labelId: "labelInsumo",
    hiddenClass: "campoInsumoValor",
    opcoes: [],
};

function renderOpcoes(config, filtro = "") {
    const lista = document.getElementById(config.listaId);
    if (!lista) return;
    lista.innerHTML = "";

    const filtradas = config.opcoes.filter((op) =>
        op.label.toLowerCase().includes(filtro.toLowerCase()),
    );

    if (filtradas.length === 0) {
        const li = document.createElement("li");
        li.className = "select-pesquisa-vazio";
        li.textContent = "Nenhum item encontrado.";
        lista.appendChild(li);
        return;
    }

    filtradas.forEach((opcao) => {
        const li = document.createElement("li");
        li.textContent = opcao.label;
        li.dataset.id = opcao.id;
        li.dataset.value = opcao.value;
        li.addEventListener("click", () => selecionarOpcao(config, opcao));
        lista.appendChild(li);
    });
}

function selecionarOpcao(config, opcao) {
    const label = document.getElementById(config.labelId);
    const dropdown = document.getElementById(config.dropdownId);

    if (label) label.textContent = opcao.label;
    if (dropdown) dropdown.classList.remove("aberto");

    if (config.hiddenId) {
        const hidden = document.getElementById(config.hiddenId);
        if (hidden) {
            hidden.value = opcao.value;
            hidden.id = config.hiddenId;
            hidden.dataset.id = opcao.id;
        }
    } else if (config.hiddenClass) {
        const hidden = document.querySelector(`.${config.hiddenClass}`);
        if (hidden) {
            hidden.value = opcao.value;
            hidden.dataset.id = opcao.id;
        }
    }

    if (config === selectInsumo) {
        mudaLabelQuantidadePreco(opcao.id);
        fornecedorAplicavel(opcao.id);
    }
}

function getSelectedInsumo() {
    const hidden = document.querySelector(`.${selectInsumo.hiddenClass}`);
    if (!hidden || !hidden.value) return null;
    return {
        id: hidden.dataset.id,
        value: hidden.value,
        textContent: document.getElementById(selectInsumo.labelId)?.textContent,
    };
}

function getSelectedProduto() {
    const hidden = document.getElementById(selectProduto.hiddenId);
    if (!hidden || !hidden.value) return null;
    return {
        id: hidden.dataset.id,
        value: hidden.value,
        textContent: document.getElementById(selectProduto.labelId)
            ?.textContent,
    };
}

function inicializarDropdown(config) {
    const trigger = document.getElementById(config.triggerId);
    const dropdown = document.getElementById(config.dropdownId);
    if (!trigger || !dropdown) return;

    const input = dropdown.querySelector(".select-pesquisa-input");

    trigger.addEventListener("click", () => {
        dropdown.classList.toggle("aberto");
        if (dropdown.classList.contains("aberto")) {
            input?.focus();
            renderOpcoes(config);
        }
    });

    input?.addEventListener("input", () => renderOpcoes(config, input.value));

    document.addEventListener("click", (e) => {
        if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove("aberto");
        }
    });
}

function limparDropdown(config, placeholder) {
    const label = document.getElementById(config.labelId);
    const dropdown = document.getElementById(config.dropdownId);
    const input = dropdown?.querySelector(".select-pesquisa-input");

    if (label) label.textContent = placeholder;
    if (input) input.value = "";

    if (config.hiddenId) {
        const hidden = document.getElementById(config.hiddenId);
        if (hidden) {
            hidden.value = "";
            hidden.dataset.id = "";
        }
    } else if (config.hiddenClass) {
        const hidden = document.querySelector(`.${config.hiddenClass}`);
        if (hidden) {
            hidden.value = "";
            hidden.dataset.id = "";
        }
    }

    renderOpcoes(config);
}

function carregarProdutosFinalNoDropdown(listaProd) {
    selectProduto.opcoes = listaProd
        .filter(
            (p) =>
                (p.tipo === PROD_TIPO.FINAL || p.tipo === PROD_TIPO.CONJUNTO) &&
                p.ativo === 1,
        )
        .map((p) => ({
            id: String(p.id),
            value: p.nome,
            label: p.nome,
            tipo: p.tipo,
        }));
}

function carregarProdutosInsumoNoDropdown(
    listaProd,
    tipoInsumo = PROD_TIPO.INSUMO,
) {
    selectInsumo.opcoes = listaProd
        .filter((p) => p.tipo === tipoInsumo && p.ativo === 1)
        .map((p) => ({ id: String(p.id), value: p.nome, label: p.nome }));
}

document.addEventListener("DOMContentLoaded", async () => {
    const { initTelaCarregamento, removeTelaCarregamento } =
        await import("../js/telacarregamento.js");

    initTelaCarregamento();

    inicializarDropdown(selectProduto);
    inicializarDropdown(selectInsumo);

    await iniciaRequisicao();

    removeTelaCarregamento();
});

document.addEventListener("click", handleGlobalClick);
document.addEventListener("input", handleInput);

document.querySelector("#quantity")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        navegarParaInsumos(e);
        const campoQuantOPIN = document.querySelector(".campoQuant");
        campoQuantOPIN.disabled = true;
        const campoFor = document.querySelector(".campoFornecedor");
        campoFor.disabled = true;
    }
});

async function iniciaRequisicao() {
    inicializarIconesOriginais();
    atualizarBarraProgresso(1);
    await carregarProdutosEmSelect("final");
    renderLista();
}

async function handleGlobalClick(e) {
    if (e.target.closest(".modal-close") || e.target.closest(".cancelar")) {
        await fecharModal();
    }

    if (e.target.closest(".proximo.dadosProduto")) {
        e.preventDefault();
        navegarParaInsumos(e);
        const campoQuantOPIN = document.querySelector(".campoQuant");
        campoQuantOPIN.disabled = true;
        const campoFor = document.querySelector(".campoFornecedor");
        campoFor.disabled = true;
    }

    if (e.target.closest(".finalizar")) {
        e.preventDefault();
        navegarParaMostrarOrdem(e);
    }

    if (e.target.closest(".voltar")) {
        e.preventDefault();
        const ordemVisivel = document.querySelector(".boxDadosOrdem");
        if (ordemVisivel && ordemVisivel.style.display === "block") {
            atualizarBarraProgresso(2);
            irOutraTela(".boxDadosOrdem", ".boxDadosInsumos");
            const campoQuantOPIN = document.querySelector(".campoQuant");
            campoQuantOPIN.disabled = true;
            const campoFor = document.querySelector(".campoFornecedor");
            campoFor.disabled = true;
        } else {
            atualizarBarraProgresso(1);
            irOutraTela(".boxDadosInsumos", ".boxDadosProduto");
        }
    }

    if (e.target.closest(".confirmar")) {
        e.preventDefault();
        await confirmarOrdem();
    }

    if (e.target.closest(".adicionar")) {
        e.preventDefault();
        await adicionarInsumo();
    }

    if (e.target.closest(".voltarProduto")) {
        e.preventDefault();
        atualizarBarraProgresso(1);
        irOutraTela(".boxDadosInsumos", ".boxDadosProduto");
    }
}

function handleInput(e) {
    if (e.target.closest("#barraPesquisa")) {
        const valor = e.target.closest("#barraPesquisa").value;
        renderLista(valor);
    }
    if (e.target.closest(".campoPreco")) {
        const campo = e.target.closest(".campoPreco");
        let valor = campo.value.replace(/\D/g, "");
        valor = (Number(valor) / 100).toFixed(2);
        campo.value = formatarMoeda(valor);
    }
}

async function fecharModal() {
    OPINs.length = 0;
    window.location.href = `${url}/ordensdeproducao`;
}

function navegarParaInsumos(e) {
    e.preventDefault();

    const produtoSelecionado = getSelectedProduto();
    const campoQuant = document.querySelector("input.input-produto");
    const quantidade = parseInt(campoQuant.value);
    const campoFor = document.querySelector(".campoFornecedor");

    if (!produtoSelecionado || !quantidade) {
        mostrarToast(
            "Todos os campos devem ser preenchidos corretamente!",
            "erro",
        );
        return;
    }

    if (quantidade <= 0) {
        mostrarToast("A quantidade deve ser maior que 0!", "erro");
        return;
    }

    const produtoNaLista = listaProdutos.find(
        (p) => String(p.id) === produtoSelecionado.id,
    );

    op.PROD_NOME = produtoSelecionado.textContent;
    op.PROD_ID = parseInt(produtoSelecionado.id);
    op.OP_QTD = quantidade;
    op.PROD_TIPO = produtoNaLista?.tipo ?? null;

    listaProdutos = listaProdutos.filter((p) => p.id !== op.PROD_ID);

    atualizarBarraProgresso(2);
    irOutraTela(".boxDadosProduto", ".boxDadosInsumos");

    const tipoInsumo =
        op.PROD_TIPO === PROD_TIPO.CONJUNTO
            ? PROD_TIPO.FINAL
            : PROD_TIPO.INSUMO;
    carregarProdutosEmSelect("insumos", tipoInsumo);
    carregaFornecedores(campoFor);
    campoFor.disabled = true;
}

function navegarParaMostrarOrdem(e) {
    e.preventDefault();

    if (OPINs.length <= 0) {
        mostrarToast("Insira ao menos um insumo na ordem de produção!", "erro");
        return;
    }

    atualizarBarraProgresso(3);
    irOutraTela(".boxDadosInsumos", ".boxDadosOrdem");
    organizaDados();
}

function irOutraTela(atual, proxima) {
    document.querySelector(atual).style.display = "none";
    document.querySelector(proxima).style.display = "block";
}

async function adicionarInsumo() {
    try {
        const insumoSelecionado = getSelectedInsumo();
        const campoQuant = document.querySelector(".campoQuant");
        const campoFor = document.querySelector(".campoFornecedor");
        const campoPreco = document.querySelector(".campoPreco");
        const labelQuantidade = document.querySelector("#label-quantidade");
        const labelPreco = document.querySelector("#label-preco");

        const quant =
            parseInt(campoQuant.value) <= 0 || isNaN(campoQuant.value)
                ? 0
                : parseInt(campoQuant.value);

        const fornecedor = obterValorSelect(campoFor);

        const preco =
            parseFloat(converterMoedaParaNumero(campoPreco.value)) <= 0 ||
            isNaN(converterMoedaParaNumero(campoPreco.value))
                ? 0
                : parseFloat(converterMoedaParaNumero(campoPreco.value));

        if (!validarCamposInsumo(insumoSelecionado, quant, preco)) return;

        const lista = await getListaProdutosBanco();
        const produto = lista.find(
            (p) => p.id === parseInt(insumoSelecionado.id),
        );

        if (
            produto?.necessita_clifor &&
            (!fornecedor || String(fornecedor).trim() === "")
        ) {
            mostrarToast("Selecione um fornecedor!", "erro");
            return;
        }

        const custot = preco * quant;

        const insumo = {
            IDFORNECEDOR: valorIdFornecedor("id", fornecedor),
            QTDIN: quant,
            CUSTOT: custot,
            CUSTOU: preco,
            UM: produto.um,
            INSUNOME: insumoSelecionado.textContent,
            INSUID: parseInt(insumoSelecionado.id),
        };

        OPINs.push(insumo);

        listaProdutos = listaProdutos.filter(
            (p) => parseInt(p.id) !== parseInt(insumoSelecionado.id),
        );

        const tipoInsumo =
            op.PROD_TIPO === PROD_TIPO.CONJUNTO
                ? PROD_TIPO.FINAL
                : PROD_TIPO.INSUMO;
        carregarProdutosInsumoNoDropdown(listaProdutos, tipoInsumo);

        renderLista();
        limparCamposInsumo(campoQuant, campoFor, campoPreco);
        labelQuantidade.textContent = "Quantidade*";
        labelPreco.textContent = "Preço (R$)*";
    } catch (error) {
        console.error(`Erro ao adicionar insumo: ${error}`);
    }
}

function renderLista(pesquisa = null) {
    const listaCards = document.getElementById("tabelaInsumos");
    if (!listaCards) return;

    listaCards.innerHTML = "";

    if (OPINs.length === 0) {
        const p = document.createElement("p");
        p.className = "lista-vazia";
        p.textContent = "Nenhum insumo adicionado ainda.";
        listaCards.appendChild(p);
        return;
    }

    const termo = pesquisa ? pesquisa.trim().toLowerCase() : null;
    const listaFiltrada = termo
        ? OPINs.filter((insumo) =>
              insumo.INSUNOME.toLowerCase().includes(termo),
          )
        : OPINs;

    if (listaFiltrada.length === 0) {
        const p = document.createElement("p");
        p.className = "lista-vazia";
        p.textContent = "Insumo não encontrado na lista.";
        listaCards.appendChild(p);
        return;
    }

    listaFiltrada.forEach(function (insumo) {
        const index = OPINs.indexOf(insumo);
        const card = document.createElement("div");
        card.className = "insumo-card";
        card.innerHTML =
            '<div class="insumo-card-field">' +
            '<span class="insumo-card-label">' +
            svgScissors("#9b59b6") +
            " INSUMO/SERVIÇO</span>" +
            '<span class="insumo-card-value">' +
            esc(insumo.INSUNOME) +
            "</span>" +
            "</div>" +
            '<div class="insumo-card-field">' +
            '<span class="insumo-card-label">' +
            svgHash("#6b7280") +
            " QUANTIDADE</span>" +
            '<span class="insumo-card-value">' +
            parseInt(insumo.QTDIN).toLocaleString("pt-BR") +
            " " +
            esc(insumo.UM) +
            "</span>" +
            "</div>" +
            '<div class="insumo-card-field">' +
            '<span class="insumo-card-label">' +
            svgDollar("#27ae60") +
            " PREÇO</span>" +
            '<span class="insumo-card-value">R$ ' +
            parseFloat(insumo.CUSTOU || 0).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }) +
            "</span>" +
            "</div>" +
            '<div class="insumo-card-field">' +
            '<span class="insumo-card-label">' +
            svgUser(insumo.IDFORNECEDOR ? "#e74c3c" : "#9ca3af") +
            " FORNECEDOR</span>" +
            '<span class="insumo-card-value">' +
            esc(valorNomeFornecedor(insumo.IDFORNECEDOR)) +
            "</span>" +
            "</div>" +
            '<div class="insumo-card-actions">' +
            '<span class="insumo-card-actions-label">' +
            svgCircle("#9ca3af") +
            " AÇÕES</span>" +
            "</div>" +
            '<button type="button" class="btn-remover" data-index="' +
            index +
            '">Remover</button>';

        listaCards.appendChild(card);
    });

    listaCards.querySelectorAll(".btn-remover").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            const idx = Number(this.dataset.index);
            const tipoInsumo =
                op.PROD_TIPO === PROD_TIPO.CONJUNTO
                    ? PROD_TIPO.FINAL
                    : PROD_TIPO.INSUMO;
            listaProdutos.push({
                nome: OPINs[idx].INSUNOME,
                id: OPINs[idx].INSUID,
                um: OPINs[idx].UM,
                ativo: 1,
                necessita_clifor: !OPINs[idx].IDFORNECEDOR ? 0 : 1,
                tipo: tipoInsumo,
            });
            OPINs.splice(idx, 1);
            carregarProdutosInsumoNoDropdown(listaProdutos, tipoInsumo);
            renderLista();
        });
    });
}

async function confirmarOrdem() {
    try {
        const dados = {
            OP_QTD: op.OP_QTD,
            OP_DATAA: dataFormatada(),
            OP_CUSTOU: calculaCustoU(),
            OP_CUSTOT: calculaCustoT(),
            PROD_ID: op.PROD_ID,
            INSUMOS: [...OPINs],
        };

        OPINs.length = 0;
        const { initTelaCarregamento, removeTelaCarregamento } =
            await import("../js/telacarregamento.js");
        initTelaCarregamento();
        await window.api.post("/ordemdeproducao/criar", dados);
        removeTelaCarregamento();

        sessionStorage.setItem("toast", "Ordem de Produção criada!");
        window.location.href = `${url}/ordensdeproducao`;
    } catch (error) {
        console.error(`Erro ao confirmar ordem: ${error}`);
    }
}

function organizaDados() {
    document.querySelector("#nomeProduto").innerHTML = op.PROD_NOME;
    document.querySelector("#quantidadeProduto").innerHTML = parseInt(
        op.OP_QTD,
    ).toLocaleString("pt-BR");
    document.querySelector("#custot").innerHTML =
        calculaCustoT().toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    document.querySelector("#custou").innerHTML =
        calculaCustoU().toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    carregaDadosInsumos();
}

function carregaDadosInsumos() {
    const tabela = document.querySelector("#tabelaIN");
    tabela.innerHTML = "";

    OPINs.forEach((insumo) => {
        const div = document.createElement("div");
        div.className = "insumo-revisao-item";
        div.innerHTML = `
            <p class="insumo-revisao-nome">
                ${parseInt(insumo.QTDIN).toLocaleString("pt-BR")} ${insumo.UM} de ${esc(insumo.INSUNOME)}
            </p>
            <p class="insumo-revisao-fornecedor">
                Fornecedor: <span>${esc(valorNomeFornecedor(insumo.IDFORNECEDOR))}</span>
            </p>
        `;
        tabela.appendChild(div);
    });

    const placeholder = document.getElementById("insumosVazio");
    if (placeholder) {
        placeholder.classList.toggle("hidden", OPINs.length > 0);
    }
}

const getListaProdutosBanco = async () => {
    if (!listaProdutos) {
        listaProdutos = await window.api.get("/produtos");
    }
    return listaProdutos;
};

async function carregarProdutosEmSelect(tipo, tipoInsumo = PROD_TIPO.INSUMO) {
    try {
        const lista = await getListaProdutosBanco();

        if (tipo === "final") {
            carregarProdutosFinalNoDropdown(lista);
        } else {
            carregarProdutosInsumoNoDropdown(lista, tipoInsumo);
        }
    } catch (error) {
        console.error(`Erro ao buscar produtos: ${error}`);
    }
}

async function carregaFornecedores(campo) {
    try {
        const fornecedores = await window.api.get("/clifor");
        fornecedores.forEach((fornecedor) => {
            const option = document.createElement("option");
            option.id = `${fornecedor.id}`;
            option.innerHTML = `${fornecedor.nome}`;
            campo.appendChild(option);
        });
    } catch (error) {
        console.error(`Erro ao carregar fornecedores: ${error}`);
    }
}

function obterValorSelect(selectElement) {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    return selectedOption.value === "" ? null : selectedOption;
}

function validarCamposInsumo(opInsumo, quant, preco) {
    if (!opInsumo || !quant || !preco) {
        mostrarToast("Preencha todos os campos!", "erro");
        return false;
    }
    if (quant === 0) {
        mostrarToast("A quantidade deve ser maior que 0!", "erro");
        return false;
    }
    if (preco <= 0) {
        mostrarToast("O preço deve ser maior que 0!", "erro");
        return false;
    }
    return true;
}

function limparCamposInsumo(campoQuant, campoFor, campoPreco) {
    limparDropdown(selectInsumo, "Selecione um insumo ou serviço");
    campoQuant.value = "";
    campoFor.value = "";
    campoPreco.value = "";
}

function valorIdFornecedor(atributo, fornecedor) {
    if (atributo === "valor") {
        return !fornecedor ? "Sem fornecedor" : fornecedor.value;
    }
    return !fornecedor ? null : parseInt(fornecedor.id);
}

function valorNomeFornecedor(idFornecedor) {
    if (!idFornecedor) return "Sem fornecedor";
    const option = document.querySelector(
        `.campoFornecedor option[id="${idFornecedor}"]`,
    );
    return option ? option.textContent : "Sem fornecedor";
}

function dataFormatada() {
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    const h = String(data.getHours()).padStart(2, "0");
    const min = String(data.getMinutes()).padStart(2, "0");
    const seg = String(data.getSeconds()).padStart(2, "0");
    return `${ano}-${mes}-${dia} ${h}:${min}:${seg}`;
}

function calculaCustoT() {
    return OPINs.reduce(
        (total, insumo) => total + parseFloat(insumo.CUSTOT),
        0,
    );
}

function calculaCustoU() {
    return parseFloat((calculaCustoT() / parseFloat(op.OP_QTD)).toFixed(2));
}

async function fornecedorAplicavel(idProd) {
    const campoFor = document.querySelector(".campoFornecedor");
    const span = document.querySelector(".select-icon-left");
    const lista = await getListaProdutosBanco();
    const produto = lista.find((insumo) => insumo.id === parseInt(idProd));

    if (produto && !produto.necessita_clifor) {
        campoFor.value = "";
        campoFor.disabled = true;
        span.classList.remove("noCliFor");
    } else {
        campoFor.disabled = false;
        span.classList.add("noCliFor");
    }
}

async function mudaLabelQuantidadePreco(idProd) {
    const labelQtd = document.querySelector("#label-quantidade");
    const labelPreco = document.querySelector("#label-preco");
    const campo = document.querySelector(".campoQuant");
    const lista = await getListaProdutosBanco();
    const produto = lista.find((insumo) => insumo.id === parseInt(idProd));

    if (produto) {
        labelQtd.textContent = `Quantidade em ${produto.um}*`;
        labelPreco.textContent = `Preço por ${produto.um} (R$)*`;
        campo.disabled = false;
    } else {
        labelQtd.textContent = "Quantidade*";
        labelPreco.textContent = "Preço (R$)*";
        campo.disabled = true;
    }
}

function svgScissors(color) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`;
}

function svgUser(color) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
}

function svgHash(color) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>`;
}

function svgCircle(color) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`;
}

function svgDollar(color = "#000") {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14.5a3.5 3.5 0 0 1 0 7H6"></path></svg>`;
}

function esc(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
