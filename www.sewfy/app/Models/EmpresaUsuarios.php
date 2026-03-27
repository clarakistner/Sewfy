<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmpresaUsuarios extends Model
{
    protected $table = 'EMPRESA_USUARIOS'; // nome da tabela no banco
    public $timestamps = false; // desabilita timestamps (created_at, updated_at)
    public $incrementing = false; // desabilita auto-incremento
    protected $primaryKey = ['EMP_ID', 'USU_ID']; // chave primária composta

    protected $fillable = [ // campos que podem ser preenchidos em massa
        'EMP_ID',
        'USU_ID',
        'USU_E_PROPRIETARIO',
        'USU_ATIV'
    ];

    // função para configurar a chave primária composta
    protected function setKeysForSaveQuery($query)
    {
        return $query
            ->where('EMP_ID', $this->EMP_ID)
            ->where('USU_ID', $this->USU_ID);
    }

    // função para retornar a chave primária composta como string
    public function getKey()
    {
        return $this->EMP_ID . '-' . $this->USU_ID;
    }

    // função para relacionar a empresa usuários com os usuários
    public function usuarios(){
        return $this->belongsToMany(User::class,
        "USUARIOS",
        );
    }

}