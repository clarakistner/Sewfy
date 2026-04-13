@extends('layouts.guest')

@section('titulo', 'Carregando')
@push('styles')
    @vite(['resources/css/telacarregamento.css'])
@endpush
@section('conteudo')
<div class="fundo" id="fundo-fosco">
  <div class="iconeCarregando" id="icone-carregamento"></div>
  <h3 id="textoCarregando">Carregando</h3>
</div>
   @endsection

@section('scripts')
@vite('resources/js/telacarregamento.js')
@endsection