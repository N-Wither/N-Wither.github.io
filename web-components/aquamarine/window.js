import css from '/web-components/aquamarine/lib/parse-css.js'

const style = await fetch('/web-components/aquamarine/styles/badge.css').then(res => res.text())

const template = `
<div class='aqwindow__base'>
    <div class='aqwindow__titlebar'>
        <slot name='title'></slot>
    </div>
    <div class='aqwindow__body'>
        <slot></slot>
    </div>
</div>
`

export default class AqWindow extends HTMLElement {
    static template = template
    static style = css(style)
    static allWindows = []

    #rendered = false

    constructor() {
        super()
    }

    connectedCallback(){
        if(this.#rendered === false){this.#render()} else return
    }

    #render(){
        this.attachShadow({mode: 'open'})
        this.shadowRoot.innerHTML = AqWindow.template
        this.shadowRoot.adoptedStyleSheets.push(AqWindow.style)
        this.#rendered = true
    }
}

customElements.define('aq-window', AqWindow)