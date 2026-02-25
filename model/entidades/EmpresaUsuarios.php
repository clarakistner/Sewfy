<?php

class EmpresaUsuarios
{
    private $EMP_ID;
    private $USU_ID;
    private $USU_E_PROPRIETARIO;
    private $USU_ATIV;

    public function __construct() {}
    public function getEMP_ID()
    {
        return $this->EMP_ID;
    }
    public function setEMP_ID($EMP_ID)
    {
        $this->EMP_ID = $EMP_ID;

        return $this;
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
    public function getUSU_E_PROPRIETARIO()
    {
        return $this->USU_E_PROPRIETARIO;
    }
    public function setUSU_E_PROPRIETARIO($USU_E_PROPRIETARIO)
    {
        $this->USU_E_PROPRIETARIO = $USU_E_PROPRIETARIO;

        return $this;
    }
    public function getUSU_ATIV()
    {
        return $this->USU_ATIV;
    }

    public function setUSU_ATIV($USU_ATIV)
    {
        $this->USU_ATIV = $USU_ATIV;

        return $this;
    }
}
