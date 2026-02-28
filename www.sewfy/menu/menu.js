// CHAMA O MENU
fetch('/www.sewfy/menu/index.html')
    .then(response => response.text())
    .then(data => {
        document.querySelector('.layout').insertAdjacentHTML("afterbegin", data)

        // Toggle dos submenus
        document.querySelectorAll('.nav-btn[data-menu]').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = document.getElementById(btn.dataset.menu)
                const isOpen = item.classList.contains('open')
                document.querySelectorAll('.nav-item.open').forEach(el => el.classList.remove('open'))
                if (!isOpen) item.classList.add('open')
            })
        })

        ativarModuloAtual()
        document.body.classList.add('loaded')
    })


// NAVEGAÇÃO DOS SUBMENUS
const rotas = {
    // Faturamento
    'sub-clientes':            '/www.sewfy/faturamento/clientes',
    'sub-pedidos-venda':       '/www.sewfy/faturamento/pedidosVenda',
    'sub-notas-fiscais':       '/www.sewfy/faturamento/notasFiscais',
    'sub-ordens-servico':      '/www.sewfy/faturamento/ordensServico',
    'sub-vendedores':          '/www.sewfy/faturamento/vendedores',

    // Financeiro
    'sub-contas-pagar':        '/www.sewfy/financeiro/contas/todasContas',
    'sub-contas-receber':      '/www.sewfy/financeiro/contasReceber',
    'sub-caixas-bancos':       '/www.sewfy/financeiro/caixasBancos',
    'sub-remessas':            '/www.sewfy/financeiro/remessas',
    'sub-comissoes':           '/www.sewfy/financeiro/comissoes',

    // Produção
    'sub-cad-produtos':        '/www.sewfy/produtos/todosProdutos',
    'sub-cad-fornecedores':    '/www.sewfy/fornecedores/todosFornecedores',
    'sub-ordens-producao':     '/www.sewfy/ordensdeproducao/gerenciar',
    'sub-estoque':             '/www.sewfy/estoque',

    // Relatórios
    'sub-relatorios':          '/www.sewfy/relatorios',

    // Footer
    'btn-config':              '/www.sewfy/configuracoes',
    'btn-logout':              '/www.sewfy/login',
    'logo':                    '/www.sewfy/home',
}

document.addEventListener('click', (e) => {
    const id = e.target.closest('[id]')?.id
    if (!id) return

    if (rotas[id]) {
        if (id === 'btn-logout') {
            window.location.replace(rotas[id])
        } else {
            window.location.href = rotas[id]
        }
    }
});


// MARCA O MÓDULO E SUBMENU ATIVO COM BASE NA URL ATUAL
function ativarModuloAtual() {
    const path = window.location.pathname

    const mapa = [
        { modulo: 'item-faturamento',  paths: ['faturamento', 'clientes', 'pedidosVenda', 'notasFiscais', 'ordensServico', 'vendedores'] },
        { modulo: 'item-financeiro',   paths: ['financeiro', 'contas', 'contasReceber', 'caixasBancos', 'remessas', 'comissoes'] },
        { modulo: 'item-compras',      paths: ['compras'] },
        { modulo: 'item-producao',     paths: ['produtos', 'fornecedores', 'ordensdeproducao', 'estoque'] },
        { modulo: 'item-relatorios',   paths: ['relatorios'] },
        { modulo: 'item-rh',           paths: ['rh'] },
    ]

    mapa.forEach(({ modulo, paths }) => {
        if (paths.some(p => path.includes(p))) {
            // Abre o módulo correspondente
            document.getElementById(modulo)?.classList.add('open')

            // Marca o submenu-btn ativo
            document.querySelectorAll(`#${modulo} .submenu-btn`).forEach(btn => {
                if (path.includes(btn.dataset.path)) {
                    btn.classList.add('active')
                }
            })
        }
    })
}