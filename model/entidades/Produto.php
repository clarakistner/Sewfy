<?php

class Produto
{
    private $PROD_ID;
    private $PROD_UM;
    private $PROD_COD;
    private $PROD_NOME;
    private $PROD_DESC;
    private $PROD_TIPO;
    private $PROD_PRECO;
    private $PROD_ATIV;
    private $USUARIOS_USU_ID;

    //CONSTRUTOR
    
    public function __construct($cod, $nome, $desc, $tipo, $um, $preco, $ativ, $idUsuario){

        
        $this->PROD_COD = $cod;
        $this->PROD_NOME = $nome;
        $this->PROD_DESC = $desc;
        $this->PROD_TIPO = $tipo;
        $this->PROD_PRECO = $preco;
        $this->USUARIOS_USU_ID = $idUsuario;
        $this->PROD_UM = $um;
        $this->PROD_ATIV = $ativ;

    }

    // GETTERS E SETTERS
    public function getNomeProd()
    {
        return $this->PROD_NOME;
    }
    public function setNomeProd($nomeProd)
    {
        $this->PROD_NOME = $nomeProd;
    }
    public function getCodProd()
    {
        return $this->PROD_COD;
    }
    public function setCodProd($codProd)
    {
        $this->PROD_COD = $codProd;
    }
    public function getIdProd()
    {
        return $this->PROD_ID;
    }
    public function setIdProd($idProd)
    {
        $this->PROD_ID = $idProd;
    }
    public function getDescProd()
    {
        return $this->PROD_DESC;
    }
    public function setDescProd($descProd)
    {
        $this->PROD_DESC = $descProd;
    }
    public function getTipoProd()
    {
        return $this->PROD_TIPO;
    }
    public function setTipoProd($tipoProd)
    {
        $this->PROD_TIPO = $tipoProd;
    }
    public function getUmProd()
    {
        return $this->PROD_UM;
    }
    public function setUmProd($umProd)
    {
        $this->PROD_UM = $umProd;
    }
    public function getPrecoProd()
    {
        return $this->PROD_PRECO;
    }
    public function setPrecoProd($precoProd)
    {
        $this->PROD_PRECO = $precoProd;
    }
    public function getAtivProd()
    {
        return $this->PROD_ATIV;
    }
    public function setAtivProd($ativProd)
    {
        $this->PROD_ATIV = $ativProd;
    }
    public function getIdUsuProd()
    {
        return $this->USUARIOS_USU_ID;
    }
    public function setIdUsuProd($idUsuario)
    {
        $this->USUARIOS_USU_ID = $idUsuario;
    }

}

?>