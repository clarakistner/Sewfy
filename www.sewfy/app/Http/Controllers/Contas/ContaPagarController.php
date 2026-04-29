<?php

namespace App\Http\Controllers\Contas;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ContaPagar;
use App\Models\OPInsumo;
use App\Models\Produto;
use Carbon\Carbon;

class ContaPagarController extends Controller
{
    private function getEmpresaId(Request $request): string
    {
        return (string) $request->empresa->EMP_ID;
    }

    private function recalcularStatus(string $empId): void
    {
        ContaPagar::where('EMP_ID', $empId)
            ->where('CP_STATUS', 'pendente')
            ->where('CP_DATAV', '<', now()->toDateString())
            ->update(['CP_STATUS' => 'atrasada']);
    }

    private function gerarCpId(?string $opId): string
    {
        $last       = ContaPagar::lockForUpdate()
            ->orderByRaw('"CP_ID" DESC')
            ->value('CP_ID');
        $lastNumber = (int) substr($last ?? '0', strrpos($last ?? '0', '-') + 1);
        $sequencial = str_pad($lastNumber + 1, 6, '0', STR_PAD_LEFT);

        if ($opId) {
            $idOPNumero = preg_replace('/\D/', '', $opId);
            return 'CP' . $idOPNumero . '-' . $sequencial;
        }

        return 'CPAVU-' . $sequencial;
    }

    private function calcularProximaData(string $dataAtual, string $ocorrencia): string
    {
        $data = Carbon::parse($dataAtual);

        return match($ocorrencia) {
            'semanal'    => $data->addWeek()->toDateString(),
            'quinzenal'  => $data->addDays(15)->toDateString(),
            'mensal'     => $data->addMonth()->toDateString(),
            'bimestral'  => $data->addMonths(2)->toDateString(),
            'trimestral' => $data->addMonths(3)->toDateString(),
            'semestral'  => $data->addMonths(6)->toDateString(),
            'anual'      => $data->addYear()->toDateString(),
            default      => $data->addMonth()->toDateString(),
        };
    }

    // LISTAR TODAS
    public function listarContas(Request $request)
    {
        $empId = $this->getEmpresaId($request);

        $this->recalcularStatus($empId);

        $query = ContaPagar::with(['clifor', 'ordemProducao'])
            ->where('EMP_ID', $empId);

        if ($request->filled('status') && $request->status !== 'todas') {
            $query->where('CP_STATUS', strtolower($request->status));
        }

        if ($request->filled('termo')) {
            $termo = $request->termo;
            $query->where(function ($q) use ($termo) {
                $q->whereHas('clifor', function ($q2) use ($termo) {
                    $q2->where('CLIFOR_NOME', 'ilike', "%{$termo}%");
                })
                ->orWhere('OP_ID', 'ilike', "%{$termo}%");
            });
        }

        if ($request->filled('data_inicial')) {
            $query->where('CP_DATAV', '>=', $request->data_inicial);
        }
        if ($request->filled('data_final')) {
            $query->where('CP_DATAV', '<=', $request->data_final);
        }

        if ($request->filled('valor_min')) {
            $query->where('CP_VALOR', '>=', $request->valor_min);
        }
        if ($request->filled('valor_max')) {
            $query->where('CP_VALOR', '<=', $request->valor_max);
        }

        $contas = $query->orderBy('CP_DATAV', 'asc')->get();

        return response()->json($contas->map(function ($conta) {
            $idProd  = OPInsumo::where('OPIN_ID', $conta->OPIN_ID)->value('PROD_ID');
            $servico = Produto::where('PROD_ID', $idProd)->value('PROD_NOME');

            return [
                'id'          => $conta->CP_ID,
                'status'      => $conta->CP_STATUS,
                'fornecedor'  => $conta->clifor->CLIFOR_NOME ?? '—',
                'telefone'    => $conta->clifor->CLIFOR_NUM  ?? '',
                'op_id'       => $conta->OP_ID,
                'servico'     => $servico,
                'valor'       => $conta->CP_VALOR,
                'vencimento'  => $conta->CP_DATAV,
                'emissao'     => $conta->CP_DATAE,
                'pagamento'   => $conta->CP_DATAP,
                'historico'   => $conta->CP_HISTORICO,
                'ocorrencia'  => $conta->CP_OCORRENCIA,
                'grupo_id'    => $conta->CP_GRUPO_ID,
                'parcela_num' => $conta->CP_PARCELA_NUM,
                'parcela_tot' => $conta->CP_PARCELA_TOT,
            ];
        }));
    }

