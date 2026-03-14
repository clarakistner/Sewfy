function handleClick(e){}

async function abrirModal(){
    fecharModalVisualizacao();
    const data = await fetch("/www.sewfy/gerenciarfuncionarios/edicaoFuncionario/index.html").then((res) => {
    console.log("Status do fetch:", res.status);
    return res.text();
  });
  console.log("HTML carregado:", data);
  const telaGerenciar = document.querySelector(".gerenciarFuncionarios");
  if (!telaGerenciar) return;

  telaGerenciar.insertAdjacentHTML("afterbegin", data);
}

function fecharModalVisualizacao() {
  const modal = document.querySelector(".funcionariomodal");
  if (!modal) return;
  modal.remove();
}