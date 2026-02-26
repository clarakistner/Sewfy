<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrdemDeProducao extends Model
{
    // Nome da tabela no banco
    protected $table = 'ORDEM_PRODUCAO';

    // Chave primária da tabela
    protected $primaryKey = 'OP_ID';

    // A chave primária não é auto incremento
    public $incrementing = false;

    // Tipo da chave primária
    protected $keyType = 'string';

    // Laravel não gerencia timestamps nesta tabela
    public $timestamps = false;

    // Campos permitidos para inserção em massa
    protected $fillable = [
        'OP_ID',
        'OP_QTD',
        'OP_DATAA',
        'OP_DATAE',
        'OP_CUSTOU',
        'OP_CUSTOT',
        'OP_CUSTOUR',
        'OP_QTDE',
        'OP_QUEBRA',
        'USUARIOS_USU_ID',
        'PRODUTOS_PROD_ID'
    ];
}