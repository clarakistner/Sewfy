<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SewfyAdm;
class SewfyAdmController extends Controller
{
    public function index()
    {
        $adm = SewfyAdm::all()->map(function($a) {
            return [
                'id'    => $a->ADM_ID,
                'nome'  => $a->ADM_NOME,
                'email' => $a->ADM_EMAIL
            ];
        });

        return response()->json($adm);
    }

    /*
    public function store(Request $request)
    {
        $request->validate([
            'ADM_SENHA'  => 'required|string|min:8|max:150',
            'ADM_EMAIL' => 'required|email|max:150'
        ]);

        $adm = SewfyAdm::create([
            'ADM_EMAIL' => trim($request->ADM_EMAIL),
            'ADM_SENHA' => bcrypt($request->ADM_SENHA),
            'ADM_ATIV'  => 1,
            'ADM_DATAC' => now()
        ]);

        return response()->json(['message' => 'Administrador criado com sucesso', 'id' => $adm->ADM_ID], 201);
    }
    */
    
}
