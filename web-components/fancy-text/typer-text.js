class TyperText extends HTMLElement {
    config = {
        speed: 100,
        html: false
    }

    constructor() {
        super()
        try {
            this.config.speed = window.moduleConfigs.TyperText.speed
            this.config.html = window.moduleConfigs.TyperText.html
        } catch (error) {
            // keep speed default
        }
    }

    connectedCallback() {
        let content = this.innerHTML
        let i = 0
        let show = false
        let currentContent = ''
        this.innerHTML = ''

        let observer = new IntersectionObserver(entries => {
            if(entries[0].intersectionRatio >= 1) {
                show = true
            }
        })

        observer.observe(this)

        let timer = setInterval(() => {
            if(i == content.length) {
                clearInterval(timer)
                observer.unobserve(this)
                return;
            }
            if(show == false) return;
            if(this.config.html) {
                currentContent += content[i]
                this.innerHTML = new DOMParser().parseFromString(currentContent, 'text/html').body.innerHTML
            }
            else {
                this.innerHTML += content[i]
            }
            i ++
        }, this.config.speed)
    }
}

window.customElements.define('typer-text', TyperText)