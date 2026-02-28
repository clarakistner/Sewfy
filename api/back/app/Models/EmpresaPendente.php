<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmpresaPendente extends Model
{
    protected $table = 'EMPRESAS_PENDENTES';
    protected $primaryKey = 'EMPP_ID';
    public $timestamps = false;

    protected $fillable = [
        'EMPP_NOME', 'EMPP_RAZ', 'EMPP_CNPJ',
        'EMPP_EMAIL', 'EMPP_NUM', 'ADM_ID'
    ];

    public function modulos()
    {
        return $this->belongsToMany(
            Modulo::class,
            'EMPRESAS_PENDENTES_MODULOS',
            'EMPP_ID',
            'MOD_ID'
        );
    }
}