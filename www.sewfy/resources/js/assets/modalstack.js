const stack = [];

export function pushModal(elemento) {
    stack.push(elemento);
    elemento.style.zIndex = 100 + stack.length * 50;
}

export function popModal() {
    const topo = stack.pop();
    topo?.remove();
    // Reexibe o modal anterior se existir
    const anterior = stack[stack.length - 1];
    if (anterior) anterior.style.display = 'flex';
}

// Desempilha sem remover do DOM — para modais que usam classe CSS para esconder (ex: hidden)
export function hideModal() {
    const topo = stack.pop();
    if (topo) topo.classList.add("hidden");
    const anterior = stack[stack.length - 1];
    if (anterior) anterior.style.display = 'flex';
}

export function clearStack() {
    stack.forEach(m => m.remove());
    stack.length = 0;
}