<?php

class Fornecedor {

    private ?int $id = null;
    private int $usuarioId;
    private string $nome;
    private string $cpfCnpj;
    private string $telefone;
    private string $endereco;
    private int $ativo = 1; // padrão ativo             

    // getters e setters
    public function getId(): int {
        return $this->id;
    }

    public function setId(int $id): void {
        $this->id = $id;
    }


    public function getUsuarioId(): int {
        return $this->usuarioId;
    }

    public function setUsuarioId(int $usuarioId): void {
        $this->usuarioId = $usuarioId;
    }

   
    public function getNome(): string {
        return $this->nome;
    }

    public function setNome(string $nome): void {
        $this->nome = $nome;
    }

   
    public function getCpfCnpj(): string {
        return $this->cpfCnpj;
    }

    public function setCpfCnpj(string $cpfCnpj): void {
        $this->cpfCnpj = $cpfCnpj;
    }

    
    public function getTelefone(): string {
        return $this->telefone;
    }

    public function setTelefone(string $telefone): void {
        $this->telefone = $telefone;
    }

    
    public function getEndereco(): string {
        return $this->endereco;
    }

    public function setEndereco(string $endereco): void {
        $this->endereco = $endereco;
    }

    
    public function isAtivo(): bool {
        return $this->ativo === 1;
    }

    public function getAtivo(): int {
        return $this->ativo;
    }

    public function setAtivo(int $ativo): void {
        $this->ativo = $ativo;
    }
}
