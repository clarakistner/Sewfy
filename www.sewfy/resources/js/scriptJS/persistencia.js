import { setInsumosInseridos, getInsumosInseridos, setInsumosDeletados, getInsumosDeletados, getListaDOM, atualizaOP, atualizaOPINs, setListaDOM } from './estado.js'
import { getOrdemProducao, getInsumosBanco, setInsumosBanco } from '../modalOrdemDeProducao.js'
import { mostrarToast } from '../toast/toast.js'
import { fechaModal} from './modal.js'
import { verificaQuantidadesOPOPIN, verificaCampo, verificaPrecosOPOPIN } from './validacoes.js'
import { resgataProdutoPeloID } from './banco.js'
import { organizaDadosTela, limpaDivInsumos, limpaSelectInsumos } from './renderizacao.js'
import { organizaDivNovoInsumo } from './renderizacao.js'
import { converterMoedaParaNumero } from '../assets/mascaras.js'
import { initTelaCarregamento, removeTelaCarregamento } from '../telacarregamento.js'
import { listarOrdensProducao, invalidarCache } from "../gerenciarOrdensDeProducao.js";


export async function salvaAlteracoes() {
    try {
        const container = document.querySelector(".modal-container")
        if (!verificaQuantidadesOPOPIN()) {
            mostrarToast("Os campos de quantidade da Ordem e dos insumos\nnão podem ser vazios ou iguais a 0", "erro")
            return
        }
        if (!verificaPrecosOPOPIN()) {
            mostrarToast("Os campos de preço da Ordem e dos insumos\nnão podem ser vazios ou iguais a 0", "erro")
            return
        }

        initTelaCarregamento(container)

        await Promise.all([
            deletaInsumosBanco(),
            criaInsumosBanco(),
            editaInsumos(),
            atualizaOPBanco(),
        ]);

        await listarOrdensProducao(null, null);
        window.atualizarListaOrdens?.();
        removeTelaCarregamento()
        mostrarToast("Alterações salvas!")
        fechaModal()
    } catch (error) {
        console.log(`Erro ao tentar salvar alterações: ${error}`)
        mostrarToast("Erro ao tentar salvar alterações", "erro")
        throw error
    }
}

export function insereDadosOPAtualizados() {
    try {
        const qtdOP = document.querySelector("#qtdOP")
        if (!verificaCampo(qtdOP)) return
        const novaQtd = parseInt(qtdOP.value)
        if (isNaN(novaQtd)) {
            mostrarToast("Valor de quantidade inválido", "erro")
            return
        }
        atualizaOP.NovaQtdOP = novaQtd
    } catch (error) {
        console.log(`Erro ao coletar dados atualizados da OP: ${error}`)
        mostrarToast("Erro ao coletar dados da Ordem de Produção", "erro")
    }
}

async function atualizaOPBanco() {
    try {
        const op = getOrdemProducao()
        const dados = { NovaQtdOP: atualizaOP.NovaQtdOP, OP: op }
        await window.api.put("/ordemdeproducao/editar", dados)
    } catch (error) {
        console.log(`Erro ao tentar editar Ordem de Produção: ${error}`)
        mostrarToast("Erro ao tentar editar Ordem de Produção", "erro")
        throw error
    }
}

async function editaInsumos() {
    try {
        const listaInsumos = getInsumosBanco()
        const listaEdicao = listaInsumos.map(insumo => {
            const campos = document.querySelectorAll(`.opin${insumo.idOPIN}`)
            return retornaDadosCamposInsumo(insumo, campos)
        })
        await window.api.put("/insumos/editar", { insumos: listaEdicao })
    } catch (error) {
        console.log(`Erro ao tentar editar insumos: ${error}`)
        mostrarToast("Erro ao tentar editar insumos", "erro")
        throw error
    }
}

function retornaDadosCamposInsumo(insumo, campos) {
    try {
        const dados = {}
        let campoQtd, campoFor, campoPreco
        campos.forEach(campo => {
            if (campo.id == `qtd${insumo.idOPIN}`) campoQtd = campo
            else if (campo.dataset.field == "fornecedor" && campo.style.visibility !== 'hidden') campoFor = campo
            else if (campo.id == `preco${insumo.idOPIN}`) campoPreco = campo
        })
        if (!!campoQtd && !!campoPreco) {
            const qtdParsed = parseInt(campoQtd.value)
            const precoParsed = parseFloat(converterMoedaParaNumero(campoPreco.value))
            dados.qtdInsumo = isNaN(qtdParsed) ? 0 : qtdParsed
            dados.idFor = !campoFor ? null : parseInt(campoFor.value)
            dados.idOPIN = parseInt(insumo.idOPIN)
            dados.custouOPIN = isNaN(precoParsed) ? 0 : precoParsed
        }
        return dados
    } catch (error) {
        console.log(`Erro ao retornar dados dos campos do insumo: ${error}`)
        mostrarToast("Erro ao coletar dados dos insumos", "erro")
        return {}
    }
}

async function deletaInsumosBanco() {
    try {
        const listaDeletados = getInsumosDeletados()
        if (listaDeletados.length === 0 || !listaDeletados) return
        await window.api.deleteAll("/insumos/deletar", { insumosDeletados: listaDeletados })
    } catch (error) {
        console.log(`Erro ao tentar deletar insumos: ${error}`)
        throw error
    }
}

async function criaInsumosBanco() {
    try {
        const listaInseridos = getInsumosInseridos()
        if (listaInseridos.length === 0) return

        const listaDeletados = getInsumosDeletados()
        const listaDOM = getListaDOM()

        const listaBanco = listaInseridos
            .filter(adicionado => !listaDeletados.includes(String(adicionado.idOPIN)))
            .map(insumo => {
                const insumoDOM = listaDOM.find(d => String(d.idOPIN) === String(insumo.idOPIN))
                if (!insumoDOM) return insumo

                const campos = document.querySelectorAll(`.opin${insumo.idOPIN}`)
                const necessitaClifor = insumoDOM.forOPIN != null

                let campoQtd, campoFor, campoPreco
                campos.forEach(campo => {
                    if (campo.id === `qtd${insumo.idOPIN}`) campoQtd = campo
                    else if (necessitaClifor && campo.dataset.field === "fornecedor" && campo.closest('.boxFornecedor')?.style.display !== 'none') campoFor = campo
                    else if (campo.id === `preco${insumo.idOPIN}`) campoPreco = campo
                })

                return {
                    ...insumo,
                    qtdOPIN: campoQtd ? (parseInt(campoQtd.value) || insumo.qtdOPIN) : insumo.qtdOPIN,
                    custouOPIN: campoPreco ? (parseFloat(converterMoedaParaNumero(campoPreco.value)) || insumo.custouOPIN) : insumo.custouOPIN,
                    forOPIN: necessitaClifor && campoFor ? (parseInt(campoFor.value) || insumo.forOPIN) : insumo.forOPIN,
                }
            })

        await window.api.post("/insumos/criar", { insumosInseridos: listaBanco })
    } catch (error) {
        console.log(`Erro ao tentar criar insumos: ${error}`)
        throw error
    }
}