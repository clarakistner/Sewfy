<!-- resources/views/layouts/app.blade.php -->
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="base-url" content="http://localhost">
    <title>@yield('titulo', 'Sewfy Admin')</title>

    
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet"/>

    @vite('resources/css/app.css')
    @stack('styles')
</head>
<body>

    @yield('conteudo')

    
    @yield('scripts')

</body>
</html>