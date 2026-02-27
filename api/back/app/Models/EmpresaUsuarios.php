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

    public static function criarNovoUsuarioEmpresa(array $dados): bool
    {
        return self::create($dados) !== null;
    }

    public static function buscaTodosUsuariosDaEmpresa(int $idEmp): \Illuminate\Database\Eloquent\Collection
    {
        return self::where('EMP_ID', $idEmp)->get();
    }

    public static function buscaEmpresasUsuario(int $idUsu): \Illuminate\Database\Eloquent\Collection
    {
        return self::where('USU_ID', $idUsu)->get();
    }

    public static function buscaUsuarioEmEmpresa(int $idEmp, int $idUsu): ?self
    {
        return self::where('EMP_ID', $idEmp)
            ->where('USU_ID', $idUsu)
            ->first();
    }

    public static function editaAtivoUsu(int $ativo, int $idEmp, int $idUsu): bool
    {
        return self::where('EMP_ID', $idEmp)
            ->where('USU_ID', $idUsu)
            ->update(['USU_ATIV' => $ativo]) > 0;
    }

    public static function editaEhProprietario(int $ehProprietario, int $idEmp, int $idUsu): bool
    {
        return self::where('EMP_ID', $idEmp)
            ->where('USU_ID', $idUsu)
            ->update(['USU_E_PROPRIETARIO' => $ehProprietario]) > 0;
    }
}