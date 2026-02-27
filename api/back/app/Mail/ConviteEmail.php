<?php

namespace App\Mail;

use App\Models\Convite;
use Illuminate\Mail\Mailable;

class ConviteEmail extends Mailable
{
    public Convite $convite;

    public function __construct(Convite $convite)
    {
        $this->convite = $convite;
    }

    public function build()
    {
        return $this->subject('Confirmação de cadastro - Sewfy')
                    ->view('convite');
    }
}