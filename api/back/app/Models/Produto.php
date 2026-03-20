<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produto extends Model
{
    protected $table = 'PRODUTOS'; // nome da tabela no banco
    protected $primaryKey = 'PROD_ID'; // chave primária
    public $timestamps = false; // desabilita timestamps (created_at, updated_at)

    protected $fillable = [ // campos que podem ser preenchidos em massa
        'EMP_ID',
        'PROD_COD',
        'PROD_NOME',
        'PROD_DESC',
        'PROD_TIPO',
        'PROD_UM',
        'PROD_PRECO',
        'PROD_ATIV'
    ];

    // função para relacionar o produto com a empresa
    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'EMP_ID', 'EMP_ID');
    }

    // função para retornar o tipo do produto como texto legível
    public function getTipoTextoAttribute(): string
    { 
        return match ($this->PROD_TIPO) {
            'insumo'          => 'Insumo',
            'produto acabado' => 'Produto Acabado',
            'conjunto'        => 'Conjunto',
            default           => 'Desconhecido'
        };
    }

    // função para retornar a unidade de medida do produto como texto legível
    public function getUmTextoAttribute(): string
    {
        return match ($this->PROD_UM) {
            'UN' => 'Unidade',
            'KG' => 'Quilograma',
            'MT' => 'Metro',
            default => 'Desconhecido'
        };
    }
}