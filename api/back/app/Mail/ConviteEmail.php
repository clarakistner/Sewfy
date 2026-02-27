<?php

namespace App\Mail;

use App\Models\Convite;
use Illuminate\Mail\Mailable;

class ConviteEmail extends Mailable
{
    public object $dados;

    public function __construct(object $dados)
    {
        $this->dados = $dados;
    }

    public function build()
    {
        return $this->subject('Confirmação de cadastro - Sewfy')
                    ->view('convite');
    }
}