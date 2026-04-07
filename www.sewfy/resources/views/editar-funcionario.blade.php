@extends('layouts.app')

@section('titulo', 'Editar Funcionário')
@push('styles')
    @vite(['resources/css/editarfuncionario.css','resources/css/configmenu.css'])
@endpush
@section('conteudo')
<div class="modal containerConfigOwner" id="modal-editar-funcionario">
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
          <div class="modulos-grid">

            <label class="modulo-item">
              <input type="checkbox" class="modulo-check" data-modulo="faturamento" />
              <span class="modulo-box">
                <span class="modulo-check-icon material-symbols-outlined">check</span>
              </span>
              <span class="modulo-nome">Faturamento</span>
            </label>

            <label class="modulo-item">
              <input type="checkbox" class="modulo-check" data-modulo="financeiro" />
              <span class="modulo-box">
                <span class="modulo-check-icon material-symbols-outlined">check</span>
              </span>
              <span class="modulo-nome">Financeiro</span>
            </label>

            <label class="modulo-item">
              <input type="checkbox" class="modulo-check" data-modulo="compras" />
              <span class="modulo-box">
                <span class="modulo-check-icon material-symbols-outlined">check</span>
              </span>
              <span class="modulo-nome">Compras</span>
            </label>

            <label class="modulo-item">
              <input type="checkbox" class="modulo-check" data-modulo="rh" />
              <span class="modulo-box">
                <span class="modulo-check-icon material-symbols-outlined">check</span>
              </span>
              <span class="modulo-nome">Recursos Humanos</span>
            </label>

            <label class="modulo-item">
              <input type="checkbox" class="modulo-check" data-modulo="relatorios" />
              <span class="modulo-box">
                <span class="modulo-check-icon material-symbols-outlined">check</span>
              </span>
              <span class="modulo-nome">Relatórios</span>
            </label>

            <label class="modulo-item">
              <input type="checkbox" class="modulo-check" data-modulo="producao" />
              <span class="modulo-box">
                <span class="modulo-check-icon material-symbols-outlined">check</span>
              </span>
              <span class="modulo-nome">Produção</span>
            </label>

          </div>
        </div>

        <!-- Ações -->
        <div class="col-span-2 modal-actions">
          <button type="button" class="btn-cancel" id="btn-cancelar-editar">Cancelar</button>
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