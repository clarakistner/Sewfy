<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    protected $table = 'EMPRESAS';
    protected $primaryKey = 'EMP_ID';
    public $timestamps = false;

    protected $fillable = [
        'EMP_NOME',
        'EMP_RAZ',
        'EMP_CNPJ',
        'EMP_EMAIL',
        'EMP_NUM',
        'EMP_ATIV',
        'ADM_ID'
    ];

    public function usuarios()
    {
        return $this->hasMany(User::class, 'EMP_ID', 'EMP_ID');
    }

    public function modulos()
    {
        return $this->belongsToMany(
            Modulo::class,
            'EMPRESA_MODULOS',
            'EMP_ID',
            'MOD_ID'
        );
    }
}