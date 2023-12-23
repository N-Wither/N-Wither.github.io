const style = await fetch('/web-components/aquamarine/styles/showup.css').then(res => res.text())
const styleSheet = new CSSStyleSheet()
styleSheet.replaceSync(style)
document.adoptedStyleSheets.push(styleSheet)

export class AqShowup extends HTMLElement {

    constructor() {
        super()
    }

    repeat = false

    #observer = new IntersectionObserver(entries => {
        let entry = entries[0]
        if(entry.isIntersecting) {
            entry.target.animate([
                {
                    transform: 'translateY(100%)',
                    opacity: 0
                },
                {
                    transform: 'translateY(0)',
                    opacity: 1
                }
            ], {
                fill: 'forwards',
                duration: 600,
                easing: 'ease'
            })

            if(this.repeat == false) {
                this.#observer.unobserve(entry.target)
            }
        }
    })

    connectedCallback() {
        if(this.children.length == 0){
            this.#observer.observe(this)
        }
        else {
            for(let el of this.children) {
                this.#observer.observe(el)
            }
        }

        if(this.getAttribute('repeat') != null) {
            this.repeat = true
        }
    }

    disconnectedCallback() {
        this.#observer.disconnect()
    }
}

customElements.define('aq-showup', AqShowup)