    // BUSCAR POR ID
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
            'id'          => $conta->CP_ID,
            'status'      => $conta->CP_STATUS,
            'fornecedor'  => $conta->clifor->CLIFOR_NOME ?? '—',
            'telefone'    => $conta->clifor->CLIFOR_NUM  ?? '—',
            'op_id'       => $conta->OP_ID,
            'valor'       => $conta->CP_VALOR,
            'vencimento'  => $conta->CP_DATAV,
            'emissao'     => $conta->CP_DATAE,
            'pagamento'   => $conta->CP_DATAP,
            'historico'   => $conta->CP_HISTORICO,
            'ocorrencia'  => $conta->CP_OCORRENCIA,
            'grupo_id'    => $conta->CP_GRUPO_ID,
            'parcela_num' => $conta->CP_PARCELA_NUM,
            'parcela_tot' => $conta->CP_PARCELA_TOT,
        ]);
    }

    // CRIAR CONTA
    public function criarConta(Request $request)
    {
        $empId = $this->getEmpresaId($request);
        $user  = $request->user();

        $request->validate([
            'clifor_id'  => 'required|integer',
            'valor'      => 'required|numeric|min:0.01',
            'emissao'    => 'required|date',
            'vencimento' => 'required|date|after_or_equal:emissao',
            'historico'  => 'nullable|string|max:255',
            'ocorrencia' => 'nullable|in:semanal,quinzenal,mensal,bimestral,trimestral,semestral,anual',
            'parcelas'   => 'nullable|integer|min:2|max:360',
            'pagamento'  => 'nullable|date|before_or_equal:' . now()->toDateString(),
        ]);

        $temOcorrencia = $request->filled('ocorrencia') && $request->filled('parcelas');
        $grupoId       = $temOcorrencia ? 'GRP-' . now()->format('YmdHis') . '-' . uniqid() : null;
        $parcelaTot    = $temOcorrencia ? (int) $request->parcelas : null;
        $cpId          = $this->gerarCpId(null);

        if ($request->filled('pagamento')) {
            $status  = 'paga';
            $dataPag = $request->pagamento;
        } else {
            $status  = now()->toDateString() > $request->vencimento ? 'atrasada' : 'pendente';
            $dataPag = null;
        }

        ContaPagar::create([
            'CP_ID'          => $cpId,
            'EMP_ID'         => $empId,
            'CLIFOR_ID'      => $request->clifor_id,
            'CP_VALOR'       => $request->valor,
            'CP_DATAE'       => $request->emissao,
            'CP_DATAV'       => $request->vencimento,
            'CP_DATAP'       => $dataPag,
            'CP_STATUS'      => $status,
            'CP_HISTORICO'   => $request->historico  ?? null,
            'CP_OCORRENCIA'  => $request->ocorrencia ?? null,
            'CP_GRUPO_ID'    => $grupoId,
            'CP_PARCELA_NUM' => $temOcorrencia ? 1 : null,
            'CP_PARCELA_TOT' => $parcelaTot,
            'USU_ID'         => $user->USU_ID,
            'OP_ID'          => null,
            'OPIN_ID'        => null,
        ]);

        return response()->json(['mensagem' => 'Conta cadastrada com sucesso!'], 201);
    }

    // ATUALIZAR CONTA
    public function atualizarConta(Request $request, $id)
    {
        $empId = $this->getEmpresaId($request);

        $conta = ContaPagar::where('CP_ID', $id)
            ->where('EMP_ID', $empId)
            ->first();

        if (!$conta) {
            return response()->json(['erro' => 'Conta não encontrada'], 404);
        }

        if ($conta->CP_STATUS === 'paga') {
            return response()->json(['erro' => 'Conta já paga não pode ser editada'], 422);
        }

        $request->validate([
            'vencimento' => 'nullable|date|after_or_equal:' . $conta->CP_DATAE,
            'pagamento'  => 'nullable|date|after_or_equal:' . $conta->CP_DATAE . '|before_or_equal:' . now()->toDateString(),
            'valor'      => 'nullable|numeric|min:0.01',
            'clifor_id'  => 'nullable|integer',
            'historico'  => 'nullable|string|max:255',
            'modo'       => 'nullable|in:esta,esta_e_futuras',
        ]);

        $modo               = $request->modo ?? 'esta';
        $vencimentoAnterior = $conta->CP_DATAV;

        $conta->CP_DATAV     = $request->vencimento ?? $conta->CP_DATAV;
        $conta->CP_DATAP     = $request->pagamento  ?? null;
        $conta->CP_VALOR     = $request->valor       ?? $conta->CP_VALOR;
        $conta->CLIFOR_ID    = $request->clifor_id   ?? $conta->CLIFOR_ID;
        $conta->CP_HISTORICO = $request->historico   ?? $conta->CP_HISTORICO;

        if ($request->filled('pagamento')) {
            $conta->CP_STATUS = 'paga';
        } elseif (now()->toDateString() > $conta->CP_DATAV) {
            $conta->CP_STATUS = 'atrasada';
        } else {
            $conta->CP_STATUS = 'pendente';
        }

        $conta->save();

        if ($modo === 'esta_e_futuras' && $conta->CP_GRUPO_ID) {
            $parcelas = ContaPagar::where('CP_GRUPO_ID', $conta->CP_GRUPO_ID)
                ->where('CP_PARCELA_NUM', '>', $conta->CP_PARCELA_NUM)
                ->where('CP_STATUS', '!=', 'paga')
                ->where('EMP_ID', $empId)
                ->orderBy('CP_PARCELA_NUM', 'asc')
                ->get();

            $vencimentoMudou = $request->filled('vencimento') &&
                               $request->vencimento !== $vencimentoAnterior;

            $dataBase = $conta->CP_DATAV;

            foreach ($parcelas as $parcela) {
                if ($vencimentoMudou && $conta->CP_OCORRENCIA) {
                    $dataBase = $this->calcularProximaData($dataBase, $conta->CP_OCORRENCIA);
                    $parcela->CP_DATAV = $dataBase;

                    if (now()->toDateString() > $dataBase) {
                        $parcela->CP_STATUS = 'atrasada';
                    } else {
                        $parcela->CP_STATUS = 'pendente';
                    }
                }

                if ($request->filled('valor')) {
                    $parcela->CP_VALOR = $request->valor;
                }

                if ($request->filled('historico')) {
                    $parcela->CP_HISTORICO = $request->historico;
                }

                $parcela->save();
            }
        }

        return response()->json(['mensagem' => 'Conta atualizada com sucesso']);
    }
}