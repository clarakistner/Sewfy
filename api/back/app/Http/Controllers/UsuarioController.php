<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UsuarioController extends Controller
{
    public function retornaFuncionario(int $id)
    {

        $funcionario = User::where('USU_ID', $id)
            ->select('USU_NOME', 'USU_ATIV', 'USU_EMAIL', 'USU_NUM')
            ->first();

        return response()->json(['funcionario' => $funcionario]);
    }

    public function editarFuncionario(Request $request, int $id)
    {
        $request->validate([
            "telefone" => "required|string|min:11|max:11",
            "ativo" => "required|integer|in:0,1"
        ]);
        User::where('USU_ID', $id)->update([
            'USU_NUM'  => $request->telefone,
            'USU_ATIV' => $request->ativo,
        ]);
        return response()->json("Funcionário atualizado com sucesso!");
    }
}
