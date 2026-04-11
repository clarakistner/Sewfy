<?php

namespace App\Http\Controllers\Contas;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ContaPagar;
use App\Models\OPInsumo;
use App\Models\OrdemDeProducao;
use App\Models\Produto;

class ContaPagarController extends Controller
{
    // Função para extrair o ID da empresa a partir das abilities do token de acesso do usuário
    private function getEmpresaId(Request $request): string
    {
        $abilities = $request->user()->currentAccessToken()->abilities;
        $ability   = collect($abilities)->first(fn($a) => str_starts_with($a, 'empresa_'));

        if (!$ability) {
            abort(403, 'Token sem empresa associada');
        }

        return str_replace('empresa_', '', $ability);
    }

    // LISTAR TODAS
    public function listarContas(Request $request)
    {
        $empId = $this->getEmpresaId($request);

        $query = ContaPagar::with(['clifor', 'ordemProducao'])
            ->where('EMP_ID', $empId);

        // Filtro por status (pendente / pago)
        if ($request->filled('status') && $request->status !== 'todas') {
            $query->where('CP_STATUS', strtolower($request->status));
        }

        // Filtro por termo (nome do fornecedor ou código da OP)
        if ($request->filled('termo')) {
            $termo = $request->termo;
            $query->where(function ($q) use ($termo) {
                $q->whereHas('clifor', function ($q2) use ($termo) {
                    $q2->where('CLIFOR_NOME', 'ilike', "%{$termo}%");
                })
                ->orWhere('OP_ID', 'ilike', "%{$termo}%");
            });
        }

        // Filtro por intervalo de data de vencimento
        if ($request->filled('data_inicial')) {
            $query->where('CP_DATAV', '>=', $request->data_inicial);
        }
        if ($request->filled('data_final')) {
            $query->where('CP_DATAV', '<=', $request->data_final);
        }

        // Filtro por intervalo de valor
        if ($request->filled('valor_min')) {
            $query->where('CP_VALOR', '>=', $request->valor_min);
        }
        if ($request->filled('valor_max')) {
            $query->where('CP_VALOR', '<=', $request->valor_max);
        }

        $contas = $query->orderBy('CP_DATAV', 'asc')->get();

       return response()->json($contas->map(function ($conta) {
    $idProd = OPInsumo::where('OPIN_ID', $conta->OPIN_ID)
        ->value('PROD_ID');

    $servico = Produto::where('PROD_ID', $idProd)
        ->value('PROD_NOME');

    return [
        'id'         => $conta->CP_ID,
        'status'     => $conta->CP_STATUS,
        'fornecedor' => $conta->clifor->CLIFOR_NOME ?? '—',
        'telefone'   => $conta->clifor->CLIFOR_NUM  ?? '',
        'op_id'      => $conta->OP_ID,
        'servico'    => $servico,
        'valor'      => $conta->CP_VALOR,
        'vencimento' => $conta->CP_DATAV,
        'emissao'    => $conta->CP_DATAE,
        'pagamento'  => $conta->CP_DATAP,
    ];
}));
    }

    // BUSCAR POR ID - Detalhes de uma conta a pagar específica
    public function mostrarConta(Request $request, $id)
    {
        $empId = $this->getEmpresaId($request);

        $conta = ContaPagar::with(['clifor', 'ordemProducao'])
            ->where('CP_ID', $id)
            ->where('EMP_ID', $empId)
            ->first();

        if (!$conta) {
            return response()->json(['erro' => 'Conta não encontrada'], 404);
        }

        return response()->json([
            'id'         => $conta->CP_ID,
            'status'     => $conta->CP_STATUS,
            'fornecedor' => $conta->clifor->CLIFOR_NOME    ?? '—',
            'telefone'   => $conta->clifor->CLIFOR_NUM     ?? '—',   
            'op_id'      => $conta->OP_ID,
            'valor'      => $conta->CP_VALOR,
            'vencimento' => $conta->CP_DATAV,
            'emissao'    => $conta->CP_DATAE,
            'pagamento'  => $conta->CP_DATAP,
        ]);
    }
}