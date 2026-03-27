<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmpresaPendente extends Model
{
    protected $table = 'EMPRESAS_PENDENTES'; // nome da tabela no banco
    protected $primaryKey = 'EMPP_ID'; // chave primária
    public $timestamps = false; // desabilita timestamps (created_at, updated_at)

    protected $fillable = [ // campos que podem ser preenchidos em massa
        'EMPP_NOME', 'EMPP_RAZ', 'EMPP_CNPJ',
        'EMPP_EMAIL', 'EMPP_NUM', 'ADM_ID'
    ];

    // função para relacionar a empresa pendente com os módulos (relação muitos-para-muitos)
    public function modulos() 
    {
        return $this->belongsToMany(
            Modulo::class,
            'EMPRESAS_PENDENTES_MODULOS',
            'EMPP_ID',
            'MOD_ID'
        );
    }
}