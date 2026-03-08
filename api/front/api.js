import { mostrarToast } from "../../www.sewfy/toast/toast.js";

export class API {
    constructor(url = 'http://localhost:8000/api') {
        this.url = url;
    }

    async request(caminho, opcoes = {}) {
        const url       = `${this.url}${caminho}`;
        const empresaId = sessionStorage.getItem('empresa_id');

        const config = {
            headers: {
                'Content-Type':  'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                ...(empresaId ? { 'X-Empresa-Id': empresaId } : {}),
                ...opcoes.headers
            },
            ...opcoes
        };

        try {
            const response = await fetch(url, config);

            const text = await response.text();
            console.log(`Texto: ${text}`);
            console.log(`Status HTTP: ${response.status}`);

            const dados = JSON.parse(text);

            if (!!dados.resposta) {
                mostrarToast(`${dados.resposta}`);
            }

            if (!response.ok || dados.status === 'erro') {
                throw new Error(dados.resposta || dados.erro || 'Erro na requisição');
            }

            return dados;

        } catch (error) {
            console.error(`Erro na API: ${error}`);
            throw error;
        }
    }

    async post(caminho, dados) {
        return this.request(caminho, {
            method: 'POST',
            body:   JSON.stringify(dados)
        });
    }

    async put(caminho, dados) {
        return this.request(caminho, {
            method: 'PUT',
            body:   JSON.stringify(dados)
        });
    }

    async buscaId(caminho, id) {
        return this.request(`${caminho}/${id}`, {
            method: 'GET'
        });
    }

    async get(caminho) {
        return this.request(caminho, {
            method: 'GET'
        });
    }

    async delete(caminho) {
        return this.request(caminho, {
            method: 'DELETE'
        });
    }

    async deleteAll(caminho, dados) {
        return this.request(caminho, {
            method: 'DELETE',
            body:   JSON.stringify(dados)
        });
    }
}

window.api = new API();