<?php

namespace App\Jobs;

use App\Models\ContaPagar;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GerarParcelasRecorrentes implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        // Busca todas as contas com ocorrência que ainda têm parcelas a gerar
        // e cujo vencimento já chegou (scheduler roda diariamente)
        $contas = ContaPagar::whereNotNull('CP_OCORRENCIA')
            ->whereNotNull('CP_GRUPO_ID')
            ->whereNotNull('CP_PARCELA_NUM')
            ->whereNotNull('CP_PARCELA_TOT')
            ->whereColumn('CP_PARCELA_NUM', '<', 'CP_PARCELA_TOT')
            ->where('CP_DATAV', '<=', now()->toDateString())
            ->get();

        foreach ($contas as $conta) {
            // Verifica se a próxima parcela já foi gerada
            $proximaNumero = $conta->CP_PARCELA_NUM + 1;
            $jaExiste = ContaPagar::where('CP_GRUPO_ID', $conta->CP_GRUPO_ID)
                ->where('CP_PARCELA_NUM', $proximaNumero)
                ->exists();

            if ($jaExiste) continue;

            // Calcula a próxima data de vencimento
            $proximaDataV = $this->calcularProximaData($conta->CP_DATAV, $conta->CP_OCORRENCIA);

            // Gera o status automaticamente
            $status = now()->toDateString() > $proximaDataV ? 'atrasada' : 'pendente';

            // Gera o próximo CP_ID sequencial
            $last       = ContaPagar::lockForUpdate()
                ->orderByRaw('"CP_ID" DESC')
                ->value('CP_ID');
            $lastNumber = (int) substr($last ?? '0', strrpos($last ?? '0', '-') + 1);
            $sequencial = str_pad($lastNumber + 1, 6, '0', STR_PAD_LEFT);
            $cpId       = 'CPAVU-' . $sequencial;

            ContaPagar::create([
                'CP_ID'          => $cpId,
                'EMP_ID'         => $conta->EMP_ID,
                'CLIFOR_ID'      => $conta->CLIFOR_ID,
                'CP_VALOR'       => $conta->CP_VALOR,
                'CP_DATAE'       => now()->toDateString(),
                'CP_DATAV'       => $proximaDataV,
                'CP_DATAP'       => null,
                'CP_STATUS'      => $status,
                'CP_HISTORICO'   => $conta->CP_HISTORICO,
                'CP_OCORRENCIA'  => $conta->CP_OCORRENCIA,
                'CP_GRUPO_ID'    => $conta->CP_GRUPO_ID,
                'CP_PARCELA_NUM' => $proximaNumero,
                'CP_PARCELA_TOT' => $conta->CP_PARCELA_TOT,
                'USU_ID'         => $conta->USU_ID,
                'OP_ID'          => null,
                'OPIN_ID'        => null,
            ]);
        }
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
}