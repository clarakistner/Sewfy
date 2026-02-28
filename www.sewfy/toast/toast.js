export function mostrarToast(message, tipo = 'sucesso') { // por padrão, tipo é 'sucesso'

    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    toast.innerText = message;
    document.body.appendChild(toast);

    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '5px';
    toast.style.zIndex = '1000';

    if (tipo === 'erro') {
        toast.style.background = '#ffffff';
        toast.style.border = '3px solid #ff4d4d';
        toast.style.color = '#000';
    } else {
        toast.style.background = '#ffffff';
        toast.style.border = '3px solid #0e59fe';
        toast.style.color = '#000';
    }

    setTimeout(() => toast.remove(), 10000);
}
