<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Empresa;

class User extends Authenticatable
{
    use HasApiTokens; // para autenticação via token

    protected $table = 'USUARIOS'; // nome da tabela no banco
    protected $primaryKey = 'USU_ID'; // chave primária
    public $timestamps = false; // desabilita timestamps (created_at, updated_at)

    protected $fillable = [ // campos que podem ser preenchidos em massa
        'USU_NOME',
        'USU_EMAIL',
        'USU_SENHA',
        'USU_NUM',
        'USU_ATIV'
    ];

    // campos que devem ser ocultados em arrays e JSON (como a senha)
    protected $hidden = [
        'USU_SENHA'
    ];

    // função para retornar a senha do usuário para autenticação
    public function getAuthPassword(): string
    {
        return $this->USU_SENHA;
    }

    // função para relacionar o usuário com os módulos (relação muitos-para-muitos)
    public function modulos()
    {
        return $this->belongsToMany(
            Modulo::class,
            'USUARIO_MODULOS',
            'USU_ID',
            'MOD_ID'
        );
    }

    // função para relacionar o usuário com as empresas (relação muitos-para-muitos)
    public function empresas()
    {
        return $this->belongsToMany(
            Empresa::class,
            'EMPRESA_USUARIOS',
            'USU_ID',
            'EMP_ID'
        );
    }
}
