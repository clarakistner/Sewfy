@extends('layouts.app')

@section('titulo', 'Editar Conta do Proprietário')
@push('styles')
    @vite(['resources/css/editarcontaOwner.css','resources/css/configmenu.css'])
@endpush
@section('conteudo')
<div class="containerConfigOwner">

  <div class="editarUsuario">

    <div class="tituloPagina">
          <h1>
              Editar Conta do Proprietário
          </h1>
          <p>Atualize suas informações de administrador</p>
    </div>

    <!-- Seção de Dados do Proprietário -->
    <div class="secao-card">
                <h2 class="secao-titulo">Dados Pessoais</h2>

                <div class="form-grid">
                    <div class="campo campo-full">
                        <label>Nome *</label>
                        <input type="text" placeholder="Nome do Usuário" id="nome"/>
                    </div>                    
                    <div class="campo campo-full">
                        <label>Telefone *</label>
                        <input type="text" placeholder="(99) 99999-9999" id="telefone"/>
                    </div>
                    <div class="campo campo-full">
                        <label>Email *</label>
                        <input type="email" placeholder="proprietario@gmail.com" id="email"/>
                    </div>
                </div>
      </div>

      <div class="containerButton">
        <button class="botaoSalvar">Salvar Alterações</button>
      </div>
    
  </div>
</div>
   @endsection

@section('scripts')
@vite([ 'resources/js/editarcontaOwner.js', 'resources/js/configmenu.js'])
@endsection