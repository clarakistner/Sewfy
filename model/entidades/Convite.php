<?php

class Convite
{
    private $CONV_ID;
    private $EMP_ID;
    private $CONV_EMAIL;
    private $CONV_TOKEN;
    private $CONV_EXPIRA;
    private $CONV_USADO;
    private $CONVIDADO_POR;

    public function __construct()
    {
        
    }
 
    public function getCONV_ID()
    {
        return $this->CONV_ID;
    }

    public function setCONV_ID($CONV_ID)
    {
        $this->CONV_ID = $CONV_ID;

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

    public function getCONV_EMAIL()
    {
        return $this->CONV_EMAIL;
    }

    public function setCONV_EMAIL($CONV_EMAIL)
    {
        $this->CONV_EMAIL = $CONV_EMAIL;

        return $this;
    }

    public function getCONV_TOKEN()
    {
        return $this->CONV_TOKEN;
    }
 
    public function setCONV_TOKEN($CONV_TOKEN)
    {
        $this->CONV_TOKEN = $CONV_TOKEN;

        return $this;
    }

    public function getCONV_EXPIRA()
    {
        return $this->CONV_EXPIRA;
    }

    public function setCONV_EXPIRA($CONV_EXPIRA)
    {
        $this->CONV_EXPIRA = $CONV_EXPIRA;

        return $this;
    }

    public function getCONV_USADO()
    {
        return $this->CONV_USADO;
    }
 
    public function setCONV_USADO($CONV_USADO)
    {
        $this->CONV_USADO = $CONV_USADO;

        return $this;
    }

    public function getCONVIDADO_POR()
    {
        return $this->CONVIDADO_POR;
    }

    public function setCONVIDADO_POR($CONVIDADO_POR)
    {
        $this->CONVIDADO_POR = $CONVIDADO_POR;

        return $this;
    }
}
