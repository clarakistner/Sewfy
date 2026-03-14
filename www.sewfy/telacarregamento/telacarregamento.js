export async function initTelaCarregamento() {
  try {
    const [cssResponse, dataResponse] = await Promise.all([
      fetch("/www.sewfy/telacarregamento/telacarregamento.css"),
      fetch("/www.sewfy/telacarregamento/index.html"),
    ]);
    const [cssText, dataText] = await Promise.all([cssResponse.text(), dataResponse.text()]);

    
    document.body.insertAdjacentHTML("afterbegin",dataText)
    const script = document.createElement("script");
    script.id = "js-telaC";
    script.type = "module";
    script.src = "/www.sewfy/telacarregamento/telacarregamento.js";

    const style = document.createElement("style");
    style.id = "css-telaC";
    style.innerHTML = cssText;

    document.head.appendChild(style);
    document.body.appendChild(script);
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
  document.querySelector("#js-telaC")?.remove();
}
