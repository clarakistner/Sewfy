<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContaPagar extends Model
{
    protected $table = 'CONTAS_PAGAR';
    protected $primaryKey = 'CP_ID';
    public $timestamps = false;
    protected $fillable = [
        'EMP_ID',
        'OP_ID',
        'OPIN_ID',
        'CLIFOR_ID',
        'CP_VALOR',
        'CP_DATAE',
        'CP_DATAV',
        'CP_DATAP',
        'CP_STATUS',
        'USU_ID',

    ];
}
