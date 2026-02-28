<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .btn { 
            display: inline-block; 
            padding: 12px 24px; 
            background-color: #1a3c8f; 
            color: #fff; 
            text-decoration: none; 
            border-radius: 6px; 
            margin-top: 20px;
        }
        .aviso { color: #e53e3e; font-size: 13px; margin-top: 16px; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Olá, {{ $nome }}!</h2>

        @if($tipo === 'owner')
            <p>Você foi escolhido como responsável pela empresa <strong>{{ $empresa }}</strong> no Sewfy ERP.</p>
            <p>Para ativar o acesso da sua empresa, clique no botão abaixo e defina sua senha:</p>
            <p class="aviso">Atenção: sem a sua confirmação, a empresa não será cadastrada no sistema.</p>
        @else
            <p>Você foi convidado para fazer parte do time da empresa <strong>{{ $empresa }}</strong> no Sewfy ERP.</p>
            <p>Clique no botão abaixo para confirmar seu cadastro e definir sua senha:</p>
        @endif

        <a href="{{ $link }}" class="btn">Confirmar Cadastro</a>

        <p style="margin-top: 24px; font-size: 13px; color: #666;">
            Este link expira em 24 horas. Se você não esperava este email, ignore-o.
        </p>
    </div>
</body>
</html>