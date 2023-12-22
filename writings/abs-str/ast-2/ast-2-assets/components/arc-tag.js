const style = await fetch('/writings/abs-str/ast-2/ast-2-assets/components/styles/arc-tag.css').then(res => res.text())
const styleSheet = new CSSStyleSheet()
styleSheet.replaceSync(style)

const accentStyle = 
`
arc-tag[level=1]{
    --accent-color: var(--green-500);
}
arc-tag[level='2']{
    --accent-color: var(--blue-500);
}
arc-tag[level=3]{
    --accent-color: var(--yellow-500);
}
arc-tag[level=4]{
    --accent-color: var(--orange-500);
}
arc-tag[level=5]{
    --accent-color: var(--red-500);
}
arc-tag[level=unknown]{
    --accent-color: var(--gray-700);
}
`
const accentStyleSheet = new CSSStyleSheet()
accentStyleSheet.replaceSync(accentStyle)
document.adoptedStyleSheets.push(accentStyleSheet)

const template =`
<div class='base'>
    <div class='icon' translate='no'></div>
    <div class='header'></div>
    <div class='desc'></div>
</div>
`

export default class ArcTag extends HTMLElement {
    constructor(){
        super()
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'})
        this.shadowRoot.innerHTML = template
        this.shadowRoot.adoptedStyleSheets.push(styleSheet)
        this.shadowRoot.querySelector('.icon').innerHTML = this.getAttribute('icon-src') ? `<image src="${this.getAttribute('icon-src')}"></image>` : this.getAttribute('icon-text')
        this.shadowRoot.querySelector('.header').innerHTML = this.getAttribute('header')
        this.shadowRoot.querySelector('.desc').innerHTML = this.getAttribute('desc')
    }
}