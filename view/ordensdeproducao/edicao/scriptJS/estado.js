export const atualizaOP = { NovaQtdOP: 0, NovaQuebra: 0 }
export const atualizaOPINs = []

let listaInsumos = []
let listaFornecedores = []

export const setListaInsumos = (lista) => { listaInsumos = lista }
export const getListaInsumos = () => listaInsumos
export const setListaFornecedores = (lista) => { listaFornecedores = lista }
export const getListaFornecedores = () => listaFornecedores