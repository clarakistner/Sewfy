<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConviteEmpresaModulo extends Model
{
    protected $table = 'CONVITES_EMPRESAS_MODULOS';
    public $timestamps = false;
    public $incrementing = false;

    protected $fillable = [
        'CONV_ID',
        'EMP_ID',
        'MOD_ID',
    ];

    public function convite()
    {
        return $this->belongsTo(Convite::class, 'CONV_ID', 'CONV_ID');
    }

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'EMP_ID', 'EMP_ID');
    }

    public function modulo()
    {
        return $this->belongsTo(Modulo::class, 'MOD_ID', 'MOD_ID');
    }
}