<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Empresa;

class Convite extends Model
{
    protected $table = 'CONVITES';
    protected $primaryKey = 'CONV_ID';
    public $timestamps = false;

    protected $fillable = [
        'EMPP_ID',
        'EMP_ID',
        'CONV_TIPO',
        'CONV_EMAIL',
        'CONV_NOME',
        'CONV_TOKEN',
        'CONV_EXPIRA',
        'CONV_USADO',
        'CONVIDADO_POR'
    ];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'EMP_ID', 'EMP_ID');
    }

    public function empresaPendente()
    {
        return $this->belongsTo(EmpresaPendente::class, 'EMPP_ID', 'EMPP_ID');
    }
}