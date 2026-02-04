import { mostrarToast } from "/Sewfy/view/toast/toast.js"

export class API {
    constructor(url = '/Sewfy/api/back/api.php') {
        this.url = url
    }

    async request(caminho, opcoes = {}) {
        const url = `${this.url}${caminho}`

        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...opcoes.headers
            },
            ...opcoes
        }
        try {
            const response = await fetch(url, config)
            const dados = await response.json()
            if (!!dados.resposta) {
                mostrarToast(`${dados.resposta}`)
            }
            console.log('Status da resposta:', response.status);
            console.log('Resposta do servidor:', dados);

            if (!response.ok || dados.status === 'erro') {
                throw new Error(dados.resposta || dados.erro || 'Erro na requisição')
            }
            return dados;
        } catch (error) {
            console.error('Erro na API:', error);
            throw error;
        }
    }

    async post(caminho, dados) {
        return this.request(caminho, {
            method: 'POST',
            body: JSON.stringify(dados)
        })
    }

    async get(caminho) {
        return this.request(caminho, {
            method: 'GET'
        })
    }

}
window.api = new API();
