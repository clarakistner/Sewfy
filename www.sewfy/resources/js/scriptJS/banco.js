import { setListaInsumos, setListaFornecedores } from './estado.js'
import { mostrarToast } from '../toast/toast.js'

const cacheFornecedores = new Map();
const cacheProdutos = new Map();
let cacheListaProdutos = null;
let cacheListaFornecedores = null;

export async function resgataListaProdutos() {
    if (cacheListaProdutos) {
        setListaInsumos(cacheListaProdutos);
        return;
    }
    try {
        const listaBanco = await window.api.get("/produtos")
        const lista = Array.from(listaBanco).filter(insumo => insumo.tipo === "insumo" && insumo.ativo === 1)
        cacheListaProdutos = lista;
        setListaInsumos(lista)
    } catch (error) {
        console.log(`Erro ao tentar resgatar produtos: ${error}`)
        mostrarToast("Erro ao tentar resgatar produtos", 'erro')
        throw error
    }
}

export async function resgataListaFornecedores() {
    if (cacheListaFornecedores) {
        setListaFornecedores(cacheListaFornecedores);
        return;
    }
    try {
        const listaBanco = await window.api.get("/clifor")
        cacheListaFornecedores = listaBanco;
        setListaFornecedores(listaBanco)
    } catch (error) {
        console.log(`Erro ao tentar resgatar fornecedores: ${error}`)
        mostrarToast("Erro ao tentar resgatar fornecedores", 'erro')
        throw error
    }
}

export async function retornaNomeFornecedor(id) {
    if (id == null) return null;
    if (cacheFornecedores.has(id)) return cacheFornecedores.get(id);
    try {
        const promise = window.api.get(`/clifor/${parseInt(id)}`).then(f => {
            cacheFornecedores.set(id, f.nome);
            return f.nome;
        });
        cacheFornecedores.set(id, promise);
        return promise;
    } catch (error) {
        console.log(`Erro ao tentar pesquisar fornecedor: ${error}`)
        mostrarToast("Erro ao tentar pesquisar fornecedor", "erro")
        throw error
    }
}

export async function resgataProdutoPeloID(id) {
    if (cacheProdutos.has(id)) return cacheProdutos.get(id);
    try {
        const promise = window.api.get(`/produtos/${id}`).then(p => {
            cacheProdutos.set(id, p);
            return p;
        });
        cacheProdutos.set(id, promise);
        return promise;
    } catch (error) {
        console.log(`Erro ao buscar produto: ${error}`)
        mostrarToast("Erro ao buscar produto", "erro")
        throw error
    }
}