<?php

namespace App\Http\Controllers;

use App\Models\HomeConfig;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HomeConfigController extends Controller
{
    // GET /api/home/config - Retorna a config da home da empresa atual
    public function show(Request $request)
    {
        $empresa   = $request->empresa;
        $empresaId = $empresa->EMP_ID;

        $config = HomeConfig::firstOrCreate(
            ['EMP_ID' => $empresaId],
            [
                'EXIBIR_CONTAS_PAGAR'   => 1,
                'FILTRO_CONTAS_PAGAR'   => 'pendente',
                'EXIBIR_CONTAS_RECEBER' => 1,
                'FILTRO_CONTAS_RECEBER' => 'pendente',
                'EXIBIR_ORDENS'         => 1,
                'FILTRO_ORDENS'         => 'aberta',
            ]
        );

        return response()->json(['config' => $config]);
    }

    // PUT /api/home/config - Atualiza a config da home da empresa atual
    public function update(Request $request)
    {
        $request->validate([
            'EXIBIR_CONTAS_PAGAR'   => 'required|boolean',
            'FILTRO_CONTAS_PAGAR'   => 'required|string|in:pendente,pago,todos',
            'EXIBIR_CONTAS_RECEBER' => 'required|boolean',
            'FILTRO_CONTAS_RECEBER' => 'required|string|in:pendente,pago,todos',
            'EXIBIR_ORDENS'         => 'required|boolean',
            'FILTRO_ORDENS'         => 'required|string|in:aberta,fechada,todas',
        ]);

        $empresa   = $request->empresa;
        $empresaId = $empresa->EMP_ID;

        // Apenas proprietário pode editar — adm Sewfy impersonando pode sempre
        if (!$request->is_adm_impersonating) {
            $eProprietario = DB::table('EMPRESA_USUARIOS')
                ->where('EMP_ID', $empresaId)
                ->where('USU_ID', $request->user()->USU_ID)
                ->where('USU_E_PROPRIETARIO', 1)
                ->exists();

            if (!$eProprietario) {
                return response()->json(['erro' => 'Apenas o proprietário pode editar a home'], 403);
            }
        }

        $config = HomeConfig::updateOrCreate(
            ['EMP_ID' => $empresaId],
            [
                'EXIBIR_CONTAS_PAGAR'   => $request->EXIBIR_CONTAS_PAGAR,
                'FILTRO_CONTAS_PAGAR'   => $request->FILTRO_CONTAS_PAGAR,
                'EXIBIR_CONTAS_RECEBER' => $request->EXIBIR_CONTAS_RECEBER,
                'FILTRO_CONTAS_RECEBER' => $request->FILTRO_CONTAS_RECEBER,
                'EXIBIR_ORDENS'         => $request->EXIBIR_ORDENS,
                'FILTRO_ORDENS'         => $request->FILTRO_ORDENS,
            ]
        );

        return response()->json(['mensagem' => 'Configuração salva com sucesso!', 'config' => $config]);
    }
}