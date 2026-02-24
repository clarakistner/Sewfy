<?php

class SewfyAdm{

    private $ADM_ID;
    private $ADM_EMAIL;
    private $ADM_SENHA; 
    private $ADM_ATIV;
    private $ADM_DATAC;

    public function __construct(
        $ADM_ID = null,
        $ADM_EMAIL = null,
        $ADM_SENHA = null,
        $ADM_ATIV = null, 
        $ADM_DATAC = null
    ){
        $this-> ADM_ID = $ADM_ID;
        $this-> ADM_EMAIL = $ADM_EMAIL;
        $this-> ADM_SENHA = $ADM_SENHA;
        $this-> ADM_ATIV = $ADM_ATIV;
        $this-> ADM_DATAC = $ADM_DATAC;
    }


    public function getADM_ID(){
        return $this->ADM_ID;
    }
    public function setADM_ID($ADM_ID){
        return $this->ADM_ID = $ADM_ID;
    }

    public function getADM_EMAIL(){
        return $this->ADM_EMAIL;
    }
    public function setADM_EMAIL($ADM_EMAIL){
        return $this->ADM_EMAIL = $ADM_EMAIL;
    }

    public function getADM_SENHA(){
        return $this->ADM_SENHA;
    }
    public function setADM_SENHA($ADM_SENHA){
        return $this->ADM_SENHA = $ADM_SENHA;
    }

    public function getADM_ATIV(){
        return $this->ADM_ATIV;
    }
    public function setADM_ATIV($ADM_ATIV){
        return $this->ADM_ATIV = $ADM_ATIV;
    }

    public function getADM_DATAC(){
        return $this->ADM_DATAC;
    }
    public function setADM_DATAC($ADM_DATAC){
        return $this->ADM_DATAC = $ADM_DATAC;
    }
}

?>