<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class ConviteEmail extends Mailable
{
    public string $nome;
    public string $empresa;
    public string $link;
    public string $tipo;

    public function __construct(
        string $nome,
        string $empresa,
        string $link,
        string $tipo = 'funcionario'
    ) {
        $this->nome    = $nome;
        $this->empresa = $empresa;
        $this->link    = $link;
        $this->tipo    = $tipo;
    }

    public function build()
    {
        $assunto = $this->tipo === 'owner'
            ? "Ative o acesso da {$this->empresa} no Sewfy"
            : "Você foi convidado para acessar {$this->empresa} no Sewfy";

        return $this->subject($assunto)
                    ->view('emails.convite');
    }
}