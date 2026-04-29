<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ConviteController;
use Illuminate\Http\Request;

Route::get('/', function () {
    return view('login');
});
Route::get('/confirmar-email',  function (){
    
    return view('confirmar-email');
});
Route::get('/home',  function (){
    return view('home');
});
Route::get('/cadastro-empresa',  function (){
    
    return view('cadastro-empresa');
});
Route::get('/cadastro-fornecedor',  function (){
    
    return view('cadastro-fornecedor');
});
Route::get('/cadastro-funcionario',  function (){
    
    return view('cadastro-funcionario');
});
Route::get('/cadastro-produto',  function (){
    
    return view('cadastro-produto');
});
Route::get('/cadastro-conta-pagar', function () {
    return view('cadastro-conta-pagar');
});
Route::get('/configadm',  function (){
    
    return view('configadm');
});
Route::get('/configmenu',  function (){
    
    return view('configmenu');
});
Route::get('/confirmar-cadastro',  function (Request $request){
    
    return view('confirmar-cadastro');
});
Route::get('/confirmar-fechamento',  function (){
    
    return view('confirmar-fechamento');
});
Route::get('/confirmar-fechamento.css',  function (){
    
    return response()->file(resource_path('css/confirmar-fechamento.css'));
});
Route::get('/contas',  function (){
    
    return view('contas');
});
Route::get('/convite',  function (){
    
    return view('convite');
});
Route::get('/criar-ordemdeproducao',  function (){
    
    return view('criar-ordemdeproducao');
});
Route::get('/editar-empresa',  function (){
    
    return view('editar-empresa');
});
Route::get('/editar-funcionario',  function (){
    
    return view('editar-funcionario');
});
Route::get('/editar-ordemdeproducao',  function (){
    
    return view('editar-ordemdeproducao');
});
Route::get('/editar-conta',  function (){
    
    return view('editar-proprietario');
});
Route::get('/editar-tela-inicial',  function (){
    
    return view('editar-tela-inicial');
});
Route::get('/fornecedores',  function (){
    
    return view('fornecedores');
});
Route::get('/funcionarios',  function (){
    
    return view('funcionarios');
});
Route::get('/home-adm',  function (){
    
    return view('home-adm');
});
Route::get('/home',  function (){
    
    return view('home');
});
Route::get('/login-adm',  function (){
    
    return view('login-adm');
});
Route::get('/login',  function (){
    
    return view('login');
});
Route::get('/menu-adm',  function (){
    
    return view('menu-adm');
});
Route::get('/menu',  function (){
    
    return view('menu');
});
Route::get('/modal-ordem',  function (){
    
    return view('modal-ordem');
});
Route::get('/ordensdeproducao',  function (){
    
    return view('ordensdeproducao');
});
Route::get('/produtos',  function (){
    
    return view('produtos');
});
Route::get('/redefinir-senha',  function (){
    
    return view('redefinir-senha');
});
Route::get('/relatorios-adm',  function (){
    
    return view('relatorios-adm');
});
Route::get('/selecionar-empresa',  function (){
    
    return view('selecionar-empresa');
});
Route::get('/tela-carregamento',  function (){
    
    return view('tela-carregamento');
});

Route::get('/visualizar-conta',  function (){
    
    return view('visualizar-conta');
});
Route::get('/visualizar-fornecedor',  function (){
    
    return view('visualizar-fornecedor');
});
Route::get('/visualizar-produto',  function (){
    
    return view('visualizar-produto');
});
Route::get('/modal-modo-edicao', function () {
    return view('modalmodoedicao');
});
