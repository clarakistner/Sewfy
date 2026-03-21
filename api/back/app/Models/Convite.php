<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Empresa;

class Convite extends Model
{
    protected $table = 'CONVITES'; // nome da tabela no banco
    protected $primaryKey = 'CONV_ID'; // chave primária
    public $timestamps = false; // desabilita timestamps (created_at, updated_at)

    protected $fillable = [ // campos que podem ser preenchidos em massa
        'EMPP_ID',
        'EMP_ID',
        'CONV_NUM',
        'CONV_EMAIL',
        'CONV_NOME',
        'CONV_TIPO',
        'CONV_TOKEN',
        'CONV_EXPIRA',
        'CONV_DATAC',
        'CONV_USADO',
        'CONV_TIPO',
        'CONV_USU_ID',
        'CONVIDADO_POR'
    ];

    // Relação com empresa (para convites de acesso a empresa existente)
    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'EMP_ID', 'EMP_ID');
    }

    // Relação com empresa pendente (para convites de criação de empresa)
    public function empresaPendente()
    {
        return $this->belongsTo(EmpresaPendente::class, 'EMPP_ID', 'EMPP_ID');
    }
}