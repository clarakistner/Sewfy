<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ModuloController extends Controller
{
    public function retornaNomeModulo($idModulo){
        $modulos = [
            1 => 'financeiro',
            2 => 'faturamento',
            3 => 'rh',
            4 => 'producao',
            5 => 'compras',
            6 => 'relatorios'
        ];

        return $modulos[$idModulo] ?? null;
    }
}
