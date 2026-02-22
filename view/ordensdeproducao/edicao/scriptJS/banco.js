import { setListaInsumos, setListaFornecedores } from './estado.js'
import { mostrarToast } from '../../../toast/toast.js'

// BUSCA DE DADOS DO BANCO

// Busca e armazena em memoria a lista de produtos do tipo Insumo e ativos
export async function resgataListaProdutos() {
  try {
    const listaBanco = await window.api.get("/produtos")
    console.log(`É um array? ${Array.isArray(listaBanco)}`)
    console.log(`Array[0] =>  ${JSON.stringify(listaBanco[0])}`)
    const lista = Array.from(listaBanco).filter(insumo => {
      return insumo.tipo === "Insumo" && insumo.ativo === "1"
    })
    setListaInsumos(lista)
  } catch (error) {
    console.log(`Erro ao tentar resgatar produtos: ${error}`)
    mostrarToast("Erro ao tentar resgatar produtos", 'erro')
    throw error
  }
}

// Busca e armazena em memoria a lista de fornecedores
export async function resgataListaFornecedores() {
  try {
    const listaBanco = await window.api.get("/fornecedores")
    setListaFornecedores(listaBanco)
  } catch (error) {
    console.log(`Erro ao tentar resgatar fornecedores: ${error}`)
    mostrarToast("Erro ao tentar resgatar fornecedores", 'erro')
    throw error
  }
}

// Busca o nome de um fornecedor pelo id; retorna null se id nao fornecido
export async function retornaNomeFornecedor(id) {
  try {
    if (id == null) {
      return null
    } else {
      console.log(`ID fornecedor: ${id}`)
      const fornecedor = await window.api.get(`/fornecedores/${parseInt(id)}`)
      return fornecedor.nome
    }
  } catch (error) {
    console.log(`Erro ao tentar pesquisar fornecedor: ${error}`)
    mostrarToast("Erro ao tentar pesquisar fornecedor", "erro")
    throw error
  }
}

// Busca o produto no banco pelo id; retorna null se o id for null
export async function resgataProdutoPeloID(id) {
  try {
    const produto = await window.api.get(`/produtos/${id}`)
    return produto
  } catch (error) {
    console.log(`Erro ao buscar produto: ${error}`)
    mostrarToast("Erro ao buscar produto", "erro")
    throw error
  }
}