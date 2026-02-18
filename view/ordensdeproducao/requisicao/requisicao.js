// Importa funções auxiliares
import { mostrarToast } from '../../toast/toast.js'
import { listarOrdensProducao, limparLista } from '../gerenciar/gerenciarOrdensDeProducao.js'

// Busca lista inicial de produtos

let listaProdutos = await window.api.get("/produtos")

// Constantes para tipos de produtos
const PROD_TIPO = {
  INSUMO: "Insumo",
  FINAL: "Produto Acabado",
  CONJUNTO: "Desconhecido"
}

// Objeto para armazenar dados da ordem de produção
const op = {
  PROD_NOME: null,
  PROD_ID: null,
  OP_QTD: null,
}

// Array para armazenar insumos da ordem
const OPINs = []

// Registra event listeners globais
document.addEventListener("click", handleGlobalClick)
document.addEventListener("change", defineUM)

// Handler central para todos os cliques da página
async function handleGlobalClick(e) {
  // Abre modal de criação de ordem
  if (e.target.closest(".icone-adicionar-ordem") || e.target.closest(".botao-criar-ordem")) {
    abrirModal()
  }

  // Fecha modal
  if (e.target.closest(".modal-close") || e.target.closest(".cancelar")) {
    await fecharModal()
  }

  // Navega para tela de insumos
  if (e.target.closest(".proxinsumos")) {
    navegarParaInsumos(e)
  }

  // Navega para tela de confirmação
  if (e.target.closest(".finalizar")) {
    navegarParaMostrarOrdem(e)
  }

  // Confirma criação da ordem
  if (e.target.closest(".confirmar")) {
    await confirmarOrdem()
  }

  // Adiciona insumo à lista
  if (e.target.closest(".adicionar")) {
    e.preventDefault()
    adicionarInsumo()
  }
}

// Abre o modal de criação de ordem
function abrirModal() {
  if (document.querySelector("#createModal")) return

  fetch('/Sewfy/view/ordensdeproducao/requisicao/requisicao.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML("afterbegin", data)
      const modal = document.querySelector("#createModal")
      modal.style.opacity = "1"

      if (document.querySelector("select.input-produto")) {
        console.log("Select existe")
        carregarProdutosEmSelect("final")
      }
    })
}

// Fecha o modal e reseta os dados
async function fecharModal() {
  OPINs.length = 0
  listaProdutos = await window.api.get("/produtos")
  document.querySelector("#createModal").remove()
}

// Navega da tela de produto para tela de insumos
function navegarParaInsumos(e) {
  e.preventDefault()

  const selectProduto = document.querySelector("select.input-produto")
  const opcao = selectProduto.options[selectProduto.selectedIndex]
  const campoQuant = document.querySelector("input.input-produto")
  const quantidade = parseInt(campoQuant.value)
  const campoFor = document.querySelector(".campoFornecedor")

  // Valida se produto foi selecionado e quantidade foi preenchida
  if (opcao.value == "Produto" || !quantidade) {
    mostrarToast("Todos os campos devem ser preenchidos corretamente!", "erro")
    return
  }

  // Valida se quantidade é positiva
  if (quantidade <= 0) {
    mostrarToast("A quantidade deve ser maior que 0!", "erro")
    return
  }

  // Armazena dados do produto selecionado
  op.PROD_NOME = opcao.value
  op.PROD_ID = parseInt(opcao.id)
  op.OP_QTD = quantidade
  
  // Remove produto selecionado da lista disponível
  listaProdutos = listaProdutos.filter(p => p.id !== op.PROD_ID)
  
  irOutraTela(".produto", ".insumos")
  carregarProdutosEmSelect("insumos")
  carregaFornecedores(campoFor)
}

// Navega da tela de insumos para tela de confirmação
function navegarParaMostrarOrdem(e) {
  e.preventDefault()
  
  // Valida se ao menos um insumo foi adicionado
  if (OPINs.length <= 0) {
    mostrarToast("Insira ao menos um insumo na ordem de produção!", "erro")
    return
  }
  
  irOutraTela(".insumos", ".mostrarOrdem")
  organizaDados()
}

// Alterna entre telas do modal
function irOutraTela(atual, proxima) {
  document.querySelector(atual).style.display = "none"
  document.querySelector(proxima).style.display = "block"
}

// Retorna data e hora no formato SQL
function dataFormatada() {
  const data = new Date()
  const min = data.getMinutes()
  const seg = data.getSeconds()
  const h = data.getHours()
  const dia = String(data.getDate()).padStart(2, '0')
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const ano = data.getFullYear()

  return `${ano}-${mes}-${dia} ${h}:${min}:${seg}`
}

// Confirma e envia ordem de produção para o servidor
async function confirmarOrdem() {
  try {
    console.log(`OPINs: ${OPINs}`)
    // Monta objeto com dados da ordem
    const dados = {
      OP_QTD: op.OP_QTD,
      OP_DATAA: dataFormatada(),
      OP_CUSTOU: calculaCustoU(),
      OP_CUSTOT: calculaCustoT(),
      PROD_ID: op.PROD_ID,
      INSUMOS: [...OPINs]
    }
    
    // Limpa array de insumos
    OPINs.length = 0
    
    // Envia ordem para API
    await window.api.post('/ordemdeproducao/criar', dados)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Fecha modal
    document.querySelector("#createModal")?.remove()
    
    // Atualiza lista de ordens
    await limparLista()
    await new Promise(resolve => setTimeout(resolve, 300))
    await listarOrdensProducao()
    
    mostrarToast("Ordem de Produção criada!")
  } catch (error) {
    console.log(`Erro ao confirmar ordem: ${error}`)
  }
}

// Obtém o valor da opção selecionada em um select
function obterValorSelect(selectElement) {
  const selectedOption = selectElement.options[selectElement.selectedIndex]
  return selectedOption.value === "" ? null : selectedOption
}

// Valida campos obrigatórios do insumo
function validarCamposInsumo(opInsumo, quant) {
  if (!opInsumo || !quant) {
    mostrarToast("Preencha todos os campos!", "erro")
    return false
  }

  if (quant == 0) {
    mostrarToast("A quantidade deve ser maior que 0!", "erro")
    return false
  }

  return true
}

// Cria linha na tabela de insumos
function criarLinhaTabela(idInsumo, quant, nomeInsumo, nomeFornecedor, unidadeMedida) {
  const tr = document.createElement("tr")
  const th = document.createElement("th")
  const td = document.createElement("td")
  const tdF = document.createElement("td")
  const tdUM = document.createElement("td")
  tr.id = `tr${idInsumo}`

  tr.innerHTML = `
  <td id="quantidade${idInsumo}">${quant}</td>
  <td>${nomeInsumo}</td>
  <td>${nomeFornecedor}</td>
  <td>${unidadeMedida}</td>
  `
  return tr
}

// Limpa os campos do formulário de insumo
function limparCamposInsumo(campoInsumo, campoQuant, campoUm, campoFor) {
  campoInsumo.value = ""
  campoQuant.value = ""
  campoUm.value = ""
  campoFor.value = ""
}

// Define unidade de medida automaticamente ao selecionar insumo
async function defineUM(e) {
  if (e.target.closest(".campoInsumo")) {
    const select = document.querySelector(".campoInsumo")
    const insumo = obterValorSelect(select)
    
    // Busca dados do produto selecionado
   
    const produto = await window.api.get(`/produtos/${parseInt(insumo.id)}`)
    
    console.log("Mudando a propriedade do campo de unidade")
    
    // Preenche campo de unidade de medida
    const campoUm = document.querySelector(".campoUniMed")
    campoUm.value = produto.um
    campoUm.disabled = true
  }
}

// Adiciona insumo à ordem de produção
async function adicionarInsumo() {
  try {
    const tabelaInsumos = document.getElementById("tabelaInsumos")
    const campoInsumo = document.querySelector(".campoInsumo")
    const campoQuant = document.querySelector(".campoQuant")
    const campoFor = document.querySelector(".campoFornecedor")
    const campoUm = document.querySelector(".campoUniMed")

    const opInsumo = obterValorSelect(campoInsumo)
    const quant = parseInt(campoQuant.value) <= 0 || isNaN(campoQuant.value) ? 0 : parseInt(campoQuant.value)
    const fornecedor = obterValorSelect(campoFor)

    // Valida campos
    if (!validarCamposInsumo(opInsumo, quant)) {
      return
    }

    console.log(`ID do Insumo: ${parseInt(opInsumo.id)}`)

    // Busca preço do insumo
    
    const produto = await window.api.get(`/produtos/${parseInt(opInsumo.id)}`)
    console.log(`PRODUTO: ${produto.preco}`)

    const um = obterValorSelect(campoUm)
    const custou = parseFloat(produto.preco)
    const custot = custou * quant
    
    // Cria objeto do insumo
    const insumo = {
      IDFORNECEDOR: valorIdFornecedor("id", fornecedor),
      QTDIN: quant,
      CUSTOT: custot,
      CUSTOU: custou,
      UM: um.value,
      INSUNOME: opInsumo.value,
      INSUID: parseInt(opInsumo.id)
    }
    
    // Adiciona linha na tabela
    const tr = criarLinhaTabela(parseInt(opInsumo.id), quant, opInsumo.value, valorIdFornecedor("valor", fornecedor), um.value)
    tabelaInsumos.appendChild(tr)
    
    // Adiciona insumo ao array
    OPINs.push(insumo)
    
    // Remove insumo da lista de produtos disponíveis
    listaProdutos = listaProdutos.filter(produto => parseInt(produto.id) !== parseInt(opInsumo.id))

    carregarProdutosInsumo(listaProdutos, campoInsumo)
    limparCamposInsumo(campoInsumo, campoQuant, campoUm, campoFor)
    campoUm.disabled = false
  } catch (error) {
    console.log(`Erro ao adicionar insumo na ordem de produção: ${error}`)
  }
}

