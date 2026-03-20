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
    protected $table = 'CONTAS_PAGAR'; // nome da tabela no banco
    protected $primaryKey = 'CP_ID'; // chave primária
    public $incrementing = false; // desabilita auto-incremento
    protected $keyType = 'string'; // chave primária é do tipo string
    public $timestamps = false; // desabilita timestamps (created_at, updated_at)
    protected $fillable = [ // campos que podem ser preenchidos em massa
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

    // função para relacionar a conta a pagar com a empresa
    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'EMP_ID', 'EMP_ID');
    }

    // função para relacionar a conta a pagar com o cliente/fornecedor
    public function clifor()
    {
        return $this->belongsTo(ClienteFornecedor::class, 'CLIFOR_ID', 'CLIFOR_ID');
    }

    // função para relacionar a conta a pagar com a ordem de produção (opcional)
    public function ordemProducao()
    {
        return $this->belongsTo(OrdemDeProducao::class, 'OP_ID', 'OP_ID');
    }

    // função para relacionar a conta a pagar com o insumo da ordem de produção (opcional)
    public function opInsumo()
    {
        return $this->belongsTo(OPInsumo::class, 'OPIN_ID', 'OPIN_ID');
    }

    // função para relacionar a conta a pagar com o usuário que a criou/atualizou
    public function usuario()
    {
        return $this->belongsTo(User::class, 'USU_ID', 'USU_ID');
    }
}