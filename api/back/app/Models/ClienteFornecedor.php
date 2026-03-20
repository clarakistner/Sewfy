<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClienteFornecedor extends Model
{
    protected $table = 'CLIFOR'; // nome da tabela no banco
    protected $primaryKey = 'CLIFOR_ID'; // chave primária
    public $timestamps = false; // desabilita timestamps (created_at, updated_at)

    protected $fillable = [ // campos que podem ser preenchidos em massa
        'EMP_ID',
        'CLIFOR_TIPO',
        'CLIFOR_NOME',
        'CLIFOR_CPFCNPJ',
        'CLIFOR_END',
        'CLIFOR_NUM',
        'CLIFOR_ATIV'
    ];

    // função para relacionar o cliente/fornecedor com a empresa
    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'EMP_ID', 'EMP_ID');
    }
}