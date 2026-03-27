<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UsuarioModulos extends Model
{
    protected $table = 'USUARIO_MODULOS'; // nome da tabela no banco
    public $timestamps = false; // desabilita timestamps (created_at, updated_at)
    public $incrementing = false; // desabilita auto-incremento
    protected $primaryKey = ['USU_ID', 'EMP_ID', 'MOD_ID']; // Chave primária composta

    protected $fillable = [ // campos que podem ser preenchidos em massa
        'USU_ID',
        'EMP_ID',
        'MOD_ID',
        'CONCEDIDO_POR'
    ];

    // Configura a chave primária composta para a consulta de atualização
    protected function setKeysForSaveQuery($query)
    { 
        return $query
            ->where('USU_ID', $this->USU_ID)
            ->where('EMP_ID', $this->EMP_ID)
            ->where('MOD_ID', $this->MOD_ID);
    }

    // Verifica se o registro já existe para evitar duplicidade 
    public static function criaUsuModulo(array $dados): bool
    {
        return self::create($dados) !== null;
    }

    // Função para buscar todos os módulos de um usuário em uma empresa específica
    public static function buscaTodosModulosUsu(int $idUsu, int $idEmp): \Illuminate\Database\Eloquent\Collection
    {
        return self::where('USU_ID', $idUsu)
            ->where('EMP_ID', $idEmp)
            ->get();
    }
}