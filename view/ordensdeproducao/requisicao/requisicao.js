import { mostrarToast } from '../../toast/toast.js';

const listaProdutosBanco = await window.api.get('/produtos/lista')
let listaProdutos = listaProdutosBanco.produtos

const PROD_TIPO = {
  INSUMO: 1,
  FINAL: 2,
  CONJUNTO: 3
}



const op = {
  PROD_ID: null,
  OP_QTD: null,
  OP_CUSTOU: null,
  OP_CUSTOT: null
}
const OPINs = []

// ABRE MODAL

document.addEventListener("click", handleGlobalClick)
document.addEventListener("change", defineUM)

function handleGlobalClick(e) {
  if (e.target.closest(".icone-adicionar-ordem") || e.target.closest(".botao-criar-ordem")) {
    abrirModal()
  }

  if (e.target.closest(".modal-close") || e.target.closest(".cancelar")) {
    fecharModal()
  }

  if (e.target.closest(".proxinsumos")) {
    navegarParaInsumos(e)
  }

  if (e.target.closest(".finalizar")) {
    navegarParaMostrarOrdem(e)
  }

  if (e.target.closest(".confirmar")) {
    confirmarOrdem()
  }

  if (e.target.closest(".adicionar")) {
    e.preventDefault()
    adicionarInsumo()
  }
}

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

// FECHA MODAL

function fecharModal() {
  OPINs.length = 0
  listaProdutos = listaProdutosBanco.produtos
  document.querySelector("#createModal").remove()
}

// IR PARA OUTRAS TELAS

function navegarParaInsumos(e) {
  e.preventDefault()

  const selectProduto = document.querySelector("select.input-produto")
  const opcao = selectProduto.options[selectProduto.selectedIndex]
  const campoQuant = document.querySelector("input.input-produto")
  const quantidade = parseInt(campoQuant.value)
  const campoFor = document.querySelector(".campoFornecedor")

  if (opcao.value == "Produto" || !quantidade) {
    mostrarToast("Todos os campos devem ser preenchidos corretamente!", "erro")
    return
  }

  if (quantidade <= 0) {
    mostrarToast("A quantidade deve ser maior que 0!", "erro")
    return
  }

  op.PROD_ID = parseInt(opcao.id)
  op.OP_QTD = quantidade
  irOutraTela(".produto", ".insumos")
  carregarProdutosEmSelect("insumos")
  carregaFornecedores(campoFor)
}

function navegarParaMostrarOrdem(e) {
  e.preventDefault()
  if (OPINs.length <= 0) {
    mostrarToast("Insira ao menos um insumo na ordem de produção!", "erro")
    return
  }
  irOutraTela(".insumos", ".mostrarOrdem")
}

function irOutraTela(atual, proxima) {
  document.querySelector(atual).style.display = "none"
  document.querySelector(proxima).style.display = "block"
}

// FUNÇÃO DA DATA FORMATADA

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

// CONFIRMA A OP

async function confirmarOrdem() {
  document.querySelector("#createModal").remove()

  const dados = {
    OP_QTD: op.OP_QTD,
    OP_DATAA: dataFormatada(),
    PROD_ID: op.PROD_ID,
    INSUMOS: OPINs
  }
  listaProdutos = listaProdutosBanco.produtos

  await window.api.post('/ordemdeproducao/criar', dados)
  mostrarToast("Ordem de Produção criada!")
}

// ADICIONA INSUMO NA TABLE

function obterValorSelect(selectElement) {
  const selectedOption = selectElement.options[selectElement.selectedIndex]
  return selectedOption.value === "" ? null : selectedOption
}

function validarCamposInsumo(opInsumo, quant) {
  if (!opInsumo) {
    mostrarToast("Preencha todos os campos!", "erro")
    return false
  }

  if (quant === 0) {
    mostrarToast("A quantidade deve ser maior que 0!", "erro")
    return false
  }

  return true
}

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

