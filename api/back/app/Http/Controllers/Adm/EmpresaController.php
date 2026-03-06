<?php

namespace App\Http\Controllers\Adm;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EmpresaController extends Controller
{
    // GET /api/adm/empresas - Listar todas as empresas
    public function index()
    {
        $empresas = Empresa::with('modulos')->get()->map(function($e) {
            return [
                'id'      => $e->EMP_ID,
                'nome'    => $e->EMP_NOME,
                'raz'     => $e->EMP_RAZ,
                'cnpj'    => $e->EMP_CNPJ,
                'email'   => $e->EMP_EMAIL,
                'num'     => $e->EMP_NUM,
                'ativo'   => $e->EMP_ATIV,
                'modulos' => $e->modulos->pluck('MOD_NOME')
            ];
        });

        return response()->json($empresas);
    }

    // GET /api/adm/empresas/{id} - Detalhes de uma empresa
    public function show(int $id)
    {
        $empresa = Empresa::with('modulos')->findOrFail($id);

        $usuarioPrincipal = DB::table('EMPRESA_USUARIOS')
            ->join('USUARIOS', 'EMPRESA_USUARIOS.USU_ID', '=', 'USUARIOS.USU_ID')
            ->where('EMPRESA_USUARIOS.EMP_ID', $id)
            ->where('EMPRESA_USUARIOS.USU_E_PROPRIETARIO', 1)
            ->select('USUARIOS.USU_ID', 'USUARIOS.USU_NOME', 'USUARIOS.USU_EMAIL', 'USUARIOS.USU_NUM')
            ->first();

        return response()->json([
            'id'           => $empresa->EMP_ID,
            'nome'         => $empresa->EMP_NOME,
            'raz'          => $empresa->EMP_RAZ,
            'cnpj'         => $empresa->EMP_CNPJ,
            'email'        => $empresa->EMP_EMAIL,
            'num'          => $empresa->EMP_NUM,
            'ativo'        => $empresa->EMP_ATIV,
            'modulos'      => $empresa->modulos->pluck('MOD_NOME'),
            'usuarioId'    => $usuarioPrincipal?->USU_ID,
            'usuarioNome'  => $usuarioPrincipal?->USU_NOME,
            'usuarioEmail' => $usuarioPrincipal?->USU_EMAIL,
            'usuarioNum'   => $usuarioPrincipal?->USU_NUM,
        ]);
    }

    // PUT /api/adm/empresas/{id} - Atualizar dados de uma empresa
    public function update(Request $request, int $id)
    {
        $request->validate([
            'EMP_NOME'    => 'required|string|max:150',
            'EMP_RAZ'     => 'required|string|max:150',
            'EMP_CNPJ'    => 'required|string|max:14|unique:EMPRESAS,EMP_CNPJ,' . $id . ',EMP_ID',
            'EMP_EMAIL'   => 'required|email|max:150|unique:EMPRESAS,EMP_EMAIL,' . $id . ',EMP_ID',
            'EMP_NUM'     => 'nullable|string|max:20',
            'EMP_ATIV'    => 'required|boolean',
            'modulos'     => 'nullable|array',
            'modulos.*'   => 'integer|exists:MODULOS,MOD_ID',
            'usuarioNome' => 'nullable|string|max:100',
            'usuarioNum'  => 'nullable|string|max:20',
        ]);

        $empresa = Empresa::findOrFail($id);

        $empresa->update([
            'EMP_NOME'  => trim($request->EMP_NOME),
            'EMP_RAZ'   => trim($request->EMP_RAZ),
            'EMP_CNPJ'  => trim($request->EMP_CNPJ),
            'EMP_EMAIL' => trim($request->EMP_EMAIL),
            'EMP_NUM'   => $request->EMP_NUM ?? null,
            'EMP_ATIV'  => $request->EMP_ATIV,
        ]);

        if ($request->has('modulos')) {
            $empresa->modulos()->sync($request->modulos ?? []);

            // Sincroniza os módulos do owner com os da empresa
            $usuarioId = DB::table('EMPRESA_USUARIOS')
                ->where('EMP_ID', $id)
                ->where('USU_E_PROPRIETARIO', 1)
                ->value('USU_ID');

            if ($usuarioId) {
                DB::table('sewfy.USUARIO_MODULOS')
                    ->where('USU_ID', $usuarioId)
                    ->where('EMP_ID', $id)
                    ->delete();

                foreach ($request->modulos ?? [] as $modId) {
                    DB::table('sewfy.USUARIO_MODULOS')->insert([
                        'USU_ID'        => $usuarioId,
                        'EMP_ID'        => $id,
                        'MOD_ID'        => $modId,
                        'CONCEDIDO_POR' => $usuarioId,
                    ]);
                }
            }
        }

        if ($request->has('usuarioNome')) {
            $usuarioId = $usuarioId ?? DB::table('EMPRESA_USUARIOS')
                ->where('EMP_ID', $id)
                ->where('USU_E_PROPRIETARIO', 1)
                ->value('USU_ID');

            if ($usuarioId) {
                $dadosUpdate = ['USU_NOME' => trim($request->usuarioNome)];

                if ($request->filled('usuarioNum')) {
                    $dadosUpdate['USU_NUM'] = trim($request->usuarioNum);
                }

                DB::table('USUARIOS')
                    ->where('USU_ID', $usuarioId)
                    ->update($dadosUpdate);
            }
        }

        return response()->json(['mensagem' => 'Empresa atualizada com sucesso']);
    }

    public function retornaNomeEmpresa(int $id)
    {
        $id = (int) $id;
        $empresa = Empresa::find($id);

        if (!$empresa) {
            return response()->json(['erro' => 'Empresa não encontrada'], 404);
        }

        return response()->json(['EMP_NOME' => $empresa->EMP_NOME]);
    }

    public function acessar(Request $request, int $id)
    {
        $empresa = Empresa::findOrFail($id);

        return response()->json([
            'empresa_id'   => $empresa->EMP_ID,
            'empresa_nome' => $empresa->EMP_NOME,
        ]);
    }
}