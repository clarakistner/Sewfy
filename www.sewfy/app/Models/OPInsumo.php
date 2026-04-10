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
        'PROD_ID',
        'OP_ID',
        'CLIFOR_ID',
        'NECESSITA_CLIFOR'
    ];
    public function produto()
{
    return $this->belongsTo(Produto::class, 'PROD_ID', 'PROD_ID');
}
}