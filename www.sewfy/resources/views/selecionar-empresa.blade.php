@extends('layouts.app')

@section('titulo', 'Selecionar Empresa')
@push('styles')
@vite('resources/css/selecionar-empresa.css')
@endpush
@section('conteudo')

<div class="bg-orbs">
  <div class="orb orb-1"></div>
  <div class="orb orb-2"></div>
  <div class="orb orb-3"></div>
</div>

<div class="card">

  <div class="card-header">
    <h1 class="card-title">Escolha a empresa</h1>
    <p class="card-subtitle">
      Bem-vindo(a) de volta, <strong id="usuario-nome"></strong>!<br />
      Por favor escolha a empresa que você deseja acessar.
    </p>
  </div>

  <div class="card-body">
    <label class="select-label" for="select-empresa">Empresa</label>
    <div class="select-wrapper">
      <select id="select-empresa" class="select-empresa">
        <option value="" disabled selected>Escolha uma empresa</option>
      </select>
      <div class="select-arrow">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>

    <button class="btn-continuar" id="btn-continuar">
      Continuar
    </button>
  </div>

</div>

<div class="copyright">© 2026 Sewfy. Todos os direitos reservados.</div>

@endsection

@section('scripts')
@vite('resources/js/selecionar-empresa.js')
@endsection