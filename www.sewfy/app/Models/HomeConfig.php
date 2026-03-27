<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomeConfig extends Model
{
    protected $table = 'HOME_CONFIG'; // nome da tabela no banco
    protected $primaryKey = 'EMP_ID'; // chave primária
    public $incrementing = false; // desabilita auto-incremento
    public $timestamps = false; // desabilita timestamps (created_at, updated_at)

    protected $fillable = [ // campos que podem ser preenchidos em massa
        'EMP_ID',
        'EXIBIR_CONTAS_PAGAR',
        'FILTRO_CONTAS_PAGAR',
        'EXIBIR_CONTAS_RECEBER',
        'FILTRO_CONTAS_RECEBER',
        'EXIBIR_ORDENS',
        'FILTRO_ORDENS',
    ];

    // função para relacionar a configuração da home com a empresa
    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'EMP_ID', 'EMP_ID');
    }
}