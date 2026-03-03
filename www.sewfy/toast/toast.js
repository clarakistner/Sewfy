export function mostrarToast(message, tipo = 'sucesso') {
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
    } else if (tipo === 'carregando') {
        toast.style.background = '#ffffff';
        toast.style.border = '3px solid #f0a500';
        toast.style.color = '#000';
    } else {
        toast.style.background = '#ffffff';
        toast.style.border = '3px solid #0e59fe';
        toast.style.color = '#000';
    }

    // Toast de carregando não some automaticamente
    if (tipo !== 'carregando') {
        setTimeout(() => toast.remove(), 10000);
    }

    return toast; // retorna o elemento para poder remover depois
}