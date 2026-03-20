<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConviteEmpresaModulo extends Model
{
    protected $table = 'CONVITES_EMPRESAS_MODULOS'; // nome da tabela no banco
    public $timestamps = false; // desabilita timestamps (created_at, updated_at)
    public $incrementing = false; // desabilita auto-incremento

    protected $fillable = [ // campos que podem ser preenchidos em massa
        'CONV_ID',
        'EMP_ID',
        'MOD_ID',
    ];

    // função para relacionar o convite empresa módulo com o convite
    public function convite()
    {
        return $this->belongsTo(Convite::class, 'CONV_ID', 'CONV_ID');
    }

    // função para relacionar o convite empresa módulo com a empresa
    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'EMP_ID', 'EMP_ID');
    }

    // função para relacionar o convite empresa módulo com o módulo
    public function modulo()
    {
        return $this->belongsTo(Modulo::class, 'MOD_ID', 'MOD_ID');
    }
}