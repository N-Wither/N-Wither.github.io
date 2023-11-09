const style = await fetch('/web-components/aquamarine/progress/progress.css').then(resp => resp.text())
const styleSheet = new CSSStyleSheet()
styleSheet.replaceSync(style)

const template = 
`
    <div class='progress__bar'></div>
`

export class AqProgress extends HTMLElement {
    #value = 0
    #max = 0

    constructor() {
        super()
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = template
        this.shadowRoot.adoptedStyleSheets.push(styleSheet)

        /**
         * @type {HTMLElement}
         */
        this.progressElement = this.shadowRoot.querySelector('.progress__bar')
        this.#value = Number(this.getAttribute('value'))
        this.max = Number(this.getAttribute('max')) || 100

    }

    get value() {return this.#value}
    set value(v) {
        v = v / this.max
        v = (v > 1 || v < 0) ? (v > 1 ? 1 : 0) : v
        this.progressElement.style.transform = `scaleX(${v})`
        this.#value = v * this.max
        this.setAttribute('value', this.#value)
    }
    get max() {return this.#max}
    set max(v) {
        this.#max = v
        this.value = this.#value
        this.setAttribute('max', v)
    }
}

customElements.define('aq-progress', AqProgress)