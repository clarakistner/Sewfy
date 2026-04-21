@extends('layouts.guest')

@section('titulo', 'Editar Funcionário')
@push('styles')
    @vite(['resources/css/editarfuncionarios.css','resources/css/configmenu.css'])
@endpush
@section('conteudo')
<div class="modal" id="modal-editar-funcionario">
  <div class="modal-container">

    <!-- Header -->
    <div class="modal-header">
      <h2 class="modal-title">Editar Funcionário</h2>
      <button class="material-symbols-outlined fechar-modal" id="btn-fechar-editar">close</button>
    </div>

    <!-- Content -->
    <div class="modal-form">
      <div class="form-grid">

        <div>
          <label for="edit-nome">Nome *</label>
          <input type="text" id="edit-nome" placeholder="Nome completo" />
        </div>

        <div>
          <label for="edit-telefone">Telefone *</label>
          <input type="text" id="edit-telefone" placeholder="(00) 00000-0000" />
        </div>

        <div>
          <label for="edit-email">E-mail *</label>
          <input type="email" id="edit-email" placeholder="email@exemplo.com" />
        </div>

        <div>
          <label>Status *</label>
          <div class="toggle-wrapper">
            <button class="toggle-btn ativo" id="toggle-ativo" data-ativo="true">
              <span class="toggle-indicator"></span>
              <span class="toggle-label" id="toggle-label">Ativo</span>
            </button>
          </div>
        </div>

        <!-- Módulos -->
        <div class="col-span-2">
          <label>Módulos com acesso</label>
          <div class="modulos-grid" id="modulos-grid-editar">
            {{-- módulos carregados dinamicamente via JS --}}
          </div>
        </div>

        <!-- Ações -->
        <div class="col-span-2 modal-actions">
          <button type="button" class="btn-submit" id="btn-salvar-funcionario">Salvar alterações</button>
        </div>

      </div>
    </div>

  </div>
</div>
   @endsection

@section('scripts')
@vite(['resources/js/editarfuncionario.js' , 'resources/js/configmenu.js'])
@endsection