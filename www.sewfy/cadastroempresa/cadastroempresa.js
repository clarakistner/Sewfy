
import { aplicarMascaraCpfCnpj, aplicarMascaraTelefone } from "./../assets/mascaras.js";

console.log("[DEBUG] Script cadastroEmpresas.js carregado!");

document.addEventListener('DOMContentLoaded', () => {

    console.log("[INIT] DOM carregado!");
    const nomeEmpInput = document.getElementById("nome");
    const cnpjEmpInput = document.getElementById("cnpj");
    const emailEmpInput = document.getElementById("email");
    const numEmpInput = document.getElementById("telefone");
    const razEmpInput = document.getElementById("razao-social");

    aplicarMascaraCpfCnpj(cnpjEmpInput);
    aplicarMascaraTelefone(numEmpInput);

});