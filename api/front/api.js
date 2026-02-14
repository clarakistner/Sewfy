// Importa a função de toast para exibir mensagens ao usuário
import { mostrarToast } from "/Sewfy/view/toast/toast.js"

// Classe responsável por realizar requisições à API
export class API {
    // Construtor que define a URL base da API
    constructor(url = '/Sewfy/api/back/api.php') {
        this.url = url
    }

    // Método genérico para realizar requisições HTTP
    async request(caminho, opcoes = {}) {
        const url = `${this.url}${caminho}`

        // Configuração padrão das requisições
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...opcoes.headers
            },
            ...opcoes
        }

        try {
            // Realiza a requisição
            const response = await fetch(url, config)

            // Lê a resposta como texto
            const text = await response.text()
            console.log(`Texto: ${text}`)

            // Converte o texto para JSON
            const dados = JSON.parse(text)

            // Exibe toast se houver mensagem de resposta
            if (!!dados.resposta) {
                mostrarToast(`${dados.resposta}`)
            }

            // Logs de debug
            console.log('Status da resposta:', response.status)
            console.log('Resposta do servidor:', dados)

            // Verifica se a requisição falhou
            if (!response.ok || dados.status === 'erro') {
                throw new Error(dados.resposta || dados.erro || 'Erro na requisição')
            }

            return dados
        } catch (error) {
            console.error(`Erro na API: ${error}`)
            throw error
        }
    }

    // Método para requisições POST
    async post(caminho, dados) {
        return this.request(caminho, {
            method: 'POST',
            body: JSON.stringify(dados)
        })
    }

    // Método para requisições PUT
    async put(caminho, dados) {
        return this.request(caminho, {
            method: 'PUT',
            body: JSON.stringify(dados)
        })
    }
    
    // Método para buscar recurso por ID
    async buscaId(caminho, id) {
        return this.request(`${caminho}/${id}`, {
            method: 'GET'
        })
    }

    // Método para requisições GET
    async get(caminho) {
        return this.request(caminho, {
            method: 'GET'
        })
    }
}

// Cria instância global da API disponível no objeto window
window.api = new API()