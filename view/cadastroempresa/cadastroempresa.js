import { mostrarToast } from "../../toast/toast.js";
import { aplicarMascaraCpfCnpj, aplicarMascaraTelefone } from "../../assets/mascaras.js";                       
import { validarCpfCnpj } from "../../assets/validacoes.js";



function toggleSenha() {
    const input = document.getElementById('senha')
    const icone = document.getElementById('icone-senha')
        if (input.type === 'password') {
            input.type = 'text'
            icone.textContent = 'visibility_off'
        } else {
            input.type = 'password'
            icone.textContent = 'visibility'
        }
}