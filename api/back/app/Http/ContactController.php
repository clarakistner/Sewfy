<?php

namespace App\Http\Controllers;

use App\Mail\Contact;


class ContactController extends Controller
{

    public function  store()
    {
        
        $send = Mail::to('email@email.com', 'nome')-> send(new Contact([
            'fromName' => 'Sewfy',
            'fromEmail' => 'sewfy@email.com',
            'subjet' => 'Assunto',
            'message' => 'Mensagem a ser enviada'
        ]));
        var_dump('send contact');
    }
}
