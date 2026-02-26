<?php
class Usuario {

    private ?int    $id     = null;
    private ?string $nome   = null;
    private ?string $email  = null;
    private ?string $senha  = null;
    private ?string $numero = null;
    private int     $ativo  = 1;

    public function getId(): ?int { 
        return $this->id;
    }
    public function setId(int $id): void     { $this->id = $id; }

    public function getNome(): ?string             { return $this->nome; }
    public function setNome(string $nome): void    { $this->nome = $nome; }

    public function getEmail(): ?string              { return $this->email; }
    public function setEmail(string $email): void    { $this->email = $email; }

    public function getSenha(): ?string              { return $this->senha; }
    public function setSenha(string $senha): void    { $this->senha = $senha; }

    public function getNumero(): ?string               { return $this->numero; }
    public function setNumero(?string $numero): void   { $this->numero = $numero; }

    public function getAtivo(): int              { return $this->ativo; }
    public function setAtivo(int $ativo): void   { $this->ativo = $ativo; }
}