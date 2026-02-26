<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OPInsumo extends Model
{
    // Nome da tabela no banco
    protected $table = 'OP_INSUMOS';

    // Chave primária da tabela
    protected $primaryKey = 'OPIN_ID';

    // Laravel não gerencia timestamps nesta tabela
    public $timestamps = false;

    // Campos permitidos para inserção em massa
    protected $fillable = [
        'OPIN_UM',
        'OPIN_QTD',
        'OPIN_CUSTOU',
        'OPIN_CUSTOT',
        'PRODUTOS_PROD_ID',
        'ORDEM_PRODUCAO_OP_ID',
        'FORNECEDORES_CLIFOR_ID'
    ];
}