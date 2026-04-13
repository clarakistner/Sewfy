@extends('layouts.app')

@section('titulo', 'Home')
@push('styles')
    @vite(['resources/css/menu.css', 'resources/css/modalOrdemDeProducao.css', 'resources/css/visualizarContas.css', 'resources/css/configmenu.css', 'resources/css/home.css', 'resources/css/edicaoOrdemDeProducao.css'])
@endpush
@section('conteudo')

    <div class="layout">
        <main class="principal"></main>
    </div>

@endsection

@section('scripts')
@vite('resources/js/home.js')
@endsection