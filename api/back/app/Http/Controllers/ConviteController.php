<?php

namespace App\Http\Controllers;

use App\Models\Convite;
use App\Mail\ConviteEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;

class ConviteController extends Controller
{
    public function index(int $idEmp)
    {
        $convites = Convite::where('EMP_ID', $idEmp)->get();
        return response()->json($convites);
    }

    public function store(Request $request)
    {
        $request->validate([
            'emp_id' => 'required|integer',
            'email'  => 'required|email',
        ]);

        $convite = Convite::create([
            'EMP_ID'        => $request->emp_id,
            'CONV_EMAIL'    => $request->email,
            'CONV_TOKEN'    => Str::random(64),
            'CONV_EXPIRA'   => Carbon::now()->addHours(24),
            'CONV_USADO'    => 0,
            'CONVIDADO_POR' => auth()->id(),
        ]);
        
        Mail::to($convite->CONV_EMAIL)->send(new ConviteEmail($convite));

        return response()->json(['mensagem' => 'Convite enviado com sucesso!']);
    }

    public function validar(string $token)
    {
        $convite = Convite::where('CONV_TOKEN', $token)
                          ->where('CONV_USADO', 0)
                          ->where('CONV_EXPIRA', '>', Carbon::now())
                          ->first();

        if (!$convite) {
            return response()->json(['erro' => 'Convite inválido ou expirado'], 401);
        }

        $convite->update(['CONV_USADO' => 1]);

        return response()->json(['mensagem' => 'Convite aceito com sucesso!']);
    }

    public function show(int $idConvite, int $idEmp)
    {
        $convite = Convite::where('CONV_ID', $idConvite)
                          ->where('EMP_ID', $idEmp)
                          ->firstOrFail();

        return response()->json($convite);
    }
}