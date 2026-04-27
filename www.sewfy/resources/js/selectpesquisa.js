/**
 * selectPesquisa.js
 * Componente de select customizado com campo de busca interno.
 *
 * Uso:
 *   const select = criarSelectPesquisa({
 *     triggerId:  "triggerFornecedor",
 *     dropdownId: "dropdownFornecedor",
 *     listaId:    "listaFornecedor",
 *     labelId:    "labelFornecedor",
 *     hiddenId:   "fornecedorValor",
 *     placeholder: "Selecione um fornecedor",
 *   });
 *
 *   select.setOpcoes([{ id: "1", value: "1", label: "João Silva" }]);
 *   select.getValue();   // retorna { id, value, label } da opção selecionada
 *   select.reset();      // limpa a seleção
 */

export function criarSelectPesquisa(config) {
    const {
        triggerId,
        dropdownId,
        listaId,
        labelId,
        hiddenId,
        placeholder = "Selecione...",
        onChange = null,
    } = config;

    let opcoes    = [];
    let selecionado = null;

    // ── Elementos ────────────────────────────────────────────────────────────
    const trigger  = () => document.getElementById(triggerId);
    const dropdown = () => document.getElementById(dropdownId);
    const lista    = () => document.getElementById(listaId);
    const label    = () => document.getElementById(labelId);
    const hidden   = () => hiddenId ? document.getElementById(hiddenId) : null;
    const input    = () => dropdown()?.querySelector(".select-pesquisa-input");

    // ── Renderiza opções filtradas ────────────────────────────────────────────
    function renderOpcoes(filtro = "") {
        const ul = lista();
        if (!ul) return;
        ul.innerHTML = "";

        const filtradas = opcoes.filter(op =>
            op.label.toLowerCase().includes(filtro.toLowerCase())
        );

        if (!filtradas.length) {
            const li = document.createElement("li");
            li.className    = "select-pesquisa-vazio";
            li.textContent  = "Nenhum item encontrado.";
            li.style.cssText = "padding:9px 14px; font-size:0.875rem; color:#9ca3af; cursor:default;";
            ul.appendChild(li);
            return;
        }

        filtradas.forEach(opcao => {
            const li = document.createElement("li");
            li.textContent      = opcao.label;
            li.dataset.id       = opcao.id;
            li.dataset.value    = opcao.value;
            if (selecionado?.id === opcao.id) li.classList.add("selecionado");
            li.addEventListener("click", () => selecionar(opcao));
            ul.appendChild(li);
        });
    }

    // ── Seleciona uma opção ──────────────────────────────────────────────────
    function selecionar(opcao) {
        selecionado = opcao;

        const lbl = label();
        if (lbl) lbl.textContent = opcao.label;

        const h = hidden();
        if (h) {
            h.value        = opcao.value;
            h.dataset.id   = opcao.id;
        }

        fechar();
        onChange?.(opcao);
    }

    // ── Abre / fecha dropdown ─────────────────────────────────────────────────
    function abrir() {
        const t = trigger();
        const d = dropdown();
        if (!t || !d) return;
        d.classList.add("aberto");
        t.classList.add("aberto");
        input()?.focus();
        renderOpcoes();
    }

    function fechar() {
        const t = trigger();
        const d = dropdown();
        if (!t || !d) return;
        d.classList.remove("aberto");
        t.classList.remove("aberto");
        if (input()) input().value = "";
    }

    // ── Inicializa listeners ──────────────────────────────────────────────────
    function inicializar() {
        const t = trigger();
        const d = dropdown();
        if (!t || !d) return;

        t.addEventListener("click", (e) => {
            e.stopPropagation();
            d.classList.contains("aberto") ? fechar() : abrir();
        });

        input()?.addEventListener("input", (e) => {
            renderOpcoes(e.target.value);
        });

        document.addEventListener("click", (e) => {
            if (!t.contains(e.target) && !d.contains(e.target)) {
                fechar();
            }
        });
    }

    // ── API pública ───────────────────────────────────────────────────────────
    return {
        inicializar,

        setOpcoes(novasOpcoes) {
            opcoes = novasOpcoes;
            renderOpcoes();
        },

        getValue() {
            return selecionado;
        },

        reset() {
            selecionado = null;
            const lbl = label();
            if (lbl) lbl.textContent = placeholder;
            const h = hidden();
            if (h) { h.value = ""; h.dataset.id = ""; }
            if (input()) input().value = "";
        },
    };
}