import { getCookie, deleteCookie } from "../API_JS/api";
import "../API_JS/api.js";
const API_BASE = "https://www.sewfy.com.br";

export function verificarAuth() {
    const token = decodeURIComponent(getCookie("token") ?? "");
    if (!token) {
        window.location.replace("/login-adm");
    }
}

export async function apiFetch(endpoint, options = {}) {
    const token = decodeURIComponent(getCookie("token") ?? "");
    await window.inicializarCsrf();
    const xsrfToken = decodeURIComponent(getCookie("XSRF-TOKEN") ?? "");
    console.log("XCSR: " + xsrfToken);
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        credentials: "include",
        "X-XSRF-TOKEN": xsrfToken,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        logout();
        return null;
    }

    return response;
}

export async function logout() {
    const token = decodeURIComponent(getCookie("token") ?? "");
    await window.inicializarCsrf();
    const xsrfToken = decodeURIComponent(getCookie("XSRF-TOKEN") ?? "");
    console.log("XCSR: " + xsrfToken);
    if (token) {
        try {
            await fetch(`${API_BASE}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });
        } catch (e) {
            console.warn("[LOGOUT] Erro ao invalidar token no servidor:", e);
        }
    }
    deleteCookie("email");
    deleteCookie("token");

    window.location.replace("/login-adm");
}
