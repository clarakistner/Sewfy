<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmpresaPendenteModulos extends Model
{
    protected $table = 'EMPRESAS_PENDENTES_MODULOS'; // nome da tabela no banco
    public $incrementing = false; // desabilita auto-incremento
    public $timestamps = false; // desabilita timestamps (created_at, updated_at)

    protected $fillable = [ // campos que podem ser preenchidos em massa
        'EMPP_ID',
        'MOD_ID'
    ];

    // função para relacionar a empresa pendente módulo com a empresa pendente
    public function empresaPendente()
    {
        return $this->belongsTo(
            EmpresaPendente::class,
            'EMPP_ID',
            'EMPP_ID'
        );
    }

    // função para relacionar a empresa pendente módulo com o módulo
    public function modulo()
    {
        return $this->belongsTo(
            Modulo::class,
            'MOD_ID',
            'MOD_ID'
        );
    }
}