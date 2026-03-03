const API_BASE = 'http://localhost:8000';

// =============================================================
// VERIFICAÇÃO DE AUTH
// Chame verificarAuth() no topo de cada página protegida
// =============================================================
export function verificarAuth() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.replace('/www.sewfy/loginadm/index.html');
    }
}


// =============================================================
// FETCH AUTENTICADO
// Use apiFetch() no lugar de fetch() em todas as requisições
// =============================================================
 export async function apiFetch(endpoint, options = {}) {
    const token = sessionStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers || {})
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
    });

    // Token expirado ou inválido
    if (response.status === 401) {
        logout();
        return null;
    }

    return response;
}


// =============================================================
// LOGOUT
// =============================================================
export async function logout() {
    const token = sessionStorage.getItem('token');

    if (token) {
        try {
            await fetch(`${API_BASE}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
        } catch (e) {
            console.warn('[LOGOUT] Erro ao invalidar token no servidor:', e);
        }
    }

    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email');
    window.location.replace('/www.sewfy/loginadm/index.html');
}


// =============================================================
// UTILITÁRIOS
// =============================================================
function getToken() {
    return sessionStorage.getItem('token');
}

function getEmail() {
    return sessionStorage.getItem('email');
}