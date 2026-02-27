<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'USUARIOS';
    protected $primaryKey = 'USU_ID';
    public $timestamps = false;

    protected $fillable = [
        'USU_NOME',
        'USU_EMAIL',
        'USU_SENHA',
        'USU_NUM',
        'USU_ATIV'
    ];

    protected $hidden = [
        'USU_SENHA'
    ];

    public function getAuthPassword(): string
    {
        return $this->USU_SENHA;
    }

    public function modulos()
    {
        return $this->belongsToMany(
            Modulo::class,
            'USUARIO_MODULOS',
            'USU_ID',
            'MOD_ID'
        );
    }
}