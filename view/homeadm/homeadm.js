function filtrarEmpresas() {
    const busca = document.getElementById('input-busca').value.toLowerCase()
    const status = document.getElementById('select-status').value
    const cards = document.querySelectorAll('.empresa-card')
    let visiveis = 0

    cards.forEach(card => {
        const nome = card.dataset.nome.toLowerCase()
        const cnpj = card.dataset.cnpj.toLowerCase()
        const cardStatus = card.dataset.status

        const bateTexto = nome.includes(busca) || cnpj.includes(busca)
        const bateStatus = status === 'todas' || cardStatus === status

        if (bateTexto && bateStatus) {
            card.style.display = ''
            visiveis++
        } else {
            card.style.display = 'none'
        }
    })

    document.getElementById('sem-resultados').style.display = visiveis === 0 ? 'block' : 'none'
}