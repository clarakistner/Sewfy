<?php

class Empresa{

    private $EMP_ID;
    private $EMP_NOME;
    private $EMP_RAZ;
    private $EMP_CNPJ;
    private $EMP_EMAIL;
    private $EMP_NUM;
    private $EMP_ATIV;
    private $EMP_DATAC;
    private $ADM_ID;

    public function __construct(
        $EMP_ID = null, $EMP_NOME = null, $EMP_RAZ = null, $EMP_CNPJ = null, $EMP_EMAIL = null, $EMP_NUM = null, $EMP_ATIV = null, $EMP_DATAC = null, $ADM_ID = null
    ) {
        $this-> EMP_ID = $EMP_ID;
        $this-> EMP_NOME = $EMP_NOME;
        $this-> EMP_RAZ = $EMP_RAZ;
        $this-> EMP_CNPJ = $EMP_CNPJ;
        $this-> EMP_EMAIL = $EMP_EMAIL;
        $this-> EMP_NUM = $EMP_NUM;
        $this-> EMP_ATIV = $EMP_ATIV;
        $this-> EMP_DATAC = $EMP_DATAC;
        $this-> ADM_ID = $ADM_ID;

    }

    public function getEMP_ID(){
        return $this->EMP_ID;
    }
    public function setEMP_ID($EMP_ID){
        return $this->EMP_ID = $EMP_ID;
    }

    public function getEMP_NOME(){
        return $this->EMP_NOME;
    }
    public function setEMP_NOME($EMP_NOME){
        return $this->EMP_NOME = $EMP_NOME;
    }

    public function getEMP_RAZ(){
        return $this->EMP_RAZ;
    }
    public function setEMP_RAZ($EMP_RAZ){
        return $this->EMP_RAZ = $EMP_RAZ;
    }

     public function getEMP_CNPJ(){
        return $this->EMP_CNPJ;
    }
    public function setEMP_CNPJ($EMP_CNPJ){
        return $this->EMP_CNPJ = $EMP_CNPJ;
    }

     public function getEMP_EMAIL(){
        return $this->EMP_EMAIL;
    }
    public function setEMP_EMAIL($EMP_EMAIL){
        return $this->EMP_EMAIL = $EMP_EMAIL;
    }

     public function getEMP_NUM(){
        return $this->EMP_NUM;
    }
    public function setEMP_NUM($EMP_NUM){
        return $this->EMP_NUM = $EMP_NUM;
    }

     public function getEMP_ATIV(){
        return $this->EMP_ATIV;
    }
    public function setEMP_ATIV($EMP_ATIV){
        return $this->EMP_ATIV = $EMP_ATIV;
    }

     public function getEMP_DATAC(){
        return $this->EMP_DATAC;
    }
    public function setEMP_DATAC($EMP_DATAC){
        return $this->EMP_DATAC = $EMP_DATAC;
    }

    public function getADM_ID(){
        return $this->ADM_ID;
    }
    public function setADM_ID($ADM_ID){
        return $this->ADM_ID = $ADM_ID;
    }

}

?>