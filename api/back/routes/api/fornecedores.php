<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Fornecedores\CadastroFornecedorController;
use App\Http\Controllers\Fornecedores\EditarFornecedorController;
use App\Http\Controllers\Fornecedores\ListarFornecedoresController;
use App\Http\Controllers\Fornecedores\VisualizarFornecedorController;

Route::prefix('fornecedores')->group(function () {
    Route::get('/', [ListarFornecedoresController::class, 'listar']);
    Route::post('/', [CadastroFornecedorController::class, 'cadastrarFornecedor']);
    Route::get('/{id}', [VisualizarFornecedorController::class, 'visualizar']);
    Route::put('/{id}', [EditarFornecedorController::class, 'editarFornecedor']);
});