const API_BASE = 'http://localhost:8000';

export function verificarAuth() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        window.location.replace('/www.sewfy/loginadm/index.html');
    }
}

export async function apiFetch(endpoint, options = {}) {
    const token     = sessionStorage.getItem('token');
    const empresaId = sessionStorage.getItem('empresa_id');

    const headers = {
        'Content-Type': 'application/json',
        'Accept':       'application/json',
        ...(token     ? { 'Authorization': `Bearer ${token}` }   : {}),
        ...(empresaId ? { 'X-Empresa-Id': empresaId }            : {}),
        ...(options.headers || {})
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
    });

    if (response.status === 401) {
        logout();
        return null;
    }

    return response;
}

export async function logout() {
    const token = sessionStorage.getItem('token');

    if (token) {
        try {
            await fetch(`${API_BASE}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept':        'application/json',
                }
            });
        } catch (e) {
            console.warn('[LOGOUT] Erro ao invalidar token no servidor:', e);
        }
    }

    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('empresa_id');
    window.location.replace('/www.sewfy/loginadm/index.html');
}