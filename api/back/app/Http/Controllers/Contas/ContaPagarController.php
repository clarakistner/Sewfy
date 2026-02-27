<?php

namespace App\Http\Controllers\Contas;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ContaPagar;
use Illuminate\Auth\Illuminate\Contracts\Auth\Guard;

class ContaPagarController extends Controller
{
    public function mostrarConta(Request $request)
    {
        $request->validate([
            'cp_id' => 'required|integer',
        ]);
        $conta = ContaPagar::where('CP_ID', $request->cp_id)
        ->where('USU_ID', auth()->id())
        ->first();

        if (!$conta) {
            return response()->json(['erro' => 'Conta não encontrada'], 404);
        }
        return response()->json($conta);
    }
    public function listarContas()
    {
        $contas = ContaPagar::where('USU_ID', auth()->id())->get();
        return response()->json($contas);
    }
    public function criarConta(Request $request)
    {
        $request->validate([
            'EMP_ID' => 'required|integer',
            'OP_ID' => 'required|integer',
            'OPIN_ID' => 'required|integer',
            'CLIFOR_ID' => 'required|integer',
            'CP_VALOR' => 'required|numeric',
            'CP_DATAE' => 'required|date',
            'CP_DATAV' => 'required|date',
            'CP_DATAP' => 'nullable|date',
            'CP_STATUS' => 'required|string|max:255',
        ]);

        $conta = ContaPagar::create([
            'EMP_ID' => $request->EMP_ID,
            'OP_ID' => $request->OP_ID,
            'OPIN_ID' => $request->OPIN_ID,
            'CLIFOR_ID' => $request->CLIFOR_ID,
            'CP_VALOR' => $request->CP_VALOR,
            'CP_DATAE' => $request->CP_DATAE,
            'CP_DATAV' => $request->CP_DATAV,
            'CP_DATAP' => $request->CP_DATAP,
            'CP_STATUS' => $request->CP_STATUS,
            'USU_ID' => auth()->id(),
        ]);

        return response()->json($conta, 201);
    }
    public function atualizarDataPagamento(Request $request)
    {
        $request->validate([
            'cp_id' => 'required|integer',
            'cp_datap' => 'required|date',
        ]);

        $conta = ContaPagar::where('CP_ID', $request->cp_id)
        ->where('USU_ID', auth()->id())
        ->first();

        if (!$conta) {
            return response()->json(['erro' => 'Conta não encontrada'], 404);
        }

        $conta->update(['CP_DATAP' => $request->cp_datap]);

        return response()->json($conta);
    }
}
