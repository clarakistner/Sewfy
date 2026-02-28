<?php

namespace App\Http\Controllers;

use App\Models\Convite;
use App\Models\Empresa;
use App\Models\EmpresaPendente;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Mail\ConviteEmail;

class ConviteController extends Controller
{
    // POST /api/adm/convites/owner - Criar convite para nova empresa (owner)
    public function storeOwner(Request $request)
    {
        $request->validate([
            'EMPP_NOME'  => 'required|string|max:150',
            'EMPP_RAZ'   => 'required|string|max:150',
            'EMPP_CNPJ'  => 'required|string|size:14',
            'EMPP_EMAIL' => 'required|email|max:150',
            'EMPP_NUM'   => 'nullable|string|max:20',
            'modulos'    => 'required|array|min:1',
            'modulos.*'  => 'integer|exists:MODULOS,MOD_ID',
            'CONV_EMAIL' => 'required|email',
            'CONV_NOME'  => 'required|string|max:100'
        ]);

        $cnpjExiste = EmpresaPendente::where('EMPP_CNPJ', $request->EMPP_CNPJ)->exists()
            || Empresa::where('EMP_CNPJ', $request->EMPP_CNPJ)->exists();

        if ($cnpjExiste) {
            return response()->json(['erro' => 'CNPJ já cadastrado'], 409);
        }

        $emailExiste = EmpresaPendente::where('EMPP_EMAIL', $request->EMPP_EMAIL)->exists()
            || Empresa::where('EMP_EMAIL', $request->EMPP_EMAIL)->exists();

        if ($emailExiste) {
            return response()->json(['erro' => 'Email já cadastrado'], 409);
        }

        $token = Str::random(64);

        try {

            DB::beginTransaction();

            $adm = $request->user();

            $pendente = EmpresaPendente::create([
                'EMPP_NOME'  => trim($request->EMPP_NOME),
                'EMPP_RAZ'   => trim($request->EMPP_RAZ),
                'EMPP_CNPJ'  => preg_replace('/\D/', '', $request->EMPP_CNPJ),
                'EMPP_EMAIL' => trim($request->EMPP_EMAIL),
                'EMPP_NUM'   => $request->EMPP_NUM ?? null,
                'ADM_ID'     => $adm->ADM_ID
            ]);

            foreach ($request->modulos as $modId) {
                DB::table('EMPRESAS_PENDENTES_MODULOS')->insert([
                    'EMPP_ID' => $pendente->EMPP_ID,
                    'MOD_ID'  => $modId
                ]);
            }

            $convite = Convite::create([
                'EMPP_ID'       => $pendente->EMPP_ID,
                'EMP_ID'        => null,
                'CONV_TIPO'     => 'owner',
                'CONV_EMAIL'    => trim($request->CONV_EMAIL),
                'CONV_NOME'     => trim($request->CONV_NOME),
                'CONV_TOKEN'    => $token,
                'CONV_EXPIRA'   => now()->addDay(),
                'CONV_USADO'    => 0,
                'CONVIDADO_POR' => null
            ]);

            DB::commit();

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'erro'    => 'Erro ao cadastrar empresa',
                'detalhe' => $e->getMessage()
            ], 500);
        }

        // envia email fora da transação - mesmo que falhe, o cadastro da empresa não é comprometido
        $link = config('app.front_url') . '/confirmar?token=' . $token;

        try {
            Mail::to($request->CONV_EMAIL)
                ->queue(new ConviteEmail(
                    nome:    $request->CONV_NOME,
                    empresa: $request->EMPP_NOME,
                    link:    $link,
                    tipo:    'owner'
                ));
        } catch (\Exception $e) {
            \Log::error('Erro ao enviar email de convite owner: ' . $e->getMessage());
        }

        return response()->json([
            'mensagem' => 'Empresa cadastrada e convite enviado com sucesso!'
        ], 201);
    }

    // POST /api/convites - Criar convite para funcionário (funcionario)
    public function store(Request $request)
    {
        $request->validate([
            'CONV_EMAIL' => 'required|email',
            'CONV_NOME'  => 'required|string|max:100',
            'modulos'    => 'required|array|min:1',
            'modulos.*'  => 'integer|exists:MODULOS,MOD_ID'
        ]);

        $usuario = $request->user();
        $empresa = $usuario->empresa;

        $jaExiste = User::where('USU_EMAIL', $request->CONV_EMAIL)
            ->whereHas('empresas', fn($q) =>
                $q->where('EMP_ID', $empresa->EMP_ID)
            )->exists();

        if ($jaExiste) {
            return response()->json(['erro' => 'Usuário já pertence a esta empresa'], 409);
        }

        $convitePendente = Convite::where('CONV_EMAIL', $request->CONV_EMAIL)
            ->where('EMP_ID', $empresa->EMP_ID)
            ->where('CONV_USADO', 0)
            ->where('CONV_EXPIRA', '>', now())
            ->exists();

        if ($convitePendente) {
            return response()->json(['erro' => 'Já existe um convite pendente para este email'], 409);
        }

        $modulosEmpresa = DB::table('EMPRESA_MODULOS')
            ->where('EMP_ID', $empresa->EMP_ID)
            ->pluck('MOD_ID')
            ->toArray();

        foreach ($request->modulos as $modId) {
            if (!in_array($modId, $modulosEmpresa)) {
                return response()->json(['erro' => 'Módulo não contratado pela empresa'], 403);
            }
        }

        $token = Str::random(64);

        try {

            DB::beginTransaction();

            $convite = Convite::create([
                'EMPP_ID'       => null,
                'EMP_ID'        => $empresa->EMP_ID,
                'CONV_TIPO'     => 'funcionario',
                'CONV_EMAIL'    => trim($request->CONV_EMAIL),
                'CONV_NOME'     => trim($request->CONV_NOME),
                'CONV_TOKEN'    => $token,
                'CONV_EXPIRA'   => now()->addDay(),
                'CONV_USADO'    => 0,
                'CONVIDADO_POR' => $usuario->USU_ID
            ]);

            foreach ($request->modulos as $modId) {
                DB::table('CONVITES_MODULOS')->insert([
                    'CONV_ID' => $convite->CONV_ID,
                    'MOD_ID'  => $modId
                ]);
            }

            DB::commit();

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'erro'    => 'Erro ao criar convite',
                'detalhe' => $e->getMessage()
            ], 500);
        }

        $link = config('app.front_url') . '/confirmar-funcionario?token=' . $token;

        try {
            Mail::to($request->CONV_EMAIL)
                ->queue(new ConviteEmail(
                    nome:    $request->CONV_NOME,
                    empresa: $empresa->EMP_NOME,
                    link:    $link,
                    tipo:    'funcionario'
                ));
        } catch (\Exception $e) {
            \Log::error('Erro ao enviar email de convite funcionario: ' . $e->getMessage());
        }

        return response()->json(['mensagem' => 'Convite enviado com sucesso!'], 201);
    }

    // POST /api/convites/confirmar - Confirmar convite (tanto owner quanto funcionario)
    public function confirmar(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'senha' => 'required|string|min:8'
        ]);

        $convite = Convite::where('CONV_TOKEN', $request->token)
            ->where('CONV_USADO', 0)
            ->where('CONV_EXPIRA', '>', now())
            ->firstOrFail();

        if ($convite->CONV_TIPO === 'owner') {
            return $this->confirmarOwner($request, $convite);
        }

        return $this->confirmarFuncionario($request, $convite);
    }

    private function confirmarOwner(Request $request, Convite $convite)
    {
        $pendente = EmpresaPendente::with('modulos')->findOrFail($convite->EMPP_ID);

        try {

            DB::beginTransaction();

            $empresa = Empresa::create([
                'EMP_NOME'  => $pendente->EMPP_NOME,
                'EMP_RAZ'   => $pendente->EMPP_RAZ,
                'EMP_CNPJ'  => $pendente->EMPP_CNPJ,
                'EMP_EMAIL' => $pendente->EMPP_EMAIL,
                'EMP_NUM'   => $pendente->EMPP_NUM,
                'ADM_ID'    => $pendente->ADM_ID
            ]);

            foreach ($pendente->modulos as $modulo) {
                DB::table('EMPRESA_MODULOS')->insert([
                    'EMP_ID' => $empresa->EMP_ID,
                    'MOD_ID' => $modulo->MOD_ID
                ]);
            }

            $usuario = User::create([
                'USU_NOME'  => $convite->CONV_NOME,
                'USU_EMAIL' => $convite->CONV_EMAIL,
                'USU_SENHA' => Hash::make($request->senha),
                'USU_TIPO'  => 'owner',
                'USU_ATIV'  => 1
            ]);

            DB::table('EMPRESA_USUARIOS')->insert([
                'EMP_ID'             => $empresa->EMP_ID,
                'USU_ID'             => $usuario->USU_ID,
                'USU_E_PROPRIETARIO' => 1,
                'USU_ATIV'           => 1
            ]);

            foreach ($pendente->modulos as $modulo) {
                DB::table('USUARIO_MODULOS')->insert([
                    'USU_ID'        => $usuario->USU_ID,
                    'EMP_ID'        => $empresa->EMP_ID,
                    'MOD_ID'        => $modulo->MOD_ID,
                    'CONCEDIDO_POR' => $usuario->USU_ID
                ]);
            }

            $convite->update([
                'CONV_USADO' => 1,
                'EMP_ID'     => $empresa->EMP_ID
            ]);

            $pendente->delete();

            DB::commit();

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'erro'    => 'Erro ao confirmar cadastro',
                'detalhe' => $e->getMessage()
            ], 500);
        }

        return response()->json(['mensagem' => 'Empresa e cadastro confirmados com sucesso!']);
    }

    private function confirmarFuncionario(Request $request, Convite $convite)
    {
        try {

            DB::beginTransaction();

            $usuario = User::firstOrCreate(
                ['USU_EMAIL' => $convite->CONV_EMAIL],
                [
                    'USU_NOME'  => $convite->CONV_NOME,
                    'USU_SENHA' => Hash::make($request->senha),
                    'USU_TIPO'  => 'funcionario',
                    'USU_ATIV'  => 1
                ]
            );

            DB::table('EMPRESA_USUARIOS')->updateOrInsert(
                ['EMP_ID' => $convite->EMP_ID, 'USU_ID' => $usuario->USU_ID],
                ['USU_E_PROPRIETARIO' => 0, 'USU_ATIV' => 1]
            );

            $modulos = DB::table('CONVITES_MODULOS')
                ->where('CONV_ID', $convite->CONV_ID)
                ->pluck('MOD_ID');

            foreach ($modulos as $modId) {
                DB::table('USUARIO_MODULOS')->updateOrInsert(
                    [
                        'USU_ID' => $usuario->USU_ID,
                        'EMP_ID' => $convite->EMP_ID,
                        'MOD_ID' => $modId
                    ],
                    ['CONCEDIDO_POR' => $convite->CONVIDADO_POR]
                );
            }

            $convite->update(['CONV_USADO' => 1]);

            DB::commit();

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'erro'    => 'Erro ao confirmar convite',
                'detalhe' => $e->getMessage()
            ], 500);
        }

        return response()->json(['mensagem' => 'Cadastro confirmado com sucesso!']);
    }
}