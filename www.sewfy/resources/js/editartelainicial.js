import { mostrarToast } from "./toast/toast.js";
import { carregarHome } from "./home.js";


document.addEventListener("click", (e) => {
  const container = document.querySelector(".editarTelaInicial");
  if (!container) return;

  if (e.target.closest(".botao")) {
    salvarConfig();
  }
});

document.addEventListener("change", (e) => {
  const container = document.querySelector(".editarTelaInicial");
  if (!container) return;

  if (e.target.id === "toggle-contas-pagar") {
    toggleFiltro("filtro-contas-pagar", e.target.checked);
  }
  if (e.target.id === "toggle-ordens") {
    toggleFiltro("filtro-ordens", e.target.checked);
  }
});

function toggleFiltro(id, visivel) {
  const filtro = document.getElementById(id);
  if (!filtro) return;
  filtro.classList.toggle("visivel", visivel);
}

async function carregarConfig() {
  try {
    const res = await window.api.get("/home/config");
    const config = res.config;

    const toggleContasPagar = document.getElementById("toggle-contas-pagar");
    const toggleOrdens      = document.getElementById("toggle-ordens");

    toggleContasPagar.checked = config.EXIBIR_CONTAS_PAGAR === 1;
    toggleOrdens.checked      = config.EXIBIR_ORDENS === 1;

    toggleFiltro("filtro-contas-pagar", toggleContasPagar.checked);
    toggleFiltro("filtro-ordens", toggleOrdens.checked);

    const radioContasPagar = document.querySelector(`input[name="filtro-contas-pagar"][value="${config.FILTRO_CONTAS_PAGAR}"]`);
    const radioOrdens      = document.querySelector(`input[name="filtro-ordens"][value="${config.FILTRO_ORDENS}"]`);

    if (radioContasPagar) radioContasPagar.checked = true;
    if (radioOrdens) radioOrdens.checked = true;

  } catch (error) {
    console.error("Erro ao carregar configuração:", error);
    mostrarToast("Erro ao carregar configuração", "erro");
  }
}

async function salvarConfig() {
  const container = document.querySelector(".editarTelaInicial");
  if (!container) return;

  const exibirContasPagar = container.querySelector("#toggle-contas-pagar")?.checked ?? false;
  const exibirOrdens      = container.querySelector("#toggle-ordens")?.checked ?? false;

  const filtroContasPagar = container.querySelector('input[name="filtro-contas-pagar"]:checked')?.value ?? "pendente";
  const filtroOrdens      = container.querySelector('input[name="filtro-ordens"]:checked')?.value ?? "aberta";

  const dados = {
    EXIBIR_CONTAS_PAGAR:   exibirContasPagar,
    FILTRO_CONTAS_PAGAR:   filtroContasPagar,
    EXIBIR_CONTAS_RECEBER: false,
    FILTRO_CONTAS_RECEBER: "pendente",
    EXIBIR_ORDENS:         exibirOrdens,
    FILTRO_ORDENS:         filtroOrdens,
  };

  try {
    const toast = mostrarToast("Salvando...", "carregando");
    await window.api.put("/home/config", dados);
    toast.remove();
    mostrarToast("Configuração salva com sucesso!");
    carregarHome();
  } catch (error) {
    console.error("Erro ao salvar configuração:", error);
    mostrarToast("Erro ao salvar configuração", "erro");
  }
}

export function initEditarTelaInicial() {
  carregarConfig();
}