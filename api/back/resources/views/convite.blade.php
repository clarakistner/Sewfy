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
    <p>Acaba de ser feita uma requisição de cadastro do seu email ({{ $convite->CONV_EMAIL }}) no site Sewfy</p>
    <p>Para confirmar seu email, clique no link abaixo:</p>
    <a href="{{ url('/validar-convite/' . $convite->CONV_TOKEN) }}">Confirmar email</a>
    <p>Este convite expira em {{ \Carbon\Carbon::parse($convite->CONV_EXPIRA)->format('d/m/Y H:i') }}</p>
</body>
</html>