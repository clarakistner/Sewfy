<?php
require_once __DIR__ . '/../../model/DAOs/OPInsumoDAO.php';
require_once __DIR__ . '/../../model/config/BancoDeDados.php';

function retornaCustotOP($idOP){
$conn = conecta_bd();
$opinDAO = new OPInsumoDAO($conn);
return (float) $opinDAO->somaCustotInsumos($idOP);
}

?>