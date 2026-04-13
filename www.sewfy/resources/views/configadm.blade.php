@extends('layouts.admin')

@section('titulo', 'Configurar ADM')
@push('styles')
    @vite('resources/css/menuadm.css')
@endpush

@section('conteudo')
    <main class="content"></main>
@endsection

@section('scripts')
@vite('resources/js/configadm.js')
@endsection