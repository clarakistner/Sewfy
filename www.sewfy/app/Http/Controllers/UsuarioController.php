<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\EmpresaUsuarios;

class UsuarioController extends Controller
{
    // GET /api/usuario/{id} - Detalhes de um usuário específico
    public function retornaFuncionario(int $id)
    {

        $funcionario = User::where('USU_ID', $id)
            ->select('USU_NOME', 'USU_ATIV', 'USU_EMAIL', 'USU_NUM')
            ->first();

        return response()->json(['funcionario' => $funcionario]);
    }

    // PUT /api/usuario/{id} - Atualizar dados de um funcionário específico
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

    // GET /api/usuario/owner - Retornar dados do proprietário da empresa atual
    public function retornaOwner(Request $request)
    {
        $user = $request->user();
        $abilities = $user->currentAccessToken()->abilities;
        $ability   = collect($abilities)->first(fn($a) => str_starts_with($a, 'empresa_'));
        $empresaId = (int) str_replace('empresa_', '', $ability);

        $owner = User::whereIn('USU_ID', EmpresaUsuarios::where('USU_ID', $user->USU_ID)
            ->where('EMP_ID', $empresaId)->where('USU_E_PROPRIETARIO', 1)->pluck('USU_ID'))->select('USU_NOME', 'USU_ATIV', 'USU_EMAIL', 'USU_NUM')->first();
        return response()->json(['owner'=> $owner]);
    }

    // PUT /api/usuario/owner - Atualizar dados do proprietário da empresa atual
    public function editarOwner(Request $request)
    {
        $request->validate([
            "telefone" => "required|string|min:11|max:11",
            "nome" => "required|string|min:5",
            "email" => "required|string"
        ]);
        User::where('USU_ID', $request->user()->USU_ID)->update([
            'USU_NUM'  => $request->telefone,
            'USU_EMAIL' => $request->email,
            'USU_NOME' => $request->nome
        ]);
        return response()->json("Owner atualizado com sucesso!");
    }
}
