import hljs from 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/es/highlight.min.js'

const style = `
aq-code {
    display: block;
    font-family: monospace;
    background-color: #262335;
    width: 100%;
    padding: 1em;
    font-size: 0.8em;
    white-space: pre-wrap;
    color: white;
    position: relative;
}

aq-code::before {
    content: attr(language);
    content: attr(display-language);
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.2em;
    background-color: #443964;
}

aq-code ::selection, aq-code::selection {
    background-color: #423f4f;
    color: inherit;
}

aq-code button.copy {
    position: absolute;
    top: 0.2em;
    right: 0.2em;
    background-color: #443964;
    font-family: 'Material Symbols Outlined';
    border: none;
    color: white;
    transition: 0.2s;
}

aq-code button.copy::before {
    content: '\\e14d';
}

aq-code button.copy:hover, aq-code button.copy:focus {
    filter: brightness(1.1);
}

.hljs-comment,
.hljs-quote {
    color: #d4d0ab;
}

.hljs-variable,
.hljs-template-variable,
.hljs-tag,
.hljs-name,
.hljs-selector-id,
.hljs-selector-class,
.hljs-regexp,
.hljs-deletion {
    color: #ff7edb;
}

.hljs-number,
.hljs-built_in,
.hljs-literal,
.hljs-type,
.hljs-params,
.hljs-meta,
.hljs-link {
    color: #2ee2fa;
}

.hljs-attribute,
.hljs-attr {
    color: #ffd700;
}

.hljs-string,
.hljs-symbol,
.hljs-bullet,
.hljs-addition {
    color: #ff8b39;
}

.hljs-title,
.hljs-section {
    color: #36f9f6;
}

.hljs-keyword,
.hljs-selector-tag {
    color: #fede5d;
}

.hljs-emphasis {
    font-style: italic;
}

.hljs-strong {
    font-weight: bold;
}

.hljs-title.class_ {
    color: #fe444f;
}

.hljs-title.function_ {
    color: #36f9f6;
}
`
const styleSheet = new CSSStyleSheet()
styleSheet.replaceSync(style)
document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet]

class AqCode extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback(){
        let lang = this.getAttribute('language')
        if(lang) {
            let highlighted = hljs.highlight(this.innerHTML, {language: lang})
            this.innerHTML = highlighted.value
        }
        else {
            this.innerHTML = hljs.highlightAuto(this.innerHTML).value
        }
        
        let copyButton = document.createElement('button')
        copyButton.classList.add('copy')
        copyButton.type = 'button'
        copyButton.title = 'Copy to Clipboard'
        this.appendChild(copyButton)

        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(this.innerText.substring())
        })
    }
}

window.customElements.define('aq-code', AqCode)