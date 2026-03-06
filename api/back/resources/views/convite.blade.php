<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            background-color: #f0f4ff;
            color: #333;
            padding: 40px 20px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

       .header {
            background: linear-gradient(90deg, #0e59fe, #020066);
            padding: 20px 40px; 
            color: white;
        }

        .header h1 {
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 1px;
        }

        .header p {
            font-size: 13px;
            opacity: 0.85;
            margin-top: 4px;
        }

        .body {
            padding: 36px 40px;
        }

        .body h2 {
            font-size: 20px;
            color: #020066;
            margin-bottom: 16px;
        }

        .body p {
            font-size: 15px;
            line-height: 1.7;
            color: #444;
            margin-bottom: 12px;
        }

        .aviso {
            background-color: #fff5f5;
            border-left: 4px solid #e53e3e;
            padding: 12px 16px;
            border-radius: 4px;
            color: #c53030;
            font-size: 13px;
            margin: 16px 0;
        }

        .info-box {
            background-color: #f0f4ff;
            border-left: 4px solid #0e59fe;
            padding: 12px 16px;
            border-radius: 4px;
            font-size: 13px;
            color: #1a3c8f;
            margin: 16px 0;
        }

        .btn-wrapper {
            text-align: center;
            margin: 28px 0;
        }

        .btn {
            display: inline-block;
            padding: 14px 36px;
            background: linear-gradient(90deg, #0e59fe, #020066);
            color: #ffffff !important; /* força o branco */
            border-radius: 8px;
            text-decoration: none;
            font-size: 15px;
            font-weight: bold;
            letter-spacing: 0.5px;
        }

        .footer {
            background-color: #f7f9ff;
            border-top: 1px solid #e2e8f0;
            padding: 20px 40px;
            font-size: 12px;
            color: #999;
            text-align: center;
        }
    </style>
</head>

<body>
    <div class="container">

        <div class="header">
            <h1>Sewfy</h1>
            <p>Sistema de Gestão ERP</p>
        </div>

        <div class="body">
            <h2>Olá, {{ $nome }}!</h2>

            @if($tipo === 'owner')
                <p>Você foi escolhido como responsável pela empresa <strong>{{ $empresa }}</strong> no Sewfy ERP.</p>
                <p>Para ativar o acesso da sua empresa, clique no botão abaixo e confirme seu cadastro.</p>

                <div class="aviso">
                    Atenção: sem a sua confirmação, a empresa <strong>{{ $empresa }}</strong> não será cadastrada no sistema.
                </div>
            @else
                <p>Você foi convidado para fazer parte do time da empresa <strong>{{ $empresa }}</strong> no Sewfy ERP.</p>
                <p>Clique no botão abaixo para confirmar seu acesso.</p>
            @endif

            <div class="info-box">
                <strong>Já tem uma conta no Sewfy?</strong> Digite sua senha atual para vincular esta empresa ao seu cadastro existente.<br><br>
                <strong>É seu primeiro acesso?</strong> Crie uma senha para acessar o sistema.
            </div>

            <div class="btn-wrapper">
                <a href="http://localhost/www.sewfy/confirmarcadastro/index.html?token={{ $token }}" class="btn">
                    Confirmar Cadastro
                </a>
            </div>
        </div>

        <div class="footer">
            Este link expira em 24 horas. Se você não esperava este email, ignore-o.<br>
            © 2026 Sewfy. Todos os direitos reservados.
        </div>

    </div>
</body>

</html>