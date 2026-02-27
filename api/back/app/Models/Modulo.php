<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Modulo extends Model
{
    protected $table = 'MODULOS';
    protected $primaryKey = 'MOD_ID';
    public $timestamps = false;

    protected $fillable = [
        'MOD_NOME',
        'MOD_DESC',
        'MOD_ATIVO'
    ];

    public function empresas()
    {
        return $this->belongsToMany(
            Empresa::class,
            'EMPRESA_MODULOS',
            'MOD_ID',
            'EMP_ID'
        );
    }

    public function usuarios()
    {
        return $this->belongsToMany(
            User::class,
            'USUARIO_MODULOS',
            'MOD_ID',
            'USU_ID'
        );
    }
}