function limparCamposInsumo(campoInsumo, campoQuant, campoUm, campoFor) {
  campoInsumo.value = ""
  campoQuant.value = ""
  campoUm.value = ""
  campoFor.value = ""
}
async function defineUM(e) {
  if (e.target.closest(".campoInsumo")) {
    const select = document.querySelector(".campoInsumo")
    const insumo = obterValorSelect(select)
    const busca = await window.api.buscaId(`/produtos/buscaProduto`, parseInt(insumo.id))
    console.log("Mudando a propriedade do campo de unidade")
    const campoUm = document.querySelector(".campoUniMed")
    campoUm.value = busca.produto.PROD_UM
    campoUm.disabled = true;
  }
}
async function adicionarInsumo() {
  try {
    const tabelaInsumos = document.getElementById("tabelaInsumos")
    const campoInsumo = document.querySelector(".campoInsumo")
    const campoQuant = document.querySelector(".campoQuant")
    const campoFor = document.querySelector(".campoFornecedor")
    const campoUm = document.querySelector(".campoUniMed")

    const opInsumo = obterValorSelect(campoInsumo)
    const quant = parseInt(campoQuant.value) <= 0 ? 0 : parseInt(campoQuant.value)

    const fornecedor = obterValorSelect(campoFor)

    if (!validarCamposInsumo(opInsumo, quant)) {
      return
    }

    console.log(`ID do Insumo: ${parseInt(opInsumo.id)}`)

    const busca = await window.api.buscaId(`/produtos/buscaProduto`, parseInt(opInsumo.id))

    console.log(`Resultado da Busca: ${Object.keys(busca).map(prod => `${prod}: ${busca[prod]}`).join('\n')}`)
    console.log(`PRODUTO: ${busca.produto.PROD_PRECO}`)



    const um = obterValorSelect(campoUm)
    const custou = parseFloat(busca.produto.PROD_PRECO)
    const custot = custou * quant
    const insumo = {
      IDFORNECEDOR: valorIdFornecedor("id", fornecedor),
      QTDIN: quant,
      CUSTOT: custot,
      CUSTOU: custou,
      UM: um.value,
      INSUID: parseInt(opInsumo.id)
    }
    const tr = criarLinhaTabela(parseInt(opInsumo.id), quant, opInsumo.value, valorIdFornecedor("valor", fornecedor), um.value)
    tabelaInsumos.appendChild(tr)
    OPINs.push(insumo)
    listaProdutos = listaProdutos.filter(produto =>parseInt(produto.PROD_ID) !== parseInt(opInsumo.id))

    carregarProdutosInsumo(listaProdutos, campoInsumo)
    limparCamposInsumo(campoInsumo, campoQuant, campoUm, campoFor)
    campoUm.disabled = false;
  } catch (error) {
    console.log(`Erro ao adicionar insumo na ordem de produção: ${error}`)
  }
}
function valorIdFornecedor(atributo, fornecedor) {
  if (atributo == "valor") {
    return !fornecedor ? "Sem fornecedor" : fornecedor.value
  }
  else {

    console.log(`Este é o id do fornecedor `)
    return !fornecedor ? null : parseInt(fornecedor.id)
  }
}

// CARREGA OS PRODUTOS DO BANCO

function criarOptionProduto(produto) {
  const option = document.createElement('option')
  option.id = `${produto.PROD_ID}`
  option.innerHTML = `${produto.PROD_NOME}`
  return option
}

function carregarProdutosFinal(listaProd, selectProduto) {
  selectProduto.innerHTML = `
    <option value="">Produto</option>
    `
  listaProd.forEach(p => {
    if ((p.PROD_TIPO == PROD_TIPO.FINAL || p.PROD_TIPO == PROD_TIPO.CONJUNTO) && p.PROD_ATIV == 1) {
      const option = criarOptionProduto(p)
      selectProduto.appendChild(option)
    }
  })
}

function carregarProdutosInsumo(listaProd, selectInsumo) {
  selectInsumo.innerHTML = `
    <option value="">Insumo</option>
    `
  listaProd.forEach(p => {
    if (p.PROD_TIPO == PROD_TIPO.INSUMO && p.PROD_ATIV == 1) {
      const option = criarOptionProduto(p)
      selectInsumo.appendChild(option)
    }
  })
}

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

async function carregaFornecedores(campo) {
  try {
    const response = await fetch("/Sewfy/controller/fornecedores/ListarFornecedoresController.php")
    const fornecedores = await response.json()
    if (!response.ok) {
      console.log(`Falha no banco de dados: ${response}`)
      return
    }
    if (!fornecedores) {
      console.log("Erro ao buscar fornecedores")
      return
    }

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
