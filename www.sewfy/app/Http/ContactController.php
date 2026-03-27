<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Mail;
use App\Mail\ConviteEmail;


class ContactController extends Controller
{

    public function  store()
    {
        
        $send = Mail::to('email@email.com', 'nome')-> send(new ConviteEmail((object)[
            'fromName' => 'Sewfy',
            'fromEmail' => 'sewfy@email.com',
            'subjet' => 'Assunto',
            'message' => 'Mensagem a ser enviada'
        ]));
        var_dump('send contact');
    }
}
