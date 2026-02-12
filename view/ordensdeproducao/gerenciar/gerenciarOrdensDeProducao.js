
const listaOPsBanco = await window.api.get("/ordemdeproducao/listar");
const listaOPs = listaOPsBanco.ordensProducao;

async function listarOrdensProducao() {
    try
   { const listaOrdensDOM = document.querySelector(".lista-ordens");
    for(const op of listaOPs){
        // Cria o container principal
        const cardsOrdens = document.createElement('div');
        cardsOrdens.classList = 'card-ordem'
        const contentOrdem = document.createElement('div');
        contentOrdem.className = 'content-ordem';

        // Cria a seção de código e status
        const ordemCodigoStatus = document.createElement('div');
        ordemCodigoStatus.className = 'ordem-codigo-status';

        const labelOrdem = document.createElement('div');
        labelOrdem.className = 'label-ordem';
        labelOrdem.textContent = 'Ordem de Produção';

        const codigoOrdem = document.createElement('div');
        codigoOrdem.className = 'codigo-ordem';


        const statusClass = !op.OP_DATAE ? 'aberta' : 'fechada'
        const statusTexto = !op.OP_DATAE ? 'Aberta' : 'Fechada'
        const statusOrdem = document.createElement('div');
        statusOrdem.className = `status-ordem ${statusClass}`;

        const iconeStatus = document.createElement('span');
        iconeStatus.className = 'icone-status';
        iconeStatus.textContent = dados.iconeStatus || '⏱';

        statusOrdem.appendChild(iconeStatus);
        ordemCodigoStatus.appendChild(labelOrdem);
        ordemCodigoStatus.appendChild(codigoOrdem);
        ordemCodigoStatus.appendChild(statusOrdem);

        statusOrdem.appendChild(document.createTextNode('\n' + (statusTexto) + '\n'));
        codigoOrdem.textContent = op.OP_ID;

        const nomeProduto = await retornaNomeProduto(op.PRODUTO_ID);

        console.log(`DENTRO DA FUNÇÃO listarOrdens() -> PRODUTO_ID: ${op.PRODUTO_ID}`);
        console.log(`DENTRO DA FUNÇÃO listarOrdens() -> PRODUTO_NOME: ${nomeProduto}`);


        // Cria as informações da ordem
        const dataAbertura = new Intl.DateTimeFormat('pt-BR').format(new Date(op.OP_DATAA))
        const dataFechamento = op.DATAE ? new Intl.DateTimeFormat('pt-BR').format(new Date(op.OP_DATAE)) : '------'
        const infoProduto = criarInfoOrdem('package_2', 'Produto', nomeProduto || 'Sem Nome');
        const infoQuantidade = criarInfoOrdem('package_2', 'Quantidade', op.OP_QTD);
        const infoDataAbertura = criarInfoOrdem('calendar_month', 'Data de Abertura', dataAbertura || '01/01/2026');
        const infoDataFechamento = criarInfoOrdem('calendar_month', 'Data de Fechamento', dataFechamento);

        // Cria a seção do botão
        const verop = document.createElement('div');
        verop.className = 'verop';

        const btnVerop = document.createElement('button');
        btnVerop.className = 'btn-verop';
        btnVerop.textContent = '\nVer Ordem de Produção\n';

        verop.appendChild(btnVerop);

        // Adiciona todos os elementos ao container principal
        contentOrdem.appendChild(ordemCodigoStatus);
        contentOrdem.appendChild(infoProduto);
        contentOrdem.appendChild(infoQuantidade);
        contentOrdem.appendChild(infoDataAbertura);
        contentOrdem.appendChild(infoDataFechamento);
        contentOrdem.appendChild(verop);

        cardsOrdens.appendChild(contentOrdem);
        listaOrdensDOM.appendChild(cardsOrdens);
    }}catch(error){
        console.log(`Erro ao listar as ordens de produção: ${error}`);
    }


};

// Busca Produto

async function retornaNomeProduto(id) {
    try {
        const busca = await window.api.get(`/produtos/buscaProduto/${id}`);
        const nomeProduto = busca.produto.PROD_NOME;
        console.log(` DENTRO DA FUNÇÃO retornaNomeProduto() -> PROD_NOME:${nomeProduto}`)

        return nomeProduto;
    } catch (error) {
        console.log(`Erro ao buscar produto: ${error}`);
    }

};

// Função auxiliar para criar info-ordem
function criarInfoOrdem(icone, label, valor) {
    const infoOrdem = document.createElement('div');
    infoOrdem.className = 'info-ordem';

    const iconeElement = document.createElement('span');
    iconeElement.className = 'material-symbols-outlined icone';
    iconeElement.textContent = '\n                            ' + icone + '\n                        ';

    const divContainer = document.createElement('div');

    const labelInfo = document.createElement('div');
    labelInfo.className = 'label-info';
    labelInfo.textContent = label;

    const valorInfo = document.createElement('div');
    valorInfo.className = 'valor-info';
    valorInfo.textContent = valor;

    divContainer.appendChild(labelInfo);
    divContainer.appendChild(valorInfo);

    infoOrdem.appendChild(iconeElement);
    infoOrdem.appendChild(divContainer);

    return infoOrdem;
};
const dados = {
    iconeStatus: '⏱',
};

listarOrdensProducao();