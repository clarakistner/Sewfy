<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\SewfyAdm;
use App\Models\Empresa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ImpersonateEmpresa // Middleware para permitir que um usuário admin do Sewfy possa se "impersonar" como uma empresa específica, usando um header customizado para identificar a empresa
{

    // Função handle para processar a requisição e verificar se o usuário é um admin do Sewfy ou um usuário comum, e então adicionar a empresa correspondente à requisição
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // Se for usuário comum, fluxo normal
        if ($user instanceof User) {
            $abilities  = $user->currentAccessToken()->abilities;
            $ability    = collect($abilities)->first(fn($a) => str_starts_with($a, 'empresa_'));
            $empresaId  = str_replace('empresa_', '', $ability ?? '');

            $empresa = Cache::remember("empresa_{$empresaId}", 600, fn() => Empresa::find($empresaId));
            if (!$empresa) {
                return response()->json(['erro' => 'Empresa não encontrada'], 404);
            }

            $request->merge(['empresa' => $empresa]);
            return $next($request);
        }

        // Se for adm Sewfy impersonando
        if ($user instanceof SewfyAdm) {
            $empresaId = $request->header('X-Empresa-Id');

            if (!$empresaId) {
                return response()->json(['erro' => 'X-Empresa-Id não informado'], 400);
            }

            $empresa = Empresa::find($empresaId);
            if (!$empresa) {
                return response()->json(['erro' => 'Empresa não encontrada'], 404);
            }

            $request->merge(['empresa' => $empresa, 'is_adm_impersonating' => true]);
            return $next($request);
        }

        return response()->json(['erro' => 'Não autorizado'], 401);
    }
}