// Retorna valor ou id do fornecedor
function valorIdFornecedor(atributo, fornecedor) {
  if (atributo == "valor") {
    return !fornecedor ? "Sem fornecedor" : fornecedor.value
  } else {
    console.log(`Este é o id do fornecedor `)
    return !fornecedor ? null : parseInt(fornecedor.id)
  }
}

// Cria elemento option para produto
function criarOptionProduto(produto) {
  const option = document.createElement('option')
  option.id = `${produto.id}`
  option.innerHTML = `${produto.nome}`
  return option
}

// Carrega produtos finais no select
function carregarProdutosFinal(listaProd, selectProduto) {
  selectProduto.innerHTML = `
    <option value="">Produto</option>
    `
  listaProd.forEach(p => {
    if ((p.tipo == PROD_TIPO.FINAL || p.tipo == PROD_TIPO.CONJUNTO) && p.ativo == 1) {
      const option = criarOptionProduto(p)
      selectProduto.appendChild(option)
    }
  })
}

// Carrega insumos no select
function carregarProdutosInsumo(listaProd, selectInsumo) {
  selectInsumo.innerHTML = `
    <option value="">Insumo</option>
    `
  listaProd.forEach(p => {
    if (p.tipo == PROD_TIPO.INSUMO && p.ativo == 1) {
      const option = criarOptionProduto(p)
      selectInsumo.appendChild(option)
    }
  })
}

// Carrega produtos em select conforme tipo
function carregarProdutosEmSelect(tipo) {
  try {
    const selectProduto = document.querySelector("select.input-produto")
    const selectInsumo = document.querySelector(".campoInsumo")

    if (tipo == 'final') {
      carregarProdutosFinal(listaProdutos, selectProduto)
    } else {
      carregarProdutosInsumo(listaProdutos, selectInsumo)
    }
  } catch (error) {
    console.log(`Erro ao buscar produtos: ${error}`)
  }
}

// Carrega fornecedores no select
async function carregaFornecedores(campo) {
  try {
    const fornecedores = await window.api.get("/fornecedores")
    
    fornecedores.forEach(fornecedor => {
      const option = document.createElement("option")
      option.id = `${fornecedor.id}`
      option.innerHTML = `${fornecedor.nome}`
      campo.appendChild(option)
    })
  } catch (error) {
    console.log(`Erro ao carregar fornecedores: ${error}`)
  }
}

// Carrega insumos na tabela de confirmação
function carregaDadosInsumos() {
  const tabela = document.querySelector("#tabelaIN")
  OPINs.forEach(insumo => {
    const tr = document.createElement("tr")
    tr.innerHTML = `
  <td> ${insumo.QTDIN} ${insumo.UM} de ${insumo.INSUNOME}</td>`
    tabela.appendChild(tr)
  })
}

// Calcula custo total da ordem
function calculaCustoT() {
  let custot = 0
  OPINs.forEach(insumo => {
    custot += parseFloat(insumo.CUSTOT)
  })
  return custot
}

// Calcula custo unitário da ordem
function calculaCustoU() {
  const custou = (calculaCustoT() / parseFloat(op.OP_QTD)).toFixed(2)
  console.log(`Custot: ${calculaCustoT()}\nQTD: ${parseFloat(op.OP_QTD)}\nCustou: ${parseFloat(custou)}`)
  return parseFloat(custou)
}

// Organiza e exibe dados na tela de confirmação
function organizaDados() {
  const campoProduto = document.querySelector("#nomeProduto")
  const campoQtd = document.querySelector("#quantidadeProduto")
  const campoCustou = document.querySelector("#custou")
  const campoCustot = document.querySelector("#custot")
  
  campoProduto.innerHTML = `${op.PROD_NOME}`
  campoQtd.innerHTML = `${op.OP_QTD}`
  campoCustot.innerHTML = `${calculaCustoT().toFixed(2)}`
  campoCustou.innerHTML = `${calculaCustoU().toFixed(2)}`
  
  carregaDadosInsumos()
}