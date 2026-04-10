// VALIDACOES

import { converterMoedaParaNumero } from "../assets/mascaras"

// Verifica se todos os campos de quantidade da OP e dos insumos estao preenchidos e maiores que 0
export function verificaQuantidadesOPOPIN() {
  const camposQTD = document.querySelectorAll(".qtd")
  return Array.from(camposQTD).every(campo => {
    const valor = campo.value.trim()
    return valor !== "" && parseFloat(valor) > 0
  })
}

// Verifica se um elemento DOM existe
export function verificaCampo(campo) {
  return !!campo
}
export function verificaPrecosOPOPIN() {
  const camposPreco = document.querySelectorAll(".preco")
  return Array.from(camposPreco).every(campo => {
    const valor = converterMoedaParaNumero(campo.value)
    return valor !== "" && parseFloat(valor) > 0
  })
}