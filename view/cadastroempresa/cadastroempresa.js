function toggleSenha() {
            const input = document.getElementById('senha')
            const icone = document.getElementById('icone-senha')
            if (input.type === 'password') {
                input.type = 'text'
                icone.textContent = 'visibility_off'
            } else {
                input.type = 'password'
                icone.textContent = 'visibility'
            }
        }