<?php

class OPInsumo{
private $OPIN_ID;
private $OPIN_UM;
private $OPIN_QTD;
private $OPIN_CUSTOU;
private $OPIN_CUSTOT;
private $PRODUTOS_PROD_ID;
private $ORDEM_PRODUCAO_OP_ID;
private $FORNECEDORES_CLIFOR_ID;


// CONSTRUTOR

public function __construct(){
    
}

// GETTERS E SETTERS 
public function getOPIN_ID()
{
return $this->OPIN_ID;
}

 
public function setOPIN_ID($OPIN_ID)
{
$this->OPIN_ID = $OPIN_ID;

return $this;
}

 
public function getOPIN_UM()
{
return $this->OPIN_UM;
}

 
public function setOPIN_UM($OPIN_UM)
{
$this->OPIN_UM = $OPIN_UM;

return $this;
}


public function getOPIN_QTD()
{
return $this->OPIN_QTD;
}


public function setOPIN_QTD($OPIN_QTD)
{
$this->OPIN_QTD = $OPIN_QTD;

return $this;
}


public function getOPIN_CUSTOU()
{
return $this->OPIN_CUSTOU;
}

 
public function setOPIN_CUSTOU($OPIN_CUSTOU)
{
$this->OPIN_CUSTOU = $OPIN_CUSTOU;

return $this;
}


public function getOPIN_CUSTOT()
{
return $this->OPIN_CUSTOT;
}

 
public function setOPIN_CUSTOT($OPIN_CUSTOT)
{
$this->OPIN_CUSTOT = $OPIN_CUSTOT;

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


public function getORDEM_PRODUCAO_OP_ID()
{
return $this->ORDEM_PRODUCAO_OP_ID;
}


public function setORDEM_PRODUCAO_OP_ID($ORDEM_PRODUCAO_OP_ID)
{
$this->ORDEM_PRODUCAO_OP_ID = $ORDEM_PRODUCAO_OP_ID;

return $this;
}

 
public function getFORNECEDORES_CLIFOR_ID()
{
return $this->FORNECEDORES_CLIFOR_ID;
}


public function setFORNECEDORES_CLIFOR_ID($FORNECEDORES_CLIFOR_ID)
{
$this->FORNECEDORES_CLIFOR_ID = $FORNECEDORES_CLIFOR_ID;

return $this;
}
}

?>