<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="base-url" content="http://localhost">
    <title>@yield('titulo', 'Sewfy Admin')</title>

    {{-- Esconde a página imediatamente se for reload de página de config, evitando flash --}}
    <script>
        (function() {
            const paginasConfig = [
                "cadastro-funcionario", "funcionarios",
                "editar-conta", "editar-tela-inicial"
            ];
            const pagina = window.location.pathname.split("/").pop();
            const temReabrirConfig = document.cookie.split(";").some(c => c.trim().startsWith("reabrirConfig="));
            if (paginasConfig.includes(pagina) || temReabrirConfig) {
                document.documentElement.style.visibility = "hidden";
            }
        })();
    </script>

    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet"/>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

    @vite(['resources/css/app.css', 'resources/css/telacarregamento.css'])
    @stack('styles')
</head>
<body>

    <div class="layout">
        @include('menu', ['modulosAtivos' => $modulosAtivos ?? [], 'nomeEmpresa' => $nomeEmpresa ?? ''])
        @yield('conteudo')
    </div>

    @yield('scripts')

</body>
</html>