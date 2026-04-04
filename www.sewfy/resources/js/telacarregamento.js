
import { getBaseUrl } from './API_JS/api';

export async function initTelaCarregamento(container = null) {
  const baseUrl = getBaseUrl();
  const alvo = container || document.body;

  try {
    if (alvo.querySelector("#fundo-fosco") || document.querySelector("#fundo-fosco")) return;

    const dataResponse = await fetch(`${baseUrl}/tela-carregamento`);
    const dataText = await dataResponse.text();

    if (container) {
      container.insertAdjacentHTML("beforeend", dataText);
    } else {
      document.body.insertAdjacentHTML("afterbegin", dataText);
    }

  } catch (error) {
    console.log("Erro ao tentar importar js e css da tela de carregamento: " + error);
    throw error;
  }
}

export function removeTelaCarregamento() {
  document.querySelector(".fundo")?.remove();
}