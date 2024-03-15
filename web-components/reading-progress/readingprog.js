const template = 
`
<div class='reading-progress__base'>
    <div class='reading-progress__text'></div>
    <progress class='reading-progress__progress' max='100' value='0'></progress>
</div>
`

const style = await fetch('/web-components/reading-progress/style.css').then(resp => resp.text())
const styleSheet = new CSSStyleSheet()
styleSheet.replaceSync(style)

export default class ReadingProgress extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback(){
        this.#render()
    }

    #render() {
        if(document.querySelectorAll('reading-progress').length > 1) {
            console.warn('Only 1 <reading-progress> can be used in the document!')
            this.remove()
            return
        }

        this.attachShadow({mode: 'open'}).innerHTML = template
        this.shadowRoot.adoptedStyleSheets.push(styleSheet)
        let text = this.getAttribute('text') || 'Reading Progress'
        this.shadowRoot.querySelector('.reading-progress__text').innerHTML = text
        this.#update()

        window.addEventListener('scroll', () => {
            this.#update()
        })

        let title = document.querySelector('.page-content .page-title')
        if(title) {
            let ob = new IntersectionObserver(entries => {
                if(entries[0].intersectionRatio == 0) {
                    this.animate([
                        {opacity: 0},
                        {opacity: 1}
                    ], {duration: 200, fill: 'forwards'})
                }
                else {
                    this.animate([
                        {opacity: 1},
                        {opacity: 0}
                    ], {duration: 200, fill: 'forwards'})
                }
            })
            ob.observe(title)
        }
    }

    #update() {
        let value = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100
        if(isNaN(value) == true) value = 100
        this.shadowRoot.querySelector('progress').value = value
    }
}

customElements.define('reading-progress', ReadingProgress)