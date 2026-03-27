const CONFIGURACAO_ETAPAS = [
  { etapa: 1, idCirculo: "step-circle-1", idRotulo: "step-label-1", idConector: null },
  { etapa: 2, idCirculo: "step-circle-4", idRotulo: "step-label-4", idConector: "connector-1" },
  { etapa: 3, idCirculo: "step-circle-3", idRotulo: "step-label-3", idConector: "connector-2" },
];

const SVG_CONFIRMADO =
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" ` +
  `stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">` +
  `<polyline points="20 6 9 17 4 12"/></svg>`;

const iconeOriginalPorEtapa = {};

export function inicializarIconesOriginais() {
  CONFIGURACAO_ETAPAS.forEach(({ idCirculo }) => {
    const circulo = document.getElementById(idCirculo);
    if (circulo) iconeOriginalPorEtapa[idCirculo] = circulo.innerHTML;
  });
}

export function atualizarBarraProgresso(etapaAtual) {
  CONFIGURACAO_ETAPAS.forEach(({ etapa, idCirculo, idRotulo, idConector }) => {
    const circulo  = document.getElementById(idCirculo);
    const rotulo   = document.getElementById(idRotulo);
    const conector = idConector ? document.getElementById(idConector) : null;

    if (!circulo || !rotulo) return;

    circulo.classList.remove("active", "completed");
    rotulo.classList.remove("active", "completed");

    if (etapa < etapaAtual) {
      circulo.classList.add("completed");
      rotulo.classList.add("completed");
      circulo.innerHTML = SVG_CONFIRMADO;
      if (conector) conector.classList.add("completed");

    } else if (etapa === etapaAtual) {
      circulo.classList.add("active");
      rotulo.classList.add("active");
      circulo.innerHTML = iconeOriginalPorEtapa[idCirculo] || circulo.innerHTML;
      if (conector) conector.classList.add("completed");

    } else {
      circulo.innerHTML = iconeOriginalPorEtapa[idCirculo] || circulo.innerHTML;
      if (conector) conector.classList.remove("completed");
    }
  });
}