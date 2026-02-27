<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Convite extends Model
{
    protected $table = 'CONVITES';
    protected $primaryKey = 'CONV_ID';
    public $timestamps = false;

    protected $fillable = [
        'EMP_ID',
        'CONV_EMAIL',
        'CONV_TOKEN',
        'CONV_EXPIRA',
        'CONV_USADO',
        'CONVIDADO_POR'
    ];

    
    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'EMP_ID');
    }

}