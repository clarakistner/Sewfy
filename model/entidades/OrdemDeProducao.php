<?php

class OrdemDeProducao
{
    private $OP_ID;
    private $OP_QTD;
    private $OP_DATAA;
    private $OP_DATAE;
    private $OP_CUSTOU;
    private $OP_CUSTOT;
    private $OP_CUSTOUR;
    private $OP_QTDE;
    private $OP_QUEBRA;
    private $USUARIOS_USU_ID;
    private $PRODUTOS_PROD_ID;


    // CONSTRUTOR
    public function __construct()
    {
        
    }

    // GETTERS E SETTERS
    public function getOP_ID()
    {
        return $this->OP_ID;
    }

     
    public function setOP_ID($OP_ID)
    {
        $this->OP_ID = $OP_ID;

        return $this;
    }

  
    public function getOP_QTD()
    {
        return $this->OP_QTD;
    }

    
    public function setOP_QTD($OP_QTD)
    {
        $this->OP_QTD = $OP_QTD;

        return $this;
    }

   
    public function getOP_DATAA()
    {
        return $this->OP_DATAA;
    }

   
    public function setOP_DATAA($OP_DATAA)
    {
        $this->OP_DATAA = $OP_DATAA;

        return $this;
    }

   
    public function getOP_DATAE()
    {
        return $this->OP_DATAE;
    }

   
    public function setOP_DATAE($OP_DATAE)
    {
        $this->OP_DATAE = $OP_DATAE;

        return $this;
    }

    public function getOP_CUSTOU()
    {
        return $this->OP_CUSTOU;
    }

  
    public function setOP_CUSTOU($OP_CUSTOU)
    {
        $this->OP_CUSTOU = $OP_CUSTOU;

        return $this;
    }

  
    public function getOP_CUSTOT()
    {
        return $this->OP_CUSTOT;
    }

    
    public function setOP_CUSTOT($OP_CUSTOT)
    {
        $this->OP_CUSTOT = $OP_CUSTOT;

        return $this;
    }
    

    
    public function getOP_CUSTOUR()
    {
        return $this->OP_CUSTOUR;
    }

  
    public function setOP_CUSTOUR($OP_CUSTOUR)
    {
        $this->OP_CUSTOUR = $OP_CUSTOUR;

        return $this;
    }

  
    public function getOP_QTDE()
    {
        return $this->OP_QTDE;
    }

  
    public function setOP_QTDE($OP_QTDE)
    {
        $this->OP_QTDE = $OP_QTDE;

        return $this;
    }

   
    public function getOP_QUEBRA()
    {
        return $this->OP_QUEBRA;
    }

  
    public function setOP_QUEBRA($OP_QUEBRA)
    {
        $this->OP_QUEBRA = $OP_QUEBRA;

        return $this;
    }

   
    public function getUSUARIOS_USU_ID()
    {
        return $this->USUARIOS_USU_ID;
    }

  
    public function setUSUARIOS_USU_ID($USUARIOS_USU_ID)
    {
        $this->USUARIOS_USU_ID = $USUARIOS_USU_ID;

        return $this;
    }

   
    public function getPRODUTOS_PROD_ID()
    {
        return $this->PRODUTOS_PROD_ID;
    }

   
    public function setPRODUTOS_PROD_ID($PRODUTOS_PROD_ID)
    {
        $this->PRODUTOS_PROD_ID = $PRODUTOS_PROD_ID;

        return $this;
    }
}

?>