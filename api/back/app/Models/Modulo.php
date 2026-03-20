<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Modulo extends Model
{
    protected $table = 'MODULOS'; // nome da tabela no banco
    protected $primaryKey = 'MOD_ID'; // chave primária
    public $timestamps = false; // desabilita timestamps (created_at, updated_at)

    protected $fillable = [ // campos que podem ser preenchidos em massa
        'MOD_NOME',
        'MOD_DESC',
        'MOD_ATIVO'
    ];

    // função para relacionar o módulo com as empresas (relação muitos-para-muitos)
    public function empresas()
    {
        return $this->belongsToMany(
            Empresa::class,
            'EMPRESA_MODULOS',
            'MOD_ID',
            'EMP_ID'
        );
    }

    // função para relacionar o módulo com os usuários (relação muitos-para-muitos)
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