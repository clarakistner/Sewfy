<?php

namespace App\Helpers;

use App\Models\OPInsumo;

class FuncoesAuxiliares
{ 
    // Retorna o custo total de uma OP somando os custos de seus insumos
    public static function retornaCustotOP(string $idOP): float
    {
        return (float) OPInsumo::where('ORDEM_PRODUCAO_OP_ID', $idOP)
            ->sum('OPIN_CUSTOT');
    }
}
