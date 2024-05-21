const template = 
`
<slot part='tabs' name='tabs'></slot>
<slot part='pages' name='pages'></slot>
`

const style = 
`
aq-tab {
    --tab-bg: var(--border-color);
}
.theme-dark aq-tab {
    --tab-bg: var(--border-color);
}

aq-tab {
    background: var(--background-color);
    display: block;
    transition: 0.2s;
}

aq-tab::part(tabs) {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    flex-direction: row;
    position: sticky;
    top: var(--header-height);
    z-index: 10;
}

aq-tab::part(pages) {
    border: 2px solid var(--tab-bg);
    display: block;
}

aq-tab-button, aq-tab-page {
    display:block;
}

aq-tab-button {
    flex-grow: 1;
}

aq-tab-button button {
    background-color: var(--tab-bg);
    background-image: linear-gradient(to top, var(--accent-color), var(--accent-color));
    background-position: bottom;
    background-repeat: no-repeat;
    background-size: 100% 0%;
    transition: 0.2s;
    border: none;
    padding: 0.8em;
    font-family: inherit;
    color: var(--text-color);
    width: 100%;
    height: 100%;
}

aq-tab-button button:hover, aq-tab-button button:focus {
    background-size: 100% 100%;
    filter: brightness(1.1);
}

aq-tab-button[open] button {
    background-size: 100% 100%;
    color: var(--text-color-contrast);
}

aq-tab-page {
    margin: 0em 0.8em;
    transition: 0.2s;
    background-color: var(--background-color);
    overflow: hidden;
}

aq-tab-page[open] {
    margin: 0.8em 0.8em;
}
`
const styleSheet = new CSSStyleSheet()
styleSheet.replaceSync(style)
document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet]


export class AqTab extends HTMLElement {
    constructor() {
        super()
        const sRoot = this.attachShadow({mode: 'open'})
        sRoot.innerHTML = template
    }

    connectedCallback() {
        const tabButtons = this.querySelectorAll('aq-tab-button')
        const pages = this.querySelectorAll('aq-tab-page')
        pages.forEach(el => {
            if(el.getAttribute('open') != null){
                el.style.maxHeight = el.scrollHeight + 'px'
            }else {
                el.style.maxHeight = '0px'
            }
        })
    }
}

export class AqTabButton extends HTMLElement {
    constructor() {
        super()
        this.innerHTML = `
        <button part='aq-tab-button' type='button'>
            ${this.innerHTML}
        </button>
        `
    }

    connectedCallback() {
        const tab = this.parentElement
        let buttons = tab.querySelectorAll('aq-tab-button')
        let button = this.querySelector('button[part=aq-tab-button]')
        button.addEventListener('click', () => {
            buttons.forEach(el => el.removeAttribute('open'))
            this.setAttribute('open', true)
            let index = this.getAttribute('index')
            let currntPage = tab.querySelector('aq-tab-page[open]')
            currntPage.removeAttribute('open')
            currntPage.style.maxHeight = '0px'
            let targetPage = tab.querySelector(`aq-tab-page[index="${index}"]`)
            targetPage.setAttribute('open', true)
            let calculatedHeight = targetPage.scrollHeight
            targetPage.style.maxHeight = calculatedHeight + 'px'

        })
    }
}

export class AqTabPage extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const tab = this.parentElement
    }
}

window.customElements.define('aq-tab', AqTab)
window.customElements.define('aq-tab-button', AqTabButton)
window.customElements.define('aq-tab-page', AqTabPage)