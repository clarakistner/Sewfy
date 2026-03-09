import { mascaraTelefone } from "../assets/mascaras";

async function buscaTodosFuncionariosEmpresa() {
  try {
    const response = await window.api.get("/empresa-usuarios/funcionarios");
    const listaFuncionarios = Array.from(response.funcionarios);
    return listaFuncionarios;
  } catch (error) {
    console.log("Erro ao buscar funcionários: " + erro);
    throw error;
  }
}
async function carregarFuncionarios() {
  console.log("[FETCH] Buscando todos os funcionários");

  const tbody = document.getElementById("funcionarios-table");

  if (!tbody) {
    console.warn("[WARN] Tabela de funcionarios não encontrada");
    return;
  }

  tbody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align:center;">Carregando...</td>
            </tr>
        `;
  listaFuncionarios = await buscaTodosFuncionariosEmpresa();
  renderizaFuncionarios(listaFuncionarios);
}
function pesquisaFuncionarios() {}

function renderizaFuncionarios(funcionarios) {
    const tbody = document.getElementById("funcionarios-table");
        tbody.innerHTML = "";
    
        if (!Array.isArray(funcionarios) || funcionarios.length === 0) {
            tbody.innerHTML = `
                <tr class="linha-vazia">
                    <td colspan="3" class="mensagem-vazia">
                        Nenhum funcionário encontrado
                    </td>
                </tr>
            `;
            return;
        }
    
        funcionarios.forEach(funcionario => {
            const tr = document.createElement("tr");
            tr.classList.add("table-row");
    
            if (!funcionario.ativo) {
                tr.classList.add("funcionario-inativo");
            }
    
            tr.innerHTML = `
                <td class="table-cell">${funcionario.USU_NOME}</td>
                <td class="table-cell">${funcionario.USU_EMAIL}</td>
                <td class="table-cell">${mascaraTelefone(funcionario.USU_NUM)}</td>
                <td class="table-cell">
                    <button 
                        class="botao-visualizar-fornecedor"
                        data-id="${funcionario.USU_ID}"
                    >
                        <span class="material-symbols-outlined icone-visualizar-funcionario">
                            visibility
                        </span>
                    </button>
                </td>
            `;
    
            tbody.appendChild(tr);
        });
}

export function initGerenciarFuncionarios(){
    carregarFuncionarios();
}
