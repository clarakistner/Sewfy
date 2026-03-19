<?php

namespace App\Http\Controllers;

use App\Models\Convite;
use App\Models\Empresa;
use App\Models\EmpresaPendente;
use App\Models\EmpresaUsuarios;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Mail\ConviteEmail;
use Illuminate\Support\Facades\Log;

class ConviteController extends Controller
{
    // POST /api/adm/convites/owner - Criar convite para nova empresa
    public function storeOwner(Request $request)
    {
        $request->validate([
            'EMPP_NOME'  => 'required|string|max:150',
            'EMPP_RAZ'   => 'required|string|max:150',
            'EMPP_CNPJ'  => 'required|string|size:14',
            'EMPP_EMAIL' => 'required|email|max:150',
            'EMPP_NUM'   => 'nullable|string|max:20',
            'ADM_ID'     => 'required|integer|exists:SEWFY_ADMS,ADM_ID',
            'modulos'    => 'required|array|min:1',
            'modulos.*'  => 'integer|exists:MODULOS,MOD_ID',
            'CONV_EMAIL' => 'required|email',
            'CONV_NOME'  => 'required|string|max:100',
            'CONV_NUM'   => 'required|string|max:20',
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

            $pendente = EmpresaPendente::create([
                'EMPP_NOME'  => trim($request->EMPP_NOME),
                'EMPP_RAZ'   => trim($request->EMPP_RAZ),
                'EMPP_CNPJ'  => preg_replace('/\D/', '', $request->EMPP_CNPJ),
                'EMPP_EMAIL' => trim($request->EMPP_EMAIL),
                'EMPP_NUM'   => $request->EMPP_NUM ?? null,
                'ADM_ID'     => $request->ADM_ID
            ]);

            foreach ($request->modulos as $modId) {
                DB::table('EMPRESAS_PENDENTES_MODULOS')->insert([
                    'EMPP_ID' => $pendente->EMPP_ID,
                    'MOD_ID'  => $modId
                ]);
            }

            Convite::create([
                'EMPP_ID'       => $pendente->EMPP_ID,
                'EMP_ID'        => null,
                'CONV_USU_ID'   => null,
                'CONV_TIPO'     => 'owner',
                'CONV_NUM'      => trim($request->CONV_NUM),
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

        try {
            Mail::to($request->CONV_EMAIL)
                ->send(new ConviteEmail(
                    nome:    $request->CONV_NOME,
                    empresa: $request->EMPP_NOME,
                    token:   $token,
                    tipo:    'owner'
                ));
        } catch (\Exception $e) {
            Log::error('Erro ao enviar email de convite owner: ' . $e->getMessage());
        }

        return response()->json([
            'mensagem' => 'Empresa cadastrada e convite enviado com sucesso!'
        ], 201);
    }

    // POST /api/convites - Criar convite para funcionário (com suporte a múltiplas empresas)
    public function store(Request $request)
{
    $request->validate([
        'CONV_NUM'                    => 'required|string|max:20',
        'CONV_EMAIL'                  => 'required|email',
        'CONV_NOME'                   => 'required|string|max:100',
        'modulos'                     => 'required|array|min:1',
        'modulos.*'                   => 'integer|exists:MODULOS,MOD_ID',
        'outras_empresas'             => 'nullable|array',
        'outras_empresas.*.emp_id'    => 'required_with:outras_empresas|integer|exists:EMPRESAS,EMP_ID',
        'outras_empresas.*.modulos'   => 'required_with:outras_empresas|array|min:1',
        'outras_empresas.*.modulos.*' => 'integer|exists:MODULOS,MOD_ID',
    ]);

    $abilities    = $request->user()->currentAccessToken()->abilities;
    $ability      = collect($abilities)->first(fn($a) => str_starts_with($a, 'empresa_'));
    $empresaId    = (int) str_replace('empresa_', '', $ability);
    $usuario      = User::where('USU_EMAIL', $request->CONV_EMAIL)->first();
    $empresa      = Empresa::findOrFail($empresaId);
    $proprietario = $request->user();

    $jaExiste = $usuario && EmpresaUsuarios::where('USU_ID', $usuario->USU_ID)
        ->where('EMP_ID', $empresa->EMP_ID)
        ->exists();

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

    if ($request->filled('outras_empresas')) {
        foreach ($request->outras_empresas as $outraEmpresa) {
            $eProprietario = DB::table('EMPRESA_USUARIOS')
                ->where('EMP_ID', $outraEmpresa['emp_id'])
                ->where('USU_ID', $proprietario->USU_ID)
                ->where('USU_E_PROPRIETARIO', 1)
                ->exists();

            if (!$eProprietario) {
                return response()->json([
                    'erro' => 'Você não é proprietário da empresa ' . $outraEmpresa['emp_id']
                ], 403);
            }

            $modulosOutraEmpresa = DB::table('EMPRESA_MODULOS')
                ->where('EMP_ID', $outraEmpresa['emp_id'])
                ->pluck('MOD_ID')
                ->toArray();

            foreach ($outraEmpresa['modulos'] as $modId) {
                if (!in_array($modId, $modulosOutraEmpresa)) {
                    return response()->json([
                        'erro' => 'Módulo não contratado pela empresa ' . $outraEmpresa['emp_id']
                    ], 403);
                }
            }
        }
    }

    $token = Str::random(64);

    try {
        DB::beginTransaction();

        $convite = Convite::create([
            'EMPP_ID'       => null,
            'EMP_ID'        => $empresa->EMP_ID,
            'CONV_USU_ID'   => null,
            'CONV_TIPO'     => $request->filled('outras_empresas') ? 'funcionario_multi' : 'funcionario',
            'CONV_NUM'      => trim($request->CONV_NUM),
            'CONV_EMAIL'    => trim($request->CONV_EMAIL),
            'CONV_NOME'     => trim($request->CONV_NOME),
            'CONV_TOKEN'    => $token,
            'CONV_EXPIRA'   => now()->addDay(),
            'CONV_DATAC'    => now(),
            'CONV_USADO'    => 0,
            'CONVIDADO_POR' => $proprietario->USU_ID
        ]);

        foreach ($request->modulos as $modId) {
            DB::table('CONVITES_MODULOS')->insert([
                'CONV_ID' => $convite->CONV_ID,
                'MOD_ID'  => $modId
            ]);
        }

        if ($request->filled('outras_empresas')) {
            foreach ($request->outras_empresas as $outraEmpresa) {
                foreach ($outraEmpresa['modulos'] as $modId) {
                    DB::table('CONVITES_EMPRESAS_MODULOS')->insert([
                        'CONV_ID' => $convite->CONV_ID,
                        'EMP_ID'  => $outraEmpresa['emp_id'],
                        'MOD_ID'  => $modId
                    ]);
                }
            }
        }

        DB::commit();
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'erro'    => 'Erro ao criar convite',
            'detalhe' => $e->getMessage()
        ], 500);
    }

    try {
        $outrasEmpresasNomes = [];
        if ($request->filled('outras_empresas')) {
            $outrasEmpresasNomes = Empresa::whereIn(
                'EMP_ID',
                collect($request->outras_empresas)->pluck('emp_id')
            )->pluck('EMP_NOME')->toArray();
        }

        Mail::to($request->CONV_EMAIL)
            ->send(new ConviteEmail(
                nome:           $request->CONV_NOME,
                empresa:        $empresa->EMP_NOME,
                token:          $token,
                tipo:           $convite->CONV_TIPO,
                outrasEmpresas: $outrasEmpresasNomes
            ));
    } catch (\Exception $e) {
        Log::error('Erro ao enviar email de convite funcionario: ' . $e->getMessage());
    }

    return response()->json(['mensagem' => 'Convite enviado com sucesso!'], 201);
}

    // POST /api/adm/convites/trocar-owner - Trocar owner da empresa
    public function trocarOwner(Request $request)
    {
        $request->validate([
            'EMP_ID'     => 'required|integer|exists:EMPRESAS,EMP_ID',
            'CONV_EMAIL' => 'required|email',
            'CONV_NOME'  => 'required|string|max:100',
            'CONV_NUM'   => 'required|string|max:20',
        ]);

        $token = Str::random(64);

        $ownerAtualId = DB::table('EMPRESA_USUARIOS')
            ->where('EMP_ID', $request->EMP_ID)
            ->where('USU_E_PROPRIETARIO', 1)
            ->value('USU_ID');

        $empresa = Empresa::findOrFail($request->EMP_ID);

        try {
            DB::beginTransaction();

            Convite::create([
                'EMPP_ID'       => null,
                'EMP_ID'        => $request->EMP_ID,
                'CONV_USU_ID'   => $ownerAtualId,
                'CONV_TIPO'     => 'troca_owner',
                'CONV_NUM'      => trim($request->CONV_NUM),
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
                'erro'    => 'Erro ao criar convite de troca de owner',
                'detalhe' => $e->getMessage()
            ], 500);
        }

        try {
            Mail::to($request->CONV_EMAIL)
                ->send(new ConviteEmail(
                    nome:    $request->CONV_NOME,
                    empresa: $empresa->EMP_NOME,
                    token:   $token,
                    tipo:    'troca_owner'
                ));
        } catch (\Exception $e) {
            Log::error('Erro ao enviar email de troca de owner: ' . $e->getMessage());
        }

        return response()->json(['mensagem' => 'Convite de troca de owner enviado com sucesso!'], 201);
    }

    // POST /api/auth/redefinir-senha - Solicitar redefinição de senha
    public function redefinirSenha(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $usuario = User::where('USU_EMAIL', $request->email)->first();

        if (!$usuario) {
            return response()->json(['mensagem' => 'Se o email estiver cadastrado, você receberá um link em breve.']);
        }

        $token = Str::random(64);

        try {
            DB::beginTransaction();

            Convite::create([
                'EMPP_ID'       => null,
                'EMP_ID'        => null,
                'CONV_USU_ID'   => $usuario->USU_ID,
                'CONV_TIPO'     => 'redef_senha',
                'CONV_NUM'      => $usuario->USU_NUM ?? '00000000000',
                'CONV_EMAIL'    => $usuario->USU_EMAIL,
                'CONV_NOME'     => $usuario->USU_NOME,
                'CONV_TOKEN'    => $token,
                'CONV_EXPIRA'   => now()->addHours(2),
                'CONV_USADO'    => 0,
                'CONVIDADO_POR' => null
            ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'erro'    => 'Erro ao criar solicitação de redefinição',
                'detalhe' => $e->getMessage()
            ], 500);
        }

        try {
            Mail::to($usuario->USU_EMAIL)
                ->send(new ConviteEmail(
                    nome:    $usuario->USU_NOME,
                    empresa: '',
                    token:   $token,
                    tipo:    'redef_senha'
                ));
        } catch (\Exception $e) {
            Log::error('Erro ao enviar email de redefinição de senha: ' . $e->getMessage());
        }

        return response()->json(['mensagem' => 'Se o email estiver cadastrado, você receberá um link em breve.']);
    }

    // POST /api/auth/trocar-email - Solicitar troca de email
    public function trocarEmail(Request $request)
    {
        $request->validate([
            'novo_email' => 'required|email|unique:USUARIOS,USU_EMAIL',
            'senha'      => 'required|string',
        ]);

        $usuario = $request->user();

        if (!Hash::check($request->senha, $usuario->USU_SENHA)) {
            return response()->json(['erro' => 'Senha incorreta'], 401);
        }

        $token = Str::random(64);

        try {
            DB::beginTransaction();

            Convite::create([
                'EMPP_ID'       => null,
                'EMP_ID'        => null,
                'CONV_USU_ID'   => $usuario->USU_ID,
                'CONV_TIPO'     => 'troca_email',
                'CONV_NUM'      => $usuario->USU_NUM ?? '00000000000',
                'CONV_EMAIL'    => trim($request->novo_email),
                'CONV_NOME'     => $usuario->USU_NOME,
                'CONV_TOKEN'    => $token,
                'CONV_EXPIRA'   => now()->addDay(),
                'CONV_USADO'    => 0,
                'CONVIDADO_POR' => null
            ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'erro'    => 'Erro ao criar solicitação de troca de email',
                'detalhe' => $e->getMessage()
            ], 500);
        }

        try {
            Mail::to($request->novo_email)
                ->send(new ConviteEmail(
                    nome:    $usuario->USU_NOME,
                    empresa: '',
                    token:   $token,
                    tipo:    'troca_email'
                ));
        } catch (\Exception $e) {
            Log::error('Erro ao enviar email de troca de email: ' . $e->getMessage());
        }

        return response()->json(['mensagem' => 'Email de confirmação enviado para o novo endereço!']);
    }

    // POST /api/convites/confirmar - Confirmar convite
    public function confirmar(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'senha' => 'required|string|min:10',
        ]);

        $convite = Convite::where('CONV_TOKEN', $request->token)
            ->where('CONV_USADO', 0)
            ->where('CONV_EXPIRA', '>', now())
            ->firstOrFail();

        switch ($convite->CONV_TIPO) {
            case 'owner':
                return $this->confirmarOwner($request, $convite);
            case 'funcionario':
                return $this->confirmarFuncionario($request, $convite);
            case 'funcionario_multi':                                               // ← novo
                return $this->confirmarFuncionarioMultiEmpresa($request, $convite); // ← novo
            case 'troca_owner':
                return $this->confirmarTrocaOwner($request, $convite);
            case 'troca_email':
                return $this->confirmarTrocaEmail($request, $convite);
            case 'redef_senha':
                return $this->confirmarRedefinicaoSenha($request, $convite);
            default:
                return response()->json(['erro' => 'Tipo de convite inválido'], 400);
        }
    }

