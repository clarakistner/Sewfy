document.addEventListener("DOMContentLoaded", async () => {

  // Exibe o email do usuário
  const usuarioEmail = sessionStorage.getItem("usuario_email");
  const emailEl = document.getElementById("usuario-email");
  if (emailEl && usuarioEmail) {
    emailEl.textContent = usuarioEmail;
  }

  const empresasIds = JSON.parse(
    sessionStorage.getItem("empresas_ids") || "[]",
  );
  const select = document.getElementById("select-empresa");
  if (!select) return;

  if (empresasIds.length === 0) {
    const option = document.createElement("option");
    option.disabled = true;
    option.textContent = "Nenhuma empresa associada a esta conta.";
    select.appendChild(option);
    return;
  }

  try {
    const promises = empresasIds.map((id) => retornarNomeEmpresa(id));
    const nomes = await Promise.all(promises);

    empresasIds.forEach((id, index) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = nomes[index];
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Erro ao carregar empresas:", error);
    const option = document.createElement("option");
    option.disabled = true;
    option.textContent = "Erro ao carregar empresas. Tente novamente.";
    select.appendChild(option);
  }

  // Botão continuar
  document.getElementById("btn-continuar")?.addEventListener("click", () => {
    const empresaId = select.value;
    if (!empresaId) return;
    selecionarEmpresa(empresaId);
  });
});

async function selecionarEmpresa(empresaId) {
  try {
    const body = { empresa_id: parseInt(empresaId) };
    const response = await window.api.post("/auth/define-empresa", body);
    window.location.href = `${window.BASE_URL}/home`;
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
    return "Empresa Desconectada";
  }
}