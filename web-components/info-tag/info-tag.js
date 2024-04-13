const template = 
`
    <link rel="stylesheet" href="/assets/css/aquamarinev2/selection.css">
    <div part='icon'>
        <slot name='icon'></slot>
    </div>
    <div part='info'>
        <div part='name'>
            <slot name='title'></slot>
        </div>
        <div part='desc'>
            <slot></slot>
        </div>
    </div>
`
const style = `
info-tag {
    min-width: 16em;
    width: fit-content;
    height: fit-content;
    display: flex;
    flex-direction: row;
    border: 2px solid var(--border-color);
    padding: 0.1em;
    font-family: inherit;
}

info-tag ::selection {
    background-color: var(--accent-color-dk);
    color: var(--text-color-selected);
}

info-tag::part(icon) {
    width: 4em;
    height: 4em;
    padding: 0.2em;
}

info-tag::part(icon-image) {
    max-width: 100%;
    max-height: 100%;
}

info-tag::part(icon-text) {
    font-size: 2.4em;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

info-tag::part(info) {
    margin: 0 0.2em;
}

info-tag::part(name) {
    font-size: 1.2em;
    font-weight: bold;
}

info-tag::part(desc) {
    max-width: 11em;
}
`

const styleSheet = new CSSStyleSheet()
styleSheet.replaceSync(style)
document.adoptedStyleSheets.push(styleSheet)


class InfoTag extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({mode: 'open'})
    }

    connectedCallback() {
        const sRoot = this.shadowRoot
        sRoot.innerHTML = template
        let iconType = this.getAttribute('icon-type') || 'img'
        let name = this.getAttribute('tag') || 'Tag'
        let desc = this.getAttribute('desc') || 'Description'
        let icon = this.getAttribute('icon') || ''
        let iconContainer = sRoot.querySelector('[part=icon]')

        if(iconType == 'img'){
            let img = document.createElement('img')
            img.alt = 'icon'
            img.src = icon
            img.setAttribute('part', 'icon-image')
            iconContainer.appendChild(img)
        }
        else if (iconType == 'text') {
            let span = document.createElement('span')
            span.innerHTML = icon
            span.setAttribute('part', 'icon-text')
            iconContainer.appendChild(span)
        }

        if(this.innerHTML == ''){
            sRoot.querySelector('[part=name]').innerHTML = name
            sRoot.querySelector('[part=desc]').innerHTML = desc
        }
    }
}
window.customElements.define('info-tag', InfoTag)