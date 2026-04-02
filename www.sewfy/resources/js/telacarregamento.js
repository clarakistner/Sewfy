import '../css/telacarregamento.css';

function getBaseUrl() {
  const meta = document.querySelector('meta[name="base-url"]');
  if (!meta) {
    console.error('Meta base-url não encontrada!');
    return '';
  }
  window.BASE_URL = meta.getAttribute('content');
  return meta.getAttribute('content');
}

export async function initTelaCarregamento(container = null) {
  const baseUrl = getBaseUrl();
  const alvo = container || document.body;
  if (alvo.querySelector("#fundo-fosco") || document.querySelector("#fundo-fosco"))

  try {
    if (document.querySelector("#fundo-fosco")) return;

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