    // GET /api/convites/verificar?token= - Verificar status do convite
    public function verificar(Request $request)
    {
        $token = $request->query('token');

        $convite = Convite::where('CONV_TOKEN', $token)->first();

        if (!$convite) {
            return response()->json(['status' => 'invalido', 'tipo' => null]);
        }

        if ($convite->CONV_USADO) {
            return response()->json(['status' => 'usado', 'tipo' => $convite->CONV_TIPO]);
        }

        if ($convite->CONV_EXPIRA < now()) {
            return response()->json(['status' => 'expirado', 'tipo' => $convite->CONV_TIPO]);
        }

        return response()->json(['status' => 'valido', 'tipo' => $convite->CONV_TIPO]);
    }

    // Confirmação de convite para owner (criação de empresa)
    private function confirmarOwner(Request $request, Convite $convite)
    {
        $pendente = EmpresaPendente::with('modulos')->findOrFail($convite->EMPP_ID);
        $usuarioExistente = User::where('USU_EMAIL', $convite->CONV_EMAIL)->first();

        if ($usuarioExistente) {
            if (!Hash::check($request->senha, $usuarioExistente->USU_SENHA)) {
                return response()->json(['erro' => 'Senha incorreta para este usuário'], 401);
            }
        }

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

            if ($usuarioExistente) {
                $usuario = $usuarioExistente;
            } else {
                $usuario = User::create([
                    'USU_NOME'  => $convite->CONV_NOME,
                    'USU_EMAIL' => $convite->CONV_EMAIL,
                    'USU_SENHA' => Hash::make($request->senha),
                    'USU_NUM'   => $convite->CONV_NUM,
                    'USU_ATIV'  => 1
                ]);
            }

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

    // Confirmação de convite para funcionário (empresa única)
    private function confirmarFuncionario(Request $request, Convite $convite)
    {
        $usuarioExistente = User::where('USU_EMAIL', $convite->CONV_EMAIL)->first();

        if ($usuarioExistente) {
            if (!Hash::check($request->senha, $usuarioExistente->USU_SENHA)) {
                return response()->json(['erro' => 'Senha incorreta para este usuário'], 401);
            }
        }

        try {
            DB::beginTransaction();

            if ($usuarioExistente) {
                $usuario = $usuarioExistente;
            } else {
                $usuario = User::create([
                    'USU_NOME'  => $convite->CONV_NOME,
                    'USU_EMAIL' => $convite->CONV_EMAIL,
                    'USU_SENHA' => Hash::make($request->senha),
                    'USU_NUM'   => $convite->CONV_NUM,
                    'USU_ATIV'  => 1
                ]);
            }

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

    // Confirmação de convite para funcionário (múltiplas empresas) ← novo
    private function confirmarFuncionarioMultiEmpresa(Request $request, Convite $convite)
    {
        $usuarioExistente = User::where('USU_EMAIL', $convite->CONV_EMAIL)->first();

        if ($usuarioExistente) {
            if (!Hash::check($request->senha, $usuarioExistente->USU_SENHA)) {
                return response()->json(['erro' => 'Senha incorreta para este usuário'], 401);
            }
        }

        try {
            DB::beginTransaction();

            if ($usuarioExistente) {
                $usuario = $usuarioExistente;
            } else {
                $usuario = User::create([
                    'USU_NOME'  => $convite->CONV_NOME,
                    'USU_EMAIL' => $convite->CONV_EMAIL,
                    'USU_SENHA' => Hash::make($request->senha),
                    'USU_NUM'   => $convite->CONV_NUM,
                    'USU_ATIV'  => 1
                ]);
            }

            // Vincula na empresa principal
            DB::table('EMPRESA_USUARIOS')->updateOrInsert(
                ['EMP_ID' => $convite->EMP_ID, 'USU_ID' => $usuario->USU_ID],
                ['USU_E_PROPRIETARIO' => 0, 'USU_ATIV' => 1]
            );

            // Módulos da empresa principal
            $modulosPrincipais = DB::table('CONVITES_MODULOS')
                ->where('CONV_ID', $convite->CONV_ID)
                ->pluck('MOD_ID');

            foreach ($modulosPrincipais as $modId) {
                DB::table('USUARIO_MODULOS')->updateOrInsert(
                    [
                        'USU_ID' => $usuario->USU_ID,
                        'EMP_ID' => $convite->EMP_ID,
                        'MOD_ID' => $modId
                    ],
                    ['CONCEDIDO_POR' => $convite->CONVIDADO_POR]
                );
            }

            // Vincula nas outras empresas
            $outrasEmpresasModulos = DB::table('CONVITES_EMPRESAS_MODULOS')
                ->where('CONV_ID', $convite->CONV_ID)
                ->get()
                ->groupBy('EMP_ID');

            foreach ($outrasEmpresasModulos as $empId => $modulos) {
                DB::table('EMPRESA_USUARIOS')->updateOrInsert(
                    ['EMP_ID' => $empId, 'USU_ID' => $usuario->USU_ID],
                    ['USU_E_PROPRIETARIO' => 0, 'USU_ATIV' => 1]
                );

                foreach ($modulos as $modulo) {
                    DB::table('USUARIO_MODULOS')->updateOrInsert(
                        [
                            'USU_ID' => $usuario->USU_ID,
                            'EMP_ID' => $empId,
                            'MOD_ID' => $modulo->MOD_ID
                        ],
                        ['CONCEDIDO_POR' => $convite->CONVIDADO_POR]
                    );
                }
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

    // Confirmação de troca de owner
    private function confirmarTrocaOwner(Request $request, Convite $convite)
    {
        $novoOwnerEmail = $convite->CONV_EMAIL;
        $empresaId      = $convite->EMP_ID;
        $ownerAntigoId  = $convite->CONV_USU_ID;

        $modulosEmpresa = DB::table('EMPRESA_MODULOS')
            ->where('EMP_ID', $empresaId)
            ->pluck('MOD_ID');

        $novoUsuario = User::where('USU_EMAIL', $novoOwnerEmail)->first();

        if ($novoUsuario) {
            if (!Hash::check($request->senha, $novoUsuario->USU_SENHA)) {
                return response()->json(['erro' => 'Senha incorreta para este usuário'], 401);
            }
        }

        try {
            DB::beginTransaction();

            if ($novoUsuario) {
                $usuario = $novoUsuario;
            } else {
                $usuario = User::create([
                    'USU_NOME'  => $convite->CONV_NOME,
                    'USU_EMAIL' => $novoOwnerEmail,
                    'USU_SENHA' => Hash::make($request->senha),
                    'USU_NUM'   => $convite->CONV_NUM,
                    'USU_ATIV'  => 1
                ]);
            }

            DB::table('EMPRESA_USUARIOS')->updateOrInsert(
                ['EMP_ID' => $empresaId, 'USU_ID' => $usuario->USU_ID],
                ['USU_E_PROPRIETARIO' => 1, 'USU_ATIV' => 1]
            );

            foreach ($modulosEmpresa as $modId) {
                DB::table('USUARIO_MODULOS')->updateOrInsert(
                    [
                        'USU_ID' => $usuario->USU_ID,
                        'EMP_ID' => $empresaId,
                        'MOD_ID' => $modId
                    ],
                    ['CONCEDIDO_POR' => $usuario->USU_ID]
                );
            }

            if ($ownerAntigoId) {
                DB::table('EMPRESA_USUARIOS')
                    ->where('EMP_ID', $empresaId)
                    ->where('USU_ID', $ownerAntigoId)
                    ->update(['USU_E_PROPRIETARIO' => 0]);
            }

            $convite->update(['CONV_USADO' => 1]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'erro'    => 'Erro ao confirmar troca de owner',
                'detalhe' => $e->getMessage()
            ], 500);
        }

        return response()->json(['mensagem' => 'Troca de proprietário realizada com sucesso!']);
    }

    // Confirmação de troca de email
    private function confirmarTrocaEmail(Request $request, Convite $convite)
    {
        $usuarioId = $convite->CONV_USU_ID;
        $novoEmail = $convite->CONV_EMAIL;
        $usuario   = User::findOrFail($usuarioId);

        if (!Hash::check($request->senha, $usuario->USU_SENHA)) {
            return response()->json(['erro' => 'Senha incorreta'], 401);
        }

        try {
            DB::beginTransaction();

            $usuario->update(['USU_EMAIL' => $novoEmail]);
            $convite->update(['CONV_USADO' => 1]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'erro'    => 'Erro ao confirmar troca de email',
                'detalhe' => $e->getMessage()
            ], 500);
        }

        return response()->json(['mensagem' => 'Email atualizado com sucesso!']);
    }

    // Redefinição de senha
    private function confirmarRedefinicaoSenha(Request $request, Convite $convite)
    {
        $usuario = User::findOrFail($convite->CONV_USU_ID);

        try {
            DB::beginTransaction();

            $usuario->update(['USU_SENHA' => Hash::make($request->senha)]);
            $convite->update(['CONV_USADO' => 1]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'erro'    => 'Erro ao redefinir senha',
                'detalhe' => $e->getMessage()
            ], 500);
        }

        return response()->json(['mensagem' => 'Senha redefinida com sucesso!']);
    }
}