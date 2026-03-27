

export const atualizaOP = { NovaQtdOP: 0, NovaQuebra: 0 }
export const atualizaOPINs = []

let listaInsumos = []
let listaFornecedores = []
let listaDOM = []
let insumosDeletados = []
let insumosInseridos = []

export const setListaInsumos = (lista) => { listaInsumos = lista }
export const getListaInsumos = () => listaInsumos
export const setListaFornecedores = (lista) => { listaFornecedores = lista }
export const getListaFornecedores = () => listaFornecedores
export const setListaDOM = (lista) => { listaDOM = lista }
export const getListaDOM = () => listaDOM
export const setInsumosDeletados = (lista) => { insumosDeletados = lista }
export const getInsumosDeletados = () => insumosDeletados
export const setInsumosInseridos = (lista) => { insumosInseridos = lista }
export const getInsumosInseridos = () => insumosInseridos