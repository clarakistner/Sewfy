<?php

namespace App\Helpers;

use App\Models\OPInsumo;
use App\Models\Produto;

class FuncoesAuxiliares
{ 
    // Retorna o custo total de uma OP somando os custos de seus insumos
    public static function retornaCustotOP(string $idOP): float
    {
        return (float) OPInsumo::where('OP_ID', $idOP)
            ->sum('OPIN_CUSTOT');
    }
    public static function retornaNecessitaCliFor(int $idProd, int $idEmp){

    $produto = Produto::where('PROD_ID', $idProd)
    ->where('EMP_ID', $idEmp)
    ->first();
    return $produto->NECESSITA_CLIFOR;
    }
}
