// Função principal para listar ordens de produção
export async function listarOrdensProducao() {
    try {
        // Busca a lista de ordens de produção do banco de dados
        const listaOPsBanco = await window.api.get("/ordemdeproducao/listar")
        const listaOPs = listaOPsBanco.ordensProducao
        
        // Seleciona o elemento DOM onde as ordens serão exibidas
        const listaOrdensDOM = document.querySelector(".lista-ordens")
        
        // Itera sobre cada ordem de produção retornada
        for (const op of listaOPs) {
            // Cria o container principal do card
            const cardsOrdens = document.createElement('div')
            cardsOrdens.classList = 'card-ordem'
            const contentOrdem = document.createElement('div')
            contentOrdem.className = 'content-ordem'

            // Cria a seção que exibe código e status da ordem
            const ordemCodigoStatus = document.createElement('div')
            ordemCodigoStatus.className = 'ordem-codigo-status'

            // Cria o label "Ordem de Produção"
            const labelOrdem = document.createElement('div')
            labelOrdem.className = 'label-ordem'
            labelOrdem.textContent = 'Ordem de Produção'

            // Cria o elemento para exibir o código da ordem
            const codigoOrdem = document.createElement('div')
            codigoOrdem.className = 'codigo-ordem'

            // Define classe e texto do status com base na data de encerramento
            // Se OP_DATAE não existe, a ordem está aberta
            const statusClass = !op.OP_DATAE ? 'aberta' : 'fechada'
            const statusTexto = !op.OP_DATAE ? 'Aberta' : 'Fechada'
            const statusOrdem = document.createElement('div')
            statusOrdem.className = `status-ordem ${statusClass}`

            // Cria o ícone do status
            const iconeStatus = document.createElement('span')
            iconeStatus.className = 'icone-status'
            iconeStatus.textContent = dados.iconeStatus || '⏱'

            // Monta a estrutura do status e código
            statusOrdem.appendChild(iconeStatus)
            ordemCodigoStatus.appendChild(labelOrdem)
            ordemCodigoStatus.appendChild(codigoOrdem)
            ordemCodigoStatus.appendChild(statusOrdem)

            // Adiciona o texto do status
            statusOrdem.appendChild(document.createTextNode('\n' + (statusTexto) + '\n'))
            codigoOrdem.textContent = op.OP_ID

            // Busca o nome do produto relacionado à ordem
            const nomeProduto = await retornaNomeProduto(op.PRODUTO_ID)

            // Logs de debug para acompanhar os dados
            console.log(`DENTRO DA FUNÇÃO listarOrdens() -> PRODUTO_ID: ${op.PRODUTO_ID}`)
            console.log(`DENTRO DA FUNÇÃO listarOrdens() -> PRODUTO_NOME: ${nomeProduto}`)

            // Formata as datas de abertura e fechamento
            const dataAbertura = new Date(op.OP_DATAA).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
            const dataFechamento = op.OP_DATAE ? new Date(op.OP_DATAE).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '------'
            
            // Cria os elementos de informação da ordem
            const infoProduto = criarInfoOrdem('package_2', 'Produto', nomeProduto || 'Sem Nome')
            const infoQuantidade = criarInfoOrdem('package_2', 'Quantidade', op.OP_QTD)
            const infoDataAbertura = criarInfoOrdem('calendar_month', 'Data de Abertura', dataAbertura || '01/01/2026')
            const infoDataFechamento = criarInfoOrdem('calendar_month', 'Data de Fechamento', dataFechamento)

            // Cria a seção do botão de visualização
            const verop = document.createElement('div')
            verop.className = 'verop'

            const btnVerop = document.createElement('button')
            btnVerop.className = 'btn-verop'
            btnVerop.textContent = '\nVer Ordem de Produção\n'

            verop.appendChild(btnVerop)

            // Monta a estrutura completa do card
            contentOrdem.appendChild(ordemCodigoStatus)
            contentOrdem.appendChild(infoProduto)
            contentOrdem.appendChild(infoQuantidade)
            contentOrdem.appendChild(infoDataAbertura)
            contentOrdem.appendChild(infoDataFechamento)
            contentOrdem.appendChild(verop)

            cardsOrdens.appendChild(contentOrdem)
            
            // Adiciona o card ao DOM
            listaOrdensDOM.appendChild(cardsOrdens)
        }
    } catch (error) {
        console.log(`Erro ao listar as ordens de produção: ${error}`)
    }
}

// Função para buscar o nome do produto pelo ID
async function retornaNomeProduto(id) {
    try {
        // Faz requisição para buscar dados do produto
        const response = await fetch(
            `/Sewfy/controller/produtos/VisualizarProdutoController.php?id=${id}`
        )
        const produto = await response.json()
        
        // Log de debug
        console.log(` DENTRO DA FUNÇÃO retornaNomeProduto() -> PROD_NOME:${produto.nome}`)

        return produto.nome
    } catch (error) {
        console.log(`Erro ao buscar produto: ${error}`)
    }
}

// Função auxiliar para criar elementos de informação da ordem
function criarInfoOrdem(icone, label, valor) {
    // Cria o container principal da informação
    const infoOrdem = document.createElement('div')
    infoOrdem.className = 'info-ordem'

    // Cria o elemento do ícone
    const iconeElement = document.createElement('span')
    iconeElement.className = 'material-symbols-outlined icone'
    iconeElement.textContent = '\n                            ' + icone + '\n                        '

    // Cria container para label e valor
    const divContainer = document.createElement('div')

    // Cria o label da informação
    const labelInfo = document.createElement('div')
    labelInfo.className = 'label-info'
    labelInfo.textContent = label

    // Cria o elemento que exibe o valor
    const valorInfo = document.createElement('div')
    valorInfo.className = 'valor-info'
    valorInfo.textContent = valor

    // Monta a estrutura
    divContainer.appendChild(labelInfo)
    divContainer.appendChild(valorInfo)

    infoOrdem.appendChild(iconeElement)
    infoOrdem.appendChild(divContainer)

    return infoOrdem
}

// Objeto com dados de configuração
const dados = {
    iconeStatus: '⏱',
}

// Função para limpar a lista de ordens do DOM
export function limparLista() {
    const listaOrdensDOM = document.querySelector(".lista-ordens")
    listaOrdensDOM.innerHTML = ''
}

// Executa a função de listagem ao carregar o módulo
listarOrdensProducao()