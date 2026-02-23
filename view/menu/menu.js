// CHAMA O MENU
fetch('/Sewfy/view/menu/menu.html')
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
    'sub-clientes':            '/Sewfy/view/faturamento/clientes/clientes.html',
    'sub-pedidos-venda':       '/Sewfy/view/faturamento/pedidosVenda/pedidosVenda.html',
    'sub-notas-fiscais':       '/Sewfy/view/faturamento/notasFiscais/notasFiscais.html',
    'sub-ordens-servico':      '/Sewfy/view/faturamento/ordensServico/ordensServico.html',
    'sub-vendedores':          '/Sewfy/view/faturamento/vendedores/vendedores.html',

    // Financeiro
    'sub-contas-pagar':        '/Sewfy/view/contas/todasContas/todasContas.html',
    'sub-contas-receber':      '/Sewfy/view/financeiro/contasReceber/contasReceber.html',
    'sub-caixas-bancos':       '/Sewfy/view/financeiro/caixasBancos/caixasBancos.html',
    'sub-remessas':            '/Sewfy/view/financeiro/remessas/remessas.html',
    'sub-comissoes':           '/Sewfy/view/financeiro/comissoes/comissoes.html',

    // Produção
    'sub-cad-produtos':        '/Sewfy/view/produtos/todosProdutos/todosProdutos.html',
    'sub-cad-fornecedores':    '/Sewfy/view/fornecedores/todosFornecedores/todosFornecedores.html',
    'sub-ordens-producao':     '/Sewfy/view/ordensdeproducao/gerenciar/gerenciarOrdensDeProducao.html',
    'sub-estoque':             '/Sewfy/view/estoque/estoque.html',

    // Relatórios
    'sub-relatorios':          '/Sewfy/view/relatorios/relatorios.html',

    // Footer
    'btn-config':              '/Sewfy/view/configuracoes/configuracoes.html',
    'btn-logout':              '/Sewfy/view/login/login.html',
    'logo':                    '/Sewfy/view/home/home.html',
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