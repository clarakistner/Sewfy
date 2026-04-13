@extends('layouts.admin')

@section('titulo', 'Relatórios ADM')
@push('styles')
    @vite(['resources/css/menuadm.css', 'resources/css/relatoriosadm.css'])
@endpush

@section('conteudo')
    <main class="content"></main>
@endsection

@section('scripts')
@vite('resources/js/relatoriosadm.js')
@endsection