@extends('layouts.app')

@section('titulo', 'Contas a Pagar')
@push('styles')
    @vite(['resources/css/visualizarContas.css','resources/css/todasContas.css', 'resources/css/menu.css', 'resources/css/configmenu.css'])
@endpush

@section('conteudo')
    <main class="principal">
        <div class="cabecalho-principal">
            <h1>Contas a Pagar</h1>

            <button class="botao-criar-conta-pagar">
                <span class="material-symbols-outlined icone-adicionar-conta">add</span>
                Nova Conta
            </button>
        </div>

        <div class="filtros" id="filtros">
            <div class="linha-filtros-topo">
                <div class="input-pesquisa">
                    <svg class="icone-lupa" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input type="text" placeholder="Pesquisar por Fornecedor ou Ordem de Produção...">
                </div>

                <div class="box-filtro">
                    <span class="material-symbols-outlined icone-filtro">filter_alt</span>
                    <select id="tipos-filtro">
                        <option value="todas">Todos os Status</option>
                        <option value="pendente">Pendentes</option>
                        <option value="atrasada">Atrasadas</option>
                        <option value="paga">Pagas</option>
                    </select>
                </div>

                <div class="mais-filtros" id="mais-filtros">
                    <button class="material-symbols-outlined btn-filtro-extra" id="btn-mais-filtros">add</button>
                    <div class="dropdown-filtros" id="dropdown-filtros">
                        <button data-filtro="tempo">
                            <span class="material-symbols-outlined icone-calendario">calendar_today</span>
                            Adicionar intervalo de tempo
                        </button>
                        <button data-filtro="valor">
                            <span class="material-symbols-outlined icone-dinheiro">attach_money</span>
                            Adicionar intervalo de valor
                        </button>
                    </div>
                </div>
            </div>

            <div id="container-filtros"></div>
        </div>

        <div id="listaContas" class="lista-contas">
            <table class="tabela">
                <thead class="table-head">
                    <tr class="table-head-row">
                        <th class="table-head-cell">Status</th>
                        <th class="table-head-cell">Código</th>
                        <th class="table-head-cell">Fornecedor</th>
                        <th class="table-head-cell">Vencimento</th>
                        <th class="table-head-cell table-head-cell--right">Pagamento</th>
                        <th class="table-head-cell">Ações</th>
                    </tr>
                </thead>
                <tbody id="contas-table" class="table-body"></tbody>
            </table>
        </div>
    </main>
@endsection

@section('scripts')
@vite('resources/js/todasContas.js')
<script>
document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("blur", (e) => {
        if (e.target.matches(".input-valor-min, .input-valor-max")) {
            window.executarBuscaComFiltros?.();
        }
    }, true);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && e.target.matches(".input-valor-min, .input-valor-max")) {
            e.target.blur();
            window.executarBuscaComFiltros?.();
        }
    });
});
</script>
@endsection