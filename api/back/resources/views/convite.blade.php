<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email - Sewfy</title>
</head>

<body>
    <h3>Confirmação de Email</h3>
    <p>Olá!</p>
    <p>Acaba de ser feita uma requisição de cadastro do seu email ({{ $dados->convite->CONV_EMAIL }}) no site Sewfy pela empresa {{ $dados->nome_empresa }}</p>
    <p>Para confirmar seu email, clique no botão abaixo:</p>
    <a href="{{ url('/validar-convite/' . $dados->convite->CONV_TOKEN) }}" style="display: inline-block; background-color: rgb(0,0,255); color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Confirmar email</a>
    <p>Este convite expira em {{ \Carbon\Carbon::parse($dados->convite->CONV_EXPIRA)->format('d/m/Y H:i') }}</p>
</body>

</html>