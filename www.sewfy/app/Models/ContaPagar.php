<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Empresa;
use App\Models\ClienteFornecedor;
use App\Models\OrdemDeProducao;
use App\Models\OPInsumo;
use App\Models\User;

class ContaPagar extends Model
{
    protected $table      = 'CONTAS_PAGAR';
    protected $primaryKey = 'CP_ID';
    public $incrementing  = false;
    protected $keyType    = 'string';
    public $timestamps    = false;

    protected $fillable = [
        'CP_ID',
        'EMP_ID',
        'OP_ID',
        'OPIN_ID',
        'CLIFOR_ID',
        'CP_VALOR',
        'CP_DATAE',
        'CP_DATAV',
        'CP_DATAP',
        'CP_STATUS',
        'CP_HISTORICO',
        'CP_OCORRENCIA',
        'CP_GRUPO_ID',
        'CP_PARCELA_NUM',
        'CP_PARCELA_TOT',
        'USU_ID',
    ];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'EMP_ID', 'EMP_ID');
    }

    public function clifor()
    {
        return $this->belongsTo(ClienteFornecedor::class, 'CLIFOR_ID', 'CLIFOR_ID');
    }

    public function ordemProducao()
    {
        return $this->belongsTo(OrdemDeProducao::class, 'OP_ID', 'OP_ID');
    }

    public function opInsumo()
    {
        return $this->belongsTo(OPInsumo::class, 'OPIN_ID', 'OPIN_ID');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'USU_ID', 'USU_ID');
    }
}