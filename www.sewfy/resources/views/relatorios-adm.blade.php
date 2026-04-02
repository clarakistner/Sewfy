@extends('layouts.app')

@section('titulo', 'Relatórios ADM')
@push('styles')
    @vite(['resources/css/menuadm.css', 'resources/css/relatoriosadm.css'])
@endpush
@section('conteudo')

    <div class="layout">

        <main class="content">



        </main>
    </div>

  @endsection

@section('scripts')
@vite('resources/js/relatoriosadm.js')
@endsection