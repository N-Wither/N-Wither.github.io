import parseCss from '/web-components/aquamarine/lib/parse-css.js'
const css = await fetch('/web-components/aquamarine/styles/badge.css').then(res => res.text())
const style = parseCss(css)
document.adoptedStyleSheets.push(style)

const template = `
<div class='badge__base'>
    <slot></slot>
</div>
`

export class AqBadge extends HTMLElement {
    constructor(){
        super()
    }

    connectedCallback(){
        this.attachShadow({mode: 'open'})
        this.shadowRoot.innerHTML = template
    }
}

customElements.define('aq-badge', AqBadge)