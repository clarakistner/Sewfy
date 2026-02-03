export class API {
    constructor(url = '/Sewfy/api/back/api.php') {
        this.url = url
    }

    async request(caminho, opcoes = {}) {
        const url = `${this.url}${caminho}`
        console.log('=== REQUISIÇÃO ===');
        console.log('URL:', url);
        console.log('Método:', opcoes.method || 'GET');
        console.log('Body:', opcoes.body);
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
            if (!response.ok) {
                throw new Error(dados.erro || 'Erro na requisição')
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
    
}
window.api = new API();
