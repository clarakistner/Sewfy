<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;
use App\Models\UsuarioModulos;
use App\Models\Empresa;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        View::composer('layouts.app', function ($view) {
            $tokenRaw = urldecode(request()->cookies->get('token') ?? '');

            if (!$tokenRaw) {
                $view->with('modulosAtivos', [])->with('nomeEmpresa', '');
                return;
            }

            $tokenPart   = explode('|', $tokenRaw, 2)[1] ?? $tokenRaw;
            $hash        = hash('sha256', $tokenPart);
            $accessToken = \Laravel\Sanctum\PersonalAccessToken::where('token', $hash)->first();

            if (!$accessToken) {
                $view->with('modulosAtivos', [])->with('nomeEmpresa', '');
                return;
            }

            $user      = $accessToken->tokenable;
            $abilities = $accessToken->abilities;
            $ability   = collect($abilities)->first(fn($a) => str_starts_with($a, 'empresa_'));
            $empresaId = str_replace('empresa_', '', $ability ?? '');

            // Se não achou empresa no token, tenta pelo cookie empresa_id (admin impersonando)
            if (!$empresaId) {
                $empresaId = urldecode(request()->cookies->get('empresa_id') ?? '');
            }

            if (!$empresaId) {
                $view->with('modulosAtivos', [])->with('nomeEmpresa', '');
                return;
            }

            $empresa = Empresa::find($empresaId);

            // Admin Sewfy — pega módulos direto da empresa
            if ($user instanceof \App\Models\SewfyAdm) {
                $modulos = $empresa?->modulos->pluck('MOD_NOME')->toArray() ?? [];
                $view->with('modulosAtivos', $modulos)->with('nomeEmpresa', $empresa?->EMP_NOME ?? '');
                return;
            }

            // Usuário comum
            $modulos = UsuarioModulos::join('MODULOS', 'USUARIO_MODULOS.MOD_ID', '=', 'MODULOS.MOD_ID')
                ->where('USUARIO_MODULOS.USU_ID', $user->USU_ID)
                ->where('USUARIO_MODULOS.EMP_ID', $empresaId)
                ->pluck('MODULOS.MOD_NOME')
                ->toArray();

            $view->with('modulosAtivos', $modulos)->with('nomeEmpresa', $empresa?->EMP_NOME ?? '');
        });
    }
}