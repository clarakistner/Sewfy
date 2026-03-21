<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class SewfyAdm extends Authenticatable
{
    use HasApiTokens; // para autenticação via token

    protected $table = 'SEWFY_ADMS'; // nome da tabela no banco
    protected $primaryKey = 'ADM_ID'; // chave primária
    public $timestamps = false; // desabilita timestamps (created_at, updated_at)

    protected $fillable = [ // campos que podem ser preenchidos em massa
        'ADM_EMAIL',
        'ADM_SENHA',
        'ADM_ATIV',
        'ADM_DATAC'
    ];

    // campos que devem ser ocultados em arrays e JSON (como a senha)
    protected $hidden = [
        'ADM_SENHA'
    ];

    // função para retornar a senha do administrador para autenticação
    public function getAuthPassword(): string
    {
        return $this->ADM_SENHA;
    }
}