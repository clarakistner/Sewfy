// Funções de validação para CPF e CNPJ
import { apenasNumeros } from "./mascaras.js";


// Valida CPF
export function validarCPF(cpf) {
    cpf = apenasNumeros(cpf);
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += cpf[i] * (10 - i);
    }

    let resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;
    if (resto != cpf[9]) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += cpf[i] * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10) resto = 0;

    return resto == cpf[10];
}


// Valida CNPJ
export function validarCNPJ(cnpj) {
    cnpj = apenasNumeros(cnpj);
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

    let tamanho = 12;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = 5;

    for (let i = 0; i < 12; i++) {
        soma += numeros[i] * pos--;
        if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos[0]) return false;

    soma = 0;
    pos = 6;
    for (let i = 0; i < 13; i++) {
        soma += cnpj[i] * pos--;
        if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    return resultado == digitos[1];
}


// Valida CPF ou CNPJ
export function validarCpfCnpj(valor) {
    const numero = apenasNumeros(valor);
    if (numero.length === 11) return validarCPF(numero);
    if (numero.length === 14) return validarCNPJ(numero);
    return false;
}
