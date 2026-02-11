<?php
class ContaPagar{

    private $id;
    private $valor;
    private $dataEmissao;
    private $dataVencimento;
    private $dataPagamento;
    private $status;
    private $ordemProducaoId;
    private $fornecedorId;
    private $usuarioId;

    public function __construct(
        $id = null,
        $valor = null,
        $dataEmissao = null,
        $dataVencimento = null,
        $dataPagamento = null,
        $status = null,
        $ordemProducaoId = null,
        $fornecedorId = null,
        $usuarioId = null
    ) {
        $this->id = $id;
        $this->valor = $valor;
        $this->dataEmissao = $dataEmissao;
        $this->dataVencimento = $dataVencimento;
        $this->dataPagamento = $dataPagamento;
        $this->status = $status;
        $this->ordemProducaoId = $ordemProducaoId;
        $this->fornecedorId = $fornecedorId;
        $this->usuarioId = $usuarioId;
    }

    // Getters e Setters aqui

    public function getId(){
        return $this->id;
    }
    public function setId($id) {
        $this->id = $id;
    }


    public function getValor() {
        return $this->valor;
    }
    public function setValor($valor) {
        $this->valor = $valor;
    }


    public function getDataEmissao(){
        return $this->dataEmissao;
    }
     public function setDataEmissao($dataEmissao) {
        $this->dataEmissao = $dataEmissao;
    }


    public function getDataVencimento(){
        return $this->dataVencimento;
    }
    
    public function setDataVencimento($dataVencimento){
        $this->dataVencimento = $dataVencimento;
    }

    public function getDataPagamento() {
        return $this->dataPagamento;
    }
    public function setDataPagamento($dataPagamento){
        $this->dataPagamento = $dataPagamento;
    }


    public function getStatus() {
        return $this->status;
    }
    public function setStatus($status){
        $this->status = $status;
    }


    public function getOrdemProducaoId() {
        return $this->ordemProducaoId;
    }
    public function setOrdemProducaoId($ordemProducaoId) {
        $this->ordemProducaoId = $ordemProducaoId;
    }


    public function getFornecedorId() {
        return $this->fornecedorId;
    }
    public function setFornecedorId($fornecedorId){
        $this->fornecedorId = $fornecedorId;
    }


    public function getUsuarioId() {
        return $this->usuarioId;
    }
    public function setUsuarioId($usuarioId)
    {
        $this->usuarioId = $usuarioId;
    }
}

?>