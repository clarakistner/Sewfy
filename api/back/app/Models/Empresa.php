<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    protected $table = 'EMPRESAS'; // nome da tabela no banco
    protected $primaryKey = 'EMP_ID';  // chave primária
    public $timestamps = false; // desabilita timestamps (created_at, updated_at)

    protected $fillable = [ // campos que podem ser preenchidos em massa
        'EMP_NOME',
        'EMP_RAZ',
        'EMP_CNPJ',
        'EMP_EMAIL',
        'EMP_NUM',
        'EMP_ATIV',
        'ADM_ID'
    ];

    // função para relacionar a empresa com os usuários
    public function usuarios()
    {
        return $this->hasMany(User::class, 'EMP_ID', 'EMP_ID');
    }

    // função para relacionar a empresa com os módulos (relação muitos-para-muitos)
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