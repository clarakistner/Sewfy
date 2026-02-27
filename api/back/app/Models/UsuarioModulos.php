<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UsuarioModulos extends Model
{
    protected $table = 'USUARIO_MODULOS';
    public $timestamps = false;
    public $incrementing = false;

    // Chave primária composta
    protected $primaryKey = ['USU_ID', 'EMP_ID', 'MOD_ID'];

    protected $fillable = [
        'USU_ID',
        'EMP_ID',
        'MOD_ID',
        'CONCEDIDO_POR'
    ];

    
    protected function setKeysForSaveQuery($query)
    {
        return $query
            ->where('USU_ID', $this->USU_ID)
            ->where('EMP_ID', $this->EMP_ID)
            ->where('MOD_ID', $this->MOD_ID);
    }

    public static function criaUsuModulo(array $dados): bool
    {
        return self::create($dados) !== null;
    }

    public static function buscaTodosModulosUsu(int $idUsu, int $idEmp): \Illuminate\Database\Eloquent\Collection
    {
        return self::where('USU_ID', $idUsu)
            ->where('EMP_ID', $idEmp)
            ->get();
    }
}