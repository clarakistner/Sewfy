<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmpresaPendenteModulos extends Model
{
    protected $table = 'EMPRESAS_PENDENTES_MODULOS';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'EMPP_ID',
        'MOD_ID'
    ];

    public function empresaPendente()
    {
        return $this->belongsTo(
            EmpresaPendente::class,
            'EMPP_ID',
            'EMPP_ID'
        );
    }

    public function modulo()
    {
        return $this->belongsTo(
            Modulo::class,
            'MOD_ID',
            'MOD_ID'
        );
    }
}