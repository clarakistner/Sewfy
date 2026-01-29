<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sewfy - Home</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        html, body {
            height: 100%;
            margin: 0;
        }
    </style>
</head>
<body class="h-full">
    <?php
    // Dados mock de produtos
    $products = [
        ['id' => 1, 'name' => 'Tecido Algodão', 'code' => 'TEC-001', 'type' => 'insumo', 'description' => 'Tecido 100% algodão', 'price' => 25.50, 'stock' => 150],
        ['id' => 2, 'name' => 'Linha Poliéster', 'code' => 'LIN-001', 'type' => 'insumo', 'description' => 'Linha resistente', 'price' => 5.90, 'stock' => 200],
        ['id' => 3, 'name' => 'Botão Plástico', 'code' => 'BOT-001', 'type' => 'insumo', 'description' => 'Botão 15mm', 'price' => 0.50, 'stock' => 500],
        ['id' => 4, 'name' => 'Zíper Metal', 'code' => 'ZIP-001', 'type' => 'insumo', 'description' => 'Zíper 20cm', 'price' => 3.50, 'stock' => 100],
        ['id' => 5, 'name' => 'Camisa Polo', 'code' => 'CAM-001', 'type' => 'final', 'description' => 'Camisa polo masculina', 'price' => 89.90, 'stock' => 50],
        ['id' => 6, 'name' => 'Calça Jeans', 'code' => 'CAL-001', 'type' => 'final', 'description' => 'Calça jeans feminina', 'price' => 129.90, 'stock' => 30],
        ['id' => 7, 'name' => 'Vestido Floral', 'code' => 'VES-001', 'type' => 'final', 'description' => 'Vestido estampado', 'price' => 149.90, 'stock' => 25],
        ['id' => 8, 'name' => 'Jaqueta Couro', 'code' => 'JAQ-001', 'type' => 'final', 'description' => 'Jaqueta sintética', 'price' => 299.90, 'stock' => 15],
        ['id' => 9, 'name' => 'Elástico 2cm', 'code' => 'ELA-001', 'type' => 'insumo', 'description' => 'Elástico chato', 'price' => 2.50, 'stock' => 300],
        ['id' => 10, 'name' => 'Forro Acetato', 'code' => 'FOR-001', 'type' => 'insumo', 'description' => 'Forro liso', 'price' => 12.90, 'stock' => 120],
        ['id' => 11, 'name' => 'Saia Midi', 'code' => 'SAI-001', 'type' => 'final', 'description' => 'Saia midi plissada', 'price' => 99.90, 'stock' => 40],
        ['id' => 12, 'name' => 'Bermuda Tactel', 'code' => 'BER-001', 'type' => 'final', 'description' => 'Bermuda esportiva', 'price' => 79.90, 'stock' => 35],
    ];
    ?>

    <div class="h-full flex flex-col bg-gray-50">
        <!-- Header com Menu -->
        <header class="bg-white shadow-md">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-4">
                    <!-- Logo -->
                    <h1 class="text-3xl font-bold text-indigo-600" style="font-family: 'Times New Roman', serif;">
                        Sewfy
                    </h1>

                    <!-- Menu de Navegação -->
                    <nav class="flex space-x-8">
                        <button
                            onclick="showSection('produtos')"
                            id="btn-produtos"
                            class="px-4 py-2 rounded-lg font-medium transition bg-indigo-600 text-white"
                        >
                            Produtos
                        </button>
                        <button
                            onclick="showSection('fornecedores')"
                            id="btn-fornecedores"
                            class="px-4 py-2 rounded-lg font-medium transition text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                            Fornecedores
                        </button>
                        <button
                            onclick="showSection('ordem-producao')"
                            id="btn-ordem-producao"
                            class="px-4 py-2 rounded-lg font-medium transition text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                            Ordem de Produção
                        </button>
                        <button
                            onclick="showSection('contas-pagar')"
                            id="btn-contas-pagar"
                            class="px-4 py-2 rounded-lg font-medium transition text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                            Contas a Pagar
                        </button>
                    </nav>

                    <!-- Botão de Logout -->
                    <a
                        href="index.php"
                        class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition"
                    >
                        Sair
                    </a>
                </div>
            </div>
        </header>

        <!-- Conteúdo Principal -->
        <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Produtos -->
            <div id="section-produtos">
                <!-- Cabeçalho da Seção -->
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-3xl font-semibold text-gray-800">Produtos</h2>
                    <button
                        onclick="openNewProductModal()"
                        class="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-md"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Novo Produto
                    </button>
                </div>

                <!-- Barra de Pesquisa e Filtros -->
                <div class="bg-white rounded-lg shadow-md p-4 mb-6 flex gap-4 items-center">
                    <div class="flex-1 relative">
                        <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                            type="text"
                            id="searchInput"
                            onkeyup="filterProducts()"
                            class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Pesquisar por nome ou código..."
                        />
                    </div>
                    
                    <div class="flex items-center gap-2">
                        <svg class="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                        </svg>
                        <select
                            id="filterType"
                            onchange="filterProducts()"
                            class="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="todos">Todos os tipos</option>
                            <option value="insumo">Insumos</option>
                            <option value="final">Produtos Finais</option>
                        </select>
                    </div>
                </div>

                <!-- Lista de Produtos -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden">
                    <table class="w-full">
                        <thead class="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Código</th>
                                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nome</th>
                                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tipo</th>
                                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Descrição</th>
                                <th class="px-6 py-4 text-right text-sm font-semibold text-gray-700">Preço</th>
                                <th class="px-6 py-4 text-right text-sm font-semibold text-gray-700">Estoque</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200" id="productsTable">
                            <?php foreach ($products as $product): ?>
                            <tr class="hover:bg-gray-50 transition product-row" 
                                data-name="<?php echo strtolower($product['name']); ?>" 
                                data-code="<?php echo strtolower($product['code']); ?>"
                                data-type="<?php echo $product['type']; ?>">
                                <td class="px-6 py-4 text-sm font-medium text-gray-900"><?php echo $product['code']; ?></td>
                                <td class="px-6 py-4 text-sm text-gray-900"><?php echo $product['name']; ?></td>
                                <td class="px-6 py-4">
                                    <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full <?php echo $product['type'] === 'insumo' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'; ?>">
                                        <?php echo $product['type'] === 'insumo' ? 'Insumo' : 'Produto Final'; ?>
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600"><?php echo $product['description'] ?: '-'; ?></td>
                                <td class="px-6 py-4 text-sm text-gray-900 text-right">R$ <?php echo number_format($product['price'], 2, ',', '.'); ?></td>
                                <td class="px-6 py-4 text-sm text-gray-900 text-right"><?php echo $product['stock']; ?></td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                    
                    <div id="noResults" class="text-center py-12 text-gray-500 hidden">
                        Nenhum produto encontrado
                    </div>
                </div>
            </div>
            
            <!-- Fornecedores -->
            <div id="section-fornecedores" class="hidden">
                <div class="bg-white rounded-lg shadow-md p-8">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Fornecedores</h2>
                    <p class="text-gray-600">Gerencie seus fornecedores aqui.</p>
                </div>
            </div>
            
            <!-- Ordem de Produção -->
            <div id="section-ordem-producao" class="hidden">
                <div class="bg-white rounded-lg shadow-md p-8">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Ordem de Produção</h2>
                    <p class="text-gray-600">Gerencie suas ordens de produção aqui.</p>
                </div>
            </div>
            
            <!-- Contas a Pagar -->
            <div id="section-contas-pagar" class="hidden">
                <div class="bg-white rounded-lg shadow-md p-8">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Contas a Pagar</h2>
                    <p class="text-gray-600">Gerencie suas contas a pagar aqui.</p>
                </div>
            </div>
        </main>
    </div>

    <!-- Modal de Novo Produto -->
    <div id="newProductModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <!-- Header do Modal -->
            <div class="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
                <h2 class="text-2xl font-semibold text-gray-800">Cadastrar Novo Produto</h2>
                <button onclick="closeNewProductModal()" class="text-gray-400 hover:text-gray-600 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            <!-- Formulário -->
            <form id="newProductForm" class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Nome do Produto -->
                    <div class="md:col-span-2">
                        <label for="product-name" class="block text-sm font-medium text-gray-700 mb-2">
                            Nome do Produto *
                        </label>
                        <input
                            id="product-name"
                            type="text"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Ex: Tecido Algodão Premium"
                            required
                        />
                    </div>

                    <!-- Código -->
                    <div>
                        <label for="product-code" class="block text-sm font-medium text-gray-700 mb-2">
                            Código do Produto *
                        </label>
                        <input
                            id="product-code"
                            type="text"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Ex: TEC-001"
                            required
                        />
                    </div>

                    <!-- Tipo -->
                    <div>
                        <label for="product-type" class="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Produto *
                        </label>
                        <select
                            id="product-type"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="insumo">Insumo</option>
                            <option value="final">Produto Final</option>
                        </select>
                    </div>

                    <!-- Descrição -->
                    <div class="md:col-span-2">
                        <label for="product-description" class="block text-sm font-medium text-gray-700 mb-2">
                            Descrição
                        </label>
                        <textarea
                            id="product-description"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Descreva as características do produto..."
                            rows="3"
                        ></textarea>
                    </div>

                    <!-- Preço -->
                    <div>
                        <label for="product-price" class="block text-sm font-medium text-gray-700 mb-2">
                            Preço (R$)
                        </label>
                        <input
                            id="product-price"
                            type="number"
                            step="0.01"
                            min="0"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="0.00"
                        />
                    </div>

                    <!-- Estoque -->
                    <div>
                        <label for="product-stock" class="block text-sm font-medium text-gray-700 mb-2">
                            Quantidade em Estoque
                        </label>
                        <input
                            id="product-stock"
                            type="number"
                            min="0"
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="0"
                        />
                    </div>
                </div>

                <!-- Botões de Ação -->
                <div class="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onclick="closeNewProductModal()"
                        class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        class="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-md"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Cadastrar Produto
                    </button>
                </div>
            </form>
        </div>
    </div>

    <script>
        // Alternar seções
        function showSection(section) {
            // Esconder todas as seções
            document.getElementById('section-produtos').classList.add('hidden');
            document.getElementById('section-fornecedores').classList.add('hidden');
            document.getElementById('section-ordem-producao').classList.add('hidden');
            document.getElementById('section-contas-pagar').classList.add('hidden');
            
            // Remover estilo ativo de todos os botões
            const buttons = ['btn-produtos', 'btn-fornecedores', 'btn-ordem-producao', 'btn-contas-pagar'];
            buttons.forEach(btnId => {
                document.getElementById(btnId).className = 'px-4 py-2 rounded-lg font-medium transition text-gray-700 hover:bg-indigo-50 hover:text-indigo-600';
            });
            
            // Mostrar seção selecionada
            document.getElementById('section-' + section).classList.remove('hidden');
            
            // Adicionar estilo ativo ao botão selecionado
            document.getElementById('btn-' + section).className = 'px-4 py-2 rounded-lg font-medium transition bg-indigo-600 text-white';
        }

        // Filtrar produtos
        function filterProducts() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const filterType = document.getElementById('filterType').value;
            const rows = document.querySelectorAll('.product-row');
            let visibleCount = 0;

            rows.forEach(row => {
                const name = row.getAttribute('data-name');
                const code = row.getAttribute('data-code');
                const type = row.getAttribute('data-type');

                const matchesSearch = name.includes(searchTerm) || code.includes(searchTerm);
                const matchesFilter = filterType === 'todos' || type === filterType;

                if (matchesSearch && matchesFilter) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });

            // Mostrar/esconder mensagem de "nenhum resultado"
            const noResults = document.getElementById('noResults');
            if (visibleCount === 0) {
                noResults.classList.remove('hidden');
            } else {
                noResults.classList.add('hidden');
            }
        }

        // Abrir modal de novo produto
        function openNewProductModal() {
            document.getElementById('newProductModal').classList.remove('hidden');
        }

        // Fechar modal de novo produto
        function closeNewProductModal() {
            document.getElementById('newProductModal').classList.add('hidden');
            document.getElementById('newProductForm').reset();
        }

        // Adicionar novo produto
        document.getElementById('newProductForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('product-name').value;
            const code = document.getElementById('product-code').value;
            const type = document.getElementById('product-type').value;
            const description = document.getElementById('product-description').value;
            const price = parseFloat(document.getElementById('product-price').value) || 0;
            const stock = parseInt(document.getElementById('product-stock').value) || 0;

            // Criar nova linha na tabela
            const tbody = document.getElementById('productsTable');
            const newRow = document.createElement('tr');
            newRow.className = 'hover:bg-gray-50 transition product-row';
            newRow.setAttribute('data-name', name.toLowerCase());
            newRow.setAttribute('data-code', code.toLowerCase());
            newRow.setAttribute('data-type', type);

            const typeLabel = type === 'insumo' ? 'Insumo' : 'Produto Final';
            const typeClass = type === 'insumo' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';

            newRow.innerHTML = `
                <td class="px-6 py-4 text-sm font-medium text-gray-900">${code}</td>
                <td class="px-6 py-4 text-sm text-gray-900">${name}</td>
                <td class="px-6 py-4">
                    <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full ${typeClass}">
                        ${typeLabel}
                    </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">${description || '-'}</td>
                <td class="px-6 py-4 text-sm text-gray-900 text-right">R$ ${price.toFixed(2).replace('.', ',')}</td>
                <td class="px-6 py-4 text-sm text-gray-900 text-right">${stock}</td>
            `;

            tbody.appendChild(newRow);
            closeNewProductModal();
        });
    </script>
</body>
</html>
