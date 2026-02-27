<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClienteFornecedor extends Model
{
    protected $table = 'CLIFOR';
    protected $primaryKey = 'CLIFOR_ID';
    public $timestamps = false;

    protected $fillable = [
        'EMP_ID',
        'CLIFOR_TIPO',
        'CLIFOR_NOME',
        'CLIFOR_CPFCNPJ',
        'CLIFOR_END',
        'CLIFOR_NUM',
        'CLIFOR_ATIV'
    ];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'EMP_ID', 'EMP_ID');
    }
}