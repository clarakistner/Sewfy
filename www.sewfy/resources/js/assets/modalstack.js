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

export function clearStack() {
    stack.forEach(m => m.remove());
    stack.length = 0;
}