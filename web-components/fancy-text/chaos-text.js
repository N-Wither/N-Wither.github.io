export class ChaosText extends HTMLElement {
    constructor() {
        super()
        try {
            this.chars = window.moduleConfigs.chaosText.chars
        } catch (error) {
            this.chars = '0123456789/\\abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ~!@#$%^&_+-=*|<>?;:{}'
        }
    }

    connectedCallback() {
        let textLength = parseInt(this.getAttribute('length')) || 10
        setInterval(() => {
            let out = ''
            for(let i = 0; i < textLength; i++) {
                out += this.chars[Math.floor(Math.random() * this.chars.length)]
            }
            this.innerText = out
        }, 100)
    }
}

window.customElements.define('chaos-text', ChaosText)