
export async function initTelaCarregamento(container = null) {
  
  const alvo = container || document.body;
  if (
    alvo.querySelector("#fundo-fosco") ||
    document.querySelector("#fundo-fosco")
  )
    return;
  try {
    if (document.querySelector("#fundo-fosco")) return;
    const [cssResponse, dataResponse] = await Promise.all([
      fetch("/www.sewfy/telacarregamento/telacarregamento.css"),
      fetch("/www.sewfy/telacarregamento/index.html"),
    ]);
    const [cssText, dataText] = await Promise.all([
      cssResponse.text(),
      dataResponse.text(),
    ]);

    if (container) {
      
      container.insertAdjacentHTML("beforeend", dataText);
    } else {
      
      document.body.insertAdjacentHTML("afterbegin", dataText);
    }

    const style = document.createElement("style");
    style.id = "css-telaC";
    style.innerHTML = cssText;

    document.head.appendChild(style);
  } catch (error) {
  
    console.log(
      "Erro ao tentar importar js e css da tela de carregamento: " + error,
    );
    throw error;
  }
}

export function removeTelaCarregamento() {

  document.querySelector(".fundo")?.remove();
  document.querySelector("#css-telaC")?.remove();
}
