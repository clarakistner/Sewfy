<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\EmpresaUsuarios;
use App\Models\SewfyAdm;
use App\Models\UsuarioModulos;
use App\Models\Modulo;
use Psy\Command\WhereamiCommand;

class EmpresaUsuariosController extends Controller
{
    // GET /api/empresa/usuario/proprietario - Verificar se o usuário é proprietário da empresa atual
    public function usuarioEhProprietario(Request $request)
    {
        $user = $request->user();

        // Se for adm impersonando, sempre é proprietário
        if ($user instanceof SewfyAdm) {
            return response()->json(['proprietario' => true]);
        }

        // Fluxo normal do usuário
        $abilities = $user->currentAccessToken()->abilities;
        $ability   = collect($abilities)->first(fn($a) => str_starts_with($a, 'empresa_'));
        $empresaId = str_replace('empresa_', '', $ability);
        $userId    = $user->USU_ID;

        $empresaUsuario = EmpresaUsuarios::where('EMP_ID', $empresaId)
            ->where('USU_ID', $userId)
            ->first();

        if (!$empresaUsuario) {
            return response()->json(['erro' => 'Vínculo não encontrado'], 404);
        }

        if ($empresaUsuario->USU_ATIV === 0) {
            return response()->json(['erro' => 'Usuário inativo na empresa'], 403);
        }

        $ehProprietario = $empresaUsuario->USU_E_PROPRIETARIO === 1;
        return response()->json(['proprietario' => $ehProprietario]);
    }


    // GET /api/empresa/usuario/funcionarios - Listar funcionários da empresa atual (excluindo o próprio usuário)
    public function buscaFuncionariosEmpresa(Request $request)
    {
        $user = $request->user();
        $abilities = $user->currentAccessToken()->abilities;
        $ability   = collect($abilities)->first(fn($a) => str_starts_with($a, 'empresa_'));
        $empresaId = str_replace('empresa_', '', $ability);

        $listaFuncionarios = User::whereIn(
            'USU_ID',
            EmpresaUsuarios::where('EMP_ID', $empresaId)
                ->where('USU_ID', '!=', $user->USU_ID)
                ->pluck('USU_ID')
        )->select('USU_NOME', 'USU_EMAIL', 'USU_NUM', 'USU_ATIV', 'USU_ID')
            ->get();

        return response()->json([
            'funcionarios' => $listaFuncionarios,
        ]);
    }

    // GET /api/empresa/usuario/{id} - Detalhes de um funcionário específico da empresa atual
    public function buscaFuncionario(Request $request, $id)
    {
        $user = $request->user();
        $abilities = $user->currentAccessToken()->abilities;
        $ability   = collect($abilities)->first(fn($a) => str_starts_with($a, 'empresa_'));
        $empresaId = str_replace('empresa_', '', $ability);

        $vinculo = EmpresaUsuarios::where('EMP_ID', $empresaId)
            ->where('USU_ID', $id)
            ->first();

        if (!$vinculo) {
            return response()->json(['erro' => 'Funcionário não encontrado'], 404);
        }

        $funcionario = User::where('USU_ID', $id)
            ->select('USU_ID', 'USU_NOME', 'USU_EMAIL', 'USU_NUM', 'USU_ATIV')
            ->first();

        $modulos = UsuarioModulos::where('USU_ID', $id)
            ->where('EMP_ID', $empresaId)
            ->pluck('MOD_ID')
            ->map(fn($modId) => strtolower(Modulo::find($modId)?->MOD_NOME ?? ''))
            ->filter()
            ->values();

        return response()->json([
            'nome'     => $funcionario->USU_NOME,
            'email'    => $funcionario->USU_EMAIL,
            'telefone' => $funcionario->USU_NUM,
            'ativo'    => $funcionario->USU_ATIV === 1,
            'modulos'  => $modulos,
        ]);
    }

    // PUT /api/empresa/usuario/{id} - Atualizar dados de um funcionário específico da empresa atual
    public function atualizarFuncionario(Request $request, $id)
    {
        $user = $request->user();
        $abilities = $user->currentAccessToken()->abilities;
        $ability   = collect($abilities)->first(fn($a) => str_starts_with($a, 'empresa_'));
        $empresaId = str_replace('empresa_', '', $ability);

        $vinculo = EmpresaUsuarios::where('EMP_ID', $empresaId)
            ->where('USU_ID', $id)
            ->first();

        if (!$vinculo) {
            return response()->json(['erro' => 'Funcionário não encontrado'], 404);
        }

        $request->validate([
            'nome'     => 'required|string|min:4|max:45',
            'email'    => 'required|email',
            'telefone' => 'required|string|min:10|max:11',
            'ativo'    => 'required|boolean',
            'modulos'  => 'array',
        ]);

        User::where('USU_ID', $id)->update([
            'USU_NOME'  => $request->nome,
            'USU_EMAIL' => $request->email,
            'USU_NUM'   => $request->telefone,
            'USU_ATIV'  => $request->ativo ? 1 : 0,
        ]);

        $vinculo->USU_ATIV = $request->ativo ? 1 : 0;
        $vinculo->save();

        // remove módulos antigos e insere os novos
        UsuarioModulos::where('USU_ID', $id)->where('EMP_ID', $empresaId)->delete();

        foreach ($request->modulos ?? [] as $nomeModulo) {
            $modulo = Modulo::whereRaw('LOWER(MOD_NOME) = ?', [strtolower($nomeModulo)])->first();
            if ($modulo) {
                UsuarioModulos::create([
                    'USU_ID'        => $id,
                    'EMP_ID'        => $empresaId,
                    'MOD_ID'        => $modulo->MOD_ID,
                    'CONCEDIDO_POR' => $user->USU_ID,
                ]);
            }
        }

        return response()->json(['mensagem' => 'Funcionário atualizado com sucesso']);
    }

    public function getEmpresasUsuario(Request $request)
    {
        
        $user = $request->user();
        if (!$user) {
            return response()->json(['erro' => 'Usuário não autenticado'], 401);
        }
      

        $idEmpresas = EmpresaUsuarios::where('USU_ID', $user->USU_ID)
            ->pluck('EMP_ID');

        $empresas = Empresa::whereIn('EMP_ID', $idEmpresas)
            ->where('EMP_ATIV', 1)
            ->pluck('EMP_RAZ', 'EMP_ID')
            ->toArray();

        return response()->json(['empresas' => $empresas]);
    }
}
