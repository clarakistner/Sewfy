import "./API_JS/api.js";
import { deleteCookie, getBaseUrl, setCookie } from "./API_JS/api.js";

const url = getBaseUrl();
document.addEventListener("DOMContentLoaded", async () => {

  // Exibe o email do usuário
  

  const data = await window.api.get('/empresa-usuario/usuario/empresas');
  const empresas = data.empresas;
  const select = document.getElementById("select-empresa");
  if (!select) return;

  if (empresas.length === 0) {
    const option = document.createElement("option");
    option.disabled = true;
    option.textContent = "Nenhuma empresa associada a esta conta.";
    select.appendChild(option);
    return;
  }

  try {
   
    
   Object.entries(empresas).forEach((emp) => {
      const option = document.createElement("option");
      option.value = emp[0];
      option.textContent = emp[1];
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
    const data = await window.api.post("/auth/define-empresa", body);
    deleteCookie("token");
    setCookie("token", data.token, 120);

    window.location.href = `${url}/home`;
  } catch (error) {
    console.error("Erro ao selecionar empresa:", error);
  }
}

