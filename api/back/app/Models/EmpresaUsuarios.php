<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmpresaUsuarios extends Model
{
    protected $table = 'EMPRESA_USUARIOS';
    public $timestamps = false;
    public $incrementing = false;
    protected $primaryKey = ['EMP_ID', 'USU_ID'];

    protected $fillable = [
        'EMP_ID',
        'USU_ID',
        'USU_E_PROPRIETARIO',
        'USU_ATIV'
    ];

    protected function setKeysForSaveQuery($query)
    {
        return $query
            ->where('EMP_ID', $this->EMP_ID)
            ->where('USU_ID', $this->USU_ID);
    }

    public function getKey()
    {
        return $this->EMP_ID . '-' . $this->USU_ID;
    }

}