import { mostrarToast } from "../toast/toast.js";

export class API {
    constructor(url = "http://localhost:8000") {
        this.url = url;
        this.csrfInitializado = false;
        this.csrfCarregando = false;
        this.csrfRetry = false;
        this.redirecionando = false;
    }

    getCookie(name) {
        const match = document.cookie
            .split("; ")
            .find((row) => row.startsWith(name + "="));
        if (!match) return null;
        return match.substring(name.length + 1);
    }

    setCookie(name, value, minutos = 60) {
        const expires = new Date(
            Date.now() + minutos * 60 * 1000,
        ).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
    }

    deleteCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    popCookie(name) {
        const value = decodeURIComponent(this.getCookie(name) ?? "");
        this.deleteCookie(name);
        return value;
    }

    async inicializarCsrf() {
        if (this.csrfInitializado) return;
        if (this.csrfCarregando) return;

        this.csrfCarregando = true;

        try {
            const response = await fetch(`${this.url}/sanctum/csrf-cookie`, {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                this.csrfInitializado = true;
            }
        } catch (error) {
            console.error("[CSRF] Erro:", error);
        } finally {
            this.csrfCarregando = false;
        }
    }

    async request(caminho, opcoes = {}) {
        if (this.redirecionando) return;

        await this.inicializarCsrf();

        const url = `${this.url}/api${caminho}`;
        const xsrfToken = decodeURIComponent(
            this.getCookie("XSRF-TOKEN") ?? "",
        );
        const token = decodeURIComponent(this.getCookie("token") ?? "");
        const config = {
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": xsrfToken,
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...opcoes.headers,
            },
            ...opcoes,
        };

        try {
            const response = await fetch(url, config);

            if (response.status === 401) {
                if (!window.location.pathname.includes("/login")) {
                    if (!this.redirecionando) {
                        this.redirecionando = true;
                        this.setCookie("url_anterior", window.location.href);
                        window.location.replace("/login");
                    }
                }
                return;
            }

            if (response.status === 419) {
                if (this.csrfRetry) throw new Error("CSRF inválido após retry");
                this.csrfRetry = true;
                this.csrfInitializado = false;
                await this.inicializarCsrf();
                this.csrfRetry = false;
                return this.request(caminho, opcoes);
            }

            const text = await response.text();
            console.log(`[API] Resposta de ${url}:`, text);
            const dados = JSON.parse(text);

            if (dados.resposta) {
                mostrarToast(`${dados.resposta}`);
            }

            if (!response.ok || dados.status === "erro") {
                throw new Error(
                    dados.resposta || dados.erro || "Erro na requisição",
                );
            }

            return dados;
        } catch (error) {
            console.error(`Erro na API: ${error}`);
            throw error;
        }
    }

    async post(caminho, dados) {
        return this.request(caminho, {
            method: "POST",
            body: JSON.stringify(dados),
        });
    }

    async put(caminho, dados) {
        return this.request(caminho, {
            method: "PUT",
            body: JSON.stringify(dados),
        });
    }

    async buscaId(caminho, id) {
        return this.request(`${caminho}/${id}`, {
            method: "GET",
        });
    }

    async get(caminho) {
        return this.request(caminho, {
            method: "GET",
        });
    }

    async delete(caminho) {
        return this.request(caminho, {
            method: "DELETE",
        });
    }

    async deleteAll(caminho, dados) {
        return this.request(caminho, {
            method: "DELETE",
            body: JSON.stringify(dados),
        });
    }
}

export function getBaseUrl() {
    const meta = document.querySelector('meta[name="base-url"]');
    if (!meta) {
        console.error("Meta base-url não encontrada!");
        return "";
    }
    return meta.getAttribute("content");
}

export function getCookie(name) {
    const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith(name + "="));
    if (!match) return null;
    return match.substring(name.length + 1);
}

export function setCookie(name, value, minutos = 60) {
    const expires = new Date(Date.now() + minutos * 60 * 1000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function popCookie(name) {
    const value = decodeURIComponent(getCookie(name) ?? "");
    deleteCookie(name);
    return value;
}
window.api = new API();
window.inicializarCsrf = () => window.api?.inicializarCsrf();
