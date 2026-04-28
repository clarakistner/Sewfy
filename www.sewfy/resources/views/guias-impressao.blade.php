<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Guias de Produção</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: Arial, Helvetica, sans-serif;
            background: #f3f4f6;
            color: #111827;
            cursor: default;
        }

        .folha {
            width: 297mm;
            height: 210mm;
            margin: 0 auto 24px;
            background: #fff;
            display: flex;
            flex-direction: row;
            align-items: stretch;
            padding: 8mm 10mm;
            gap: 0;
            box-shadow: 0 2px 12px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .folha-coluna {
            flex: 1;
            display: flex;
            flex-direction: column;
            min-width: 0;
        }

        .linha-corte-vertical {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 20px;
            flex-shrink: 0;
            color: #9ca3af;
            font-size: 14px;
            border-left: 1px dashed #d1d5db;
            border-right: 1px dashed #d1d5db;
            margin: 0 6px;
        }

        .guia-impressao {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .guia-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(90deg, #0e59fe, #020066);
            padding: 8px 14px;
            border-radius: 8px;
        }

        .guia-logo {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #fff;
        }

        .guia-logo-sewfy {
            font-size: 16px;
            font-weight: 700;
            letter-spacing: 0.5px;
        }

        .guia-logo-separador {
            font-size: 16px;
            opacity: 0.5;
        }

        .guia-logo-empresa {
            font-size: 13px;
            font-weight: 500;
            opacity: 0.9;
        }

        .guia-op-badge {
            background: rgba(255,255,255,0.2);
            color: #fff;
            padding: 3px 10px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.5px;
        }

        .guia-info-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 6px;
        }

        .guia-campo {
            display: flex;
            flex-direction: column;
            gap: 2px;
            background: #f9fafb;
            border-radius: 6px;
            padding: 6px 10px;
            border: 1px solid #e5e7eb;
        }

        .guia-label {
            font-size: 9px;
            color: #6b7280;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.4px;
        }

        .guia-valor {
            font-size: 11px;
            font-weight: 600;
            color: #111827;
        }

        .guia-insumo-id {
            font-size: 10px;
            color: #6b7280;
            font-weight: 400;
        }

        .guia-valor-branco {
            color: #d1d5db;
        }

        /* ── TABELA ── */
        .guia-tabela {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            overflow: hidden;
            flex: 1;
        }

        .guia-tabela thead tr {
            background: linear-gradient(90deg, #0e59fe, #020066);
            color: #fff;
        }

        .guia-tabela th {
            padding: 7px 10px;
            font-size: 11px;
            font-weight: 700;
            text-align: center;
            letter-spacing: 0.6px;
            text-transform: uppercase;
            border-right: 1px solid rgba(255, 255, 255, 0.2);
        }

        .guia-tabela th:last-child {
            border-right: none;
        }

        .guia-tabela td {
            padding: 4px 10px;
            font-size: 11px;
            color: #111827;
            border-top: 1px solid #e5e7eb;
            border-right: 1px solid #e5e7eb;
            height: 18px;
        }

        .guia-tabela td:last-child {
            border-right: none;
        }

        .guia-tabela-tamanho {
            color: #6b7280;
            font-weight: 600;
            width: 60px;
        }

        .guia-tabela-total {
            background: #f9fafb;
        }

        .guia-tabela-total td {
            border-top: 2px solid #e5e7eb;
            padding: 6px 10px;
        }

        .guia-rodape {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
            border-top: 1px solid #e5e7eb;
            padding-top: 8px;
        }

        .guia-campo-valor {
            display: flex;
            flex-direction: column;
            gap: 3px;
            background: #f9fafb;
            border-radius: 6px;
            padding: 6px 12px;
            border: 1px solid #e5e7eb;
            min-width: 100px;
            text-align: center;
        }

        .guia-valor-destaque {
            font-size: 13px;
            font-weight: 700;
            color: #111827;
        }

        @page { size: A4 landscape; margin: 0; }

        @media print {
            body { background: #fff; }

            .folha {
                width: 297mm;
                height: 210mm;
                margin: 0;
                padding: 8mm 10mm;
                box-shadow: none;
                page-break-after: always;
            }

            .folha:last-child {
                page-break-after: avoid;
            }
        }
    </style>
</head>
<body>

    @foreach ($guias as $guia)

    @php
        $colunas = ['empresa', 'fornecedor'];
    @endphp

    <div class="folha">
        @foreach ($colunas as $coluna)

        <div class="folha-coluna">
            <div class="guia-impressao">
                <div class="guia-header">
                    <div class="guia-logo">
                        <span class="guia-logo-sewfy">Sewfy</span>
                        <span class="guia-logo-separador">|</span>
                        <span class="guia-logo-empresa">{{ $guia['empresa_nome'] }}</span>
                    </div>
                    <div class="guia-op-badge">{{ $guia['op_id'] }}</div>
                </div>

                <div class="guia-info-grid">
                    <div class="guia-campo">
                        <span class="guia-label">Fornecedor</span>
                        <span class="guia-valor">{{ $guia['fornecedor_nome'] }}</span>
                    </div>
                    <div class="guia-campo">
                        <span class="guia-label">Serviço</span>
                        <span class="guia-valor">{{ $guia['insumo_nome'] }} <span class="guia-insumo-id">#{{ $guia['insumo_id'] }}</span></span>
                    </div>
                    <div class="guia-campo">
                        <span class="guia-label">Referência</span>
                        <span class="guia-valor">{{ $guia['produto_cod'] ?: '—' }}</span>
                    </div>
                    <div class="guia-campo">
                        <span class="guia-label">Modelo</span>
                        <span class="guia-valor">{{ $guia['produto_nome'] }}</span>
                    </div>
                    <div class="guia-campo">
                        <span class="guia-label">Cor</span>
                        <span class="guia-valor">—</span>
                    </div>
                    <div class="guia-campo">
                        <span class="guia-label">Data entrega</span>
                        <span class="guia-valor guia-valor-branco">____________</span>
                    </div>
                    <div class="guia-campo">
                        <span class="guia-label">Data retirada</span>
                        <span class="guia-valor guia-valor-branco">____________</span>
                    </div>
                </div>

                <table class="guia-tabela">
                    <thead>
                        <tr>
                            <th>Tamanho</th>
                            <th>Quantidade</th>
                            <th>Conf. Facção</th>
                            <th>Conf. Empresa</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ([2, 4, 6, 8, 10, 12, 14, 16] as $tam)
                        <tr>
                            <td class="guia-tabela-tamanho">{{ $tam }}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        @endforeach
                        <tr class="guia-tabela-total">
                            <td><strong>Total</strong></td>
                            <td><strong>{{ number_format($guia['insumo_qtd'], 0, ',', '.') }} {{ $guia['insumo_um'] }}</strong></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                <div class="guia-rodape">
                    <div class="guia-campo-valor">
                        <span class="guia-label">R$ Peça</span>
                        <span class="guia-valor-destaque">R$ {{ number_format($guia['custo_unitario'], 2, ',', '.') }}</span>
                    </div>
                    <div class="guia-campo-valor">
                        <span class="guia-label">Valor Estimado</span>
                        <span class="guia-valor-destaque">R$ {{ number_format($guia['custo_estimado'], 2, ',', '.') }}</span>
                    </div>
                    <div class="guia-campo-valor">
                        <span class="guia-label">Valor Real</span>
                        <span class="guia-valor-destaque guia-valor-branco">R$ ___________</span>
                    </div>
                </div>
            </div>
        </div>

        @if ($loop->first)
        <div class="linha-corte-vertical">✂</div>
        @endif

        @endforeach
    </div>
    @endforeach

    <script>
        var jaImprimiu = false;
        setTimeout(function() {
            if (!jaImprimiu) {
                jaImprimiu = true;
                window.print();
            }
        }, 1000);
    </script>
</body>
</html>