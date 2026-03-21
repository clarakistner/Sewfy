<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class ConviteEmail extends Mailable
{
    public string $nome; // nome do destinatário
    public string $empresa; // nome da empresa relacionada ao convite
    public string $token; // token para aceitar o convite ou realizar a ação necessária
    public string $tipo; // tipo do convite (owner, funcionario, funcionario_multi, troca_owner, troca_email, redef_senha)
    public array $outrasEmpresas; // array de outras empresas (usado para convites de funcionário com acesso a múltiplas empresas)

    public function __construct( // construtor para inicializar as propriedades do email
        string $nome,
        string $empresa,
        string $token,
        string $tipo = 'funcionario',
        array $outrasEmpresas = []
    ) {
        $this->nome           = $nome;
        $this->empresa        = $empresa;
        $this->token          = $token;
        $this->tipo           = $tipo;
        $this->outrasEmpresas = $outrasEmpresas;
    }

    // função para construir o email, definindo o assunto e a view a ser usada
    public function build()
    {
        $assunto = match($this->tipo) {
            'owner'              => "Ative o acesso da {$this->empresa} no Sewfy",
            'funcionario'        => "Você foi convidado para acessar {$this->empresa} no Sewfy",
            'funcionario_multi'  => "Você foi convidado para acessar empresas no Sewfy",
            'troca_owner'        => "Você foi indicado como novo proprietário de {$this->empresa} no Sewfy",
            'troca_email'        => "Confirme seu novo email no Sewfy",
            'redef_senha'        => "Redefinição de senha - Sewfy",
            default              => "Notificação Sewfy",
        };

        return $this->subject($assunto)
                    ->view('convite');
    }
}