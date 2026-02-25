<?php 

class UsuarioModulos{
private $USU_ID;
private $EMP_ID;
private $MOD_ID;
private $CONCEDIDO_POR;
public function __construct()
{
    
} 
public function getUSU_ID()
{
return $this->USU_ID;
}
public function setUSU_ID($USU_ID)
{
$this->USU_ID = $USU_ID;

return $this;
}
public function getEMP_ID()
{
return $this->EMP_ID;
} 
public function setEMP_ID($EMP_ID)
{
$this->EMP_ID = $EMP_ID;

return $this;
}
public function getMOD_ID()
{
return $this->MOD_ID;
}
public function setMOD_ID($MOD_ID)
{
$this->MOD_ID = $MOD_ID;

return $this;
}

public function getCONCEDIDO_POR()
{
return $this->CONCEDIDO_POR;
}

public function setCONCEDIDO_POR($CONCEDIDO_POR)
{
$this->CONCEDIDO_POR = $CONCEDIDO_POR;

return $this;
}
}