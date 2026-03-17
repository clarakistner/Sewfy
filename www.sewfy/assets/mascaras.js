// Retira todos os caracteres que não são números
export function apenasNumeros(valor = "") {
    return valor.replace(/\D/g, "");
}

// valores R$
export function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(valor);
}

// retira a máscara de valores
export function converterMoedaParaNumero(valorFormatado) {
    return parseFloat(
        valorFormatado
            .replace("R$", "")
            .replace(/\s/g, "")
            .replace(/\./g, "")
            .replace(",", ".")
    );
}

// Aplica máscara de moeda em um input enquanto digita
export function aplicarMascaraMoeda(input) {
    if (!input) return;

    input.addEventListener("input", () => {
        // Pega só os dígitos
        const apenasDigitos = input.value.replace(/\D/g, "");

        if (!apenasDigitos) {
            input.value = "";
            return;
        }

        // Converte para centavos e formata
        const numero = parseInt(apenasDigitos, 10) / 100;
        input.value = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(numero);
    });
}

// CPF / CNPJ
export function mascaraCpfCnpj(valor = "") {
    valor = apenasNumeros(valor);

    if (valor.length <= 11) {
        return valor
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    return valor
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
}

// Telefone
export function mascaraTelefone(valor = "") {
    valor = apenasNumeros(valor);

    if (valor.length > 11) valor = valor.slice(0, 11);

    return valor
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
}


// aplicar mascara de CPF/CNPJ em um input
export function aplicarMascaraTelefone(input) {
    if (!input) return;

    input.addEventListener("input", () => {
        input.value = mascaraTelefone(input.value);
    });
}

export function aplicarMascaraCpfCnpj(input) {
    if (!input) return;

    input.addEventListener("input", () => {
        input.value = mascaraCpfCnpj(input.value);
    });
}

// FORMATAR DATA
export function formatarData(data) {
    if (!data) return '—';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}
