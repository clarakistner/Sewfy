import { mascaraTelefone } from "../assets/mascaras.js";
let timeout;
document.addEventListener("input", handleInput);

function handleInput(e) {
  if (e.target.closest("#barrapesquisa")) {
    console.log('Entrou no if do handleInput!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.log(String(e.target.value))
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      limparLista();
      pesquisaFuncionarios(String(e.target.value));

      
    }, 300);
  }
}
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
  const listaFuncionarios = await buscaTodosFuncionariosEmpresa();
  renderizaFuncionarios(listaFuncionarios);
}
export function limparLista() {
  const listaFuncionariosDOM = document.querySelector("#funcionarios-table");
  listaFuncionariosDOM.innerHTML = "";
}

function aplicaPesquisa(listaFun, valorPesquisa) {
  if (valorPesquisa) {
    listaFun = listaFun.filter((fun) =>{
      return fun.USU_NOME.trim().toLowerCase().includes(valorPesquisa.trim().toLowerCase()) || fun.USU_EMAIL.trim().toLowerCase().includes(valorPesquisa.trim().toLowerCase())
    },
    );
  }
  return listaFun;
}
async function pesquisaFuncionarios(valorPesquisa = null) {
  try {
    limparLista();
    let listaFuns = await buscaTodosFuncionariosEmpresa();
    listaFuns = aplicaPesquisa(listaFuns, valorPesquisa);
    renderizaFuncionarios(listaFuns);
  } catch (error) {
    console.log(`Erro ao listar os funcionarios pesquisados: ${error}`);
  }
}

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

  funcionarios.forEach((funcionario) => {
    const tr = document.createElement("tr");
    tr.classList.add("table-row");

    if (funcionario.USU_ATIV === 0) {
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

export function initGerenciarFuncionarios() {
  carregarFuncionarios();
}
