<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class ConviteEmail extends Mailable
{
    public string $nome;
    public string $empresa;
    public string $token;
    public string $tipo;

    public function __construct(
        string $nome,
        string $empresa,
        string $token,
        string $tipo = 'funcionario'
    ) {
        $this->nome    = $nome;
        $this->empresa = $empresa;
        $this->token    = $token;
        $this->tipo    = $tipo;
    }

    public function build()
    {
        $assunto = match($this->tipo) {
            'owner'       => "Ative o acesso da {$this->empresa} no Sewfy",
            'funcionario' => "Você foi convidado para acessar {$this->empresa} no Sewfy",
            'troca_owner' => "Você foi indicado como novo proprietário de {$this->empresa} no Sewfy",
            'troca_email' => "Confirme seu novo email no Sewfy",
            'redef_senha' => "Redefinição de senha - Sewfy",
            default       => "Notificação Sewfy",
        };

        return $this->subject($assunto)
                    ->view('convite');
    }
}