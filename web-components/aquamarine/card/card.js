import css from '/web-components/aquamarine/lib/parse-css.js'

const style = await (await fetch('/web-components/aquamarine/card/card.css')).text()
const styleSheet = css(style)

const template = 
`
<div class='card__base' part='card-base'>
    <div part='card-image-container' class='card__image-container'>
        <slot name='image' part='image' class='card__image'></slot>
    </div>
    <div part='card-content' class='card__content'>
        <slot name='header' part='card-header' class='card__header'></slot>
        <slot part='card-body' class='card__body'></slot>
        <slot name='footer' part='card-footer' class='card__footer'></slot>
    </div>
</div>
`

document.adoptedStyleSheets.push(css(
    `aq-card img {
        width: 100%;
    }`
))

export class AqCard extends HTMLElement {
    constructor(){
        super()
        this.attachShadow({mode: 'open'})
        this.shadowRoot.innerHTML = template
        this.shadowRoot.adoptedStyleSheets.push(styleSheet)
    }

    connectedCallback() {
        let horizontal = this.getAttribute('horizontal')
        let base = this.shadowRoot.querySelector('.card__base')
        if(horizontal != null){
            base.classList.add('horizontal')
        }
        this.childNodes.forEach(el => {
            if(el.slot == 'image') base.classList.add('has-image')
            if(el.slot == 'header') base.classList.add('has-header')
            if(el.slot == 'footer') base.classList.add('has-footer')
        })
    }
}

customElements.define('aq-card', AqCard)