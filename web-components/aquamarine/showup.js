const style = await fetch('/web-components/aquamarine/styles/showup.css').then(res => res.text())
const styleSheet = new CSSStyleSheet()
styleSheet.replaceSync(style)
document.adoptedStyleSheets.push(styleSheet)

export class AqShowup extends HTMLElement {

    constructor() {
        super()
    }

    #observer = new IntersectionObserver(entries => {
        let entry = entries[0]
        if(entry.intersectionRatio > 0) {
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

            this.#observer.unobserve(entry.target)
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
    }

    disconnectedCallback() {
        this.#observer.disconnect()
    }
}

customElements.define('aq-showup', AqShowup)