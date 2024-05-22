import '/web-components/aqv2/components/snackbar.js'

let keySequence = []

window.addEventListener('keydown', (event) => {
    keySequence.push(event.key)
    let string = keySequence.join(' ')
    let code = 'ArrowUp ArrowUp ArrowDown ArrowDown ArrowLeft ArrowRight ArrowLeft ArrowRight b a Enter'
    if(keySequence.length >= 11){
        if (string === code) {
            aqSnackbar({
                message: `<aq-translate key='konami'>30 extra lives!</aq-translate>`,
                html: true,
                icon: 'check',
                type: 'success',
            })
            keySequence.shift()
        }
        else keySequence.shift()
    }
})