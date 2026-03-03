<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class SewfyAdm extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'SEWFY_ADMS';
    protected $primaryKey = 'ADM_ID';
    public $timestamps = false;

    protected $fillable = [
        'ADM_EMAIL',
        'ADM_SENHA',
        'ADM_ATIV',
        'ADM_DATAC'
    ];

    protected $hidden = [
        'ADM_SENHA'
    ];

    public function getAuthPassword(): string
    {
        return $this->ADM_SENHA;
    }
}