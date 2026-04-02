<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Empresa;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable; // para autenticação via token

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
    public function getAuthPassword()
    {
        return $this->USU_SENHA;
    }

    // e o username também
    public function getAuthIdentifierName()
    {
        return 'USU_EMAIL';
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
