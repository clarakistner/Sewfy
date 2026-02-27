<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    protected $table = 'PRODUTOS';
    protected $primaryKey = 'PROD_ID';
    public $timestamps = false;

    protected $fillable = [
        'EMP_ID',
        'PROD_COD',
        'PROD_NOME',
        'PROD_DESC',
        'PROD_TIPO',
        'PROD_UM',
        'PROD_PRECO',
        'PROD_ATIV'
    ];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'EMP_ID', 'EMP_ID');
    }

    public function getTipoTextoAttribute(): string
    {
        return match ((int) $this->PROD_TIPO) {
            0 => 'Insumo',
            1 => 'Produto Acabado',
            3 => 'Conjunto',
            default => 'Desconhecido'
        };
    }
}