const style = await (await fetch('/web-components/aquamarine/card/card.css')).text()
const styleSheet = new CSSStyleSheet()
styleSheet.replaceSync(style)
document.adoptedStyleSheets = document.adoptedStyleSheets.concat(styleSheet)

const template = 
`
<div part='card-image-container'>
    <slot name='image' part='image'></slot>
</div>
<div part='card-content'>
    <slot name='header' part='card-header'></slot>
    <slot part='card-body'></slot>
    <slot name='footer' part='card-footer'></slot>
</div>
`

export class AqCard extends HTMLElement {
    constructor(){
        super()
        this.attachShadow({mode: 'open'})
        this.shadowRoot.innerHTML = template
    }
}

customElements.define('aq-card', AqCard)