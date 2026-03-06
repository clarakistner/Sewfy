document.addEventListener("DOMContentLoaded", async () => {
  console.log("[INIT] DOM carregado");

  const empresasIds = JSON.parse(
    sessionStorage.getItem("empresas_ids") || "[]",
  );
  const container = document.querySelector(".container");
  if (!container) return;
  if (empresasIds.length === 0) {
    container.innerHTML = "<p>Nenhuma empresa associada a esta conta.</p>";
    return;
  }
  try {
    const promises = empresasIds.map((id) => retornarNomeEmpresa(id));
    const nomes = await Promise.all(promises);
    empresasIds.forEach((id, index) => {
      const boxEmpresa = document.createElement("div");
      boxEmpresa.classList.add("box-empresa");
      boxEmpresa.id = id;
      console.log(`Criando box para empresa ID: ${id} com nome: ${nomes[index]}`);  
      boxEmpresa.innerHTML = `<h3>${nomes[index]}</h3>`;
      container.appendChild(boxEmpresa);
    });
  } catch (error) {
    console.error("Erro ao carregar empresas:", error);
    container.innerHTML =
      "<p>Erro ao carregar empresas. Tente novamente mais tarde.</p>";
  }
});

document.addEventListener("click", handleClick);

function handleClick(e) {
  if (e.target.closest(".box-empresa")) {
    const empresaId = e.target.closest(".box-empresa").id;
    selecionarEmpresa(empresaId);
  }
}

async function selecionarEmpresa(empresaId) {
  try {
    console.log(`Selecionando empresa com ID: ${empresaId}`);
    const body = { empresa_id: parseInt(empresaId) };
    const response = await window.api.post("/auth/define-empresa", body);
    sessionStorage.setItem("token", response.token);
    sessionStorage.setItem("empresa_id", response.empresa_id);
    window.location.href = "/www.sewfy/home";
  } catch (error) {
    console.error("Erro ao selecionar empresa:", error);
  }
}

async function retornarNomeEmpresa(id) {
  try {
    
    const response = await window.api.get(`/adm/empresa/nome/${parseInt(id)}`);

    return response.EMP_NOME;
  } catch (error) {
    console.error("Erro ao retornar nome da empresa:", error);
    return "Empresa Desconecatada";
  }
}
