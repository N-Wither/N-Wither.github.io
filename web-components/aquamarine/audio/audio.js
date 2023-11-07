const style = await fetch('/web-components/aquamarine/audio/audio.css').then(resp => resp.text())
const styleSheet = new CSSStyleSheet()
styleSheet.replaceSync(style)
document.adoptedStyleSheets = document.adoptedStyleSheets.concat(styleSheet)

const template = 
`
<div></div>
`

export class AqAudio extends HTMLElement{
    constructor() {
        super()
        this.attachShadow({mode: 'open'}).innerHTML = template
    }
}

customElements.define('aq-audio', AqAudio)