import hljs from 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/es/highlight.min.js'

const style = `
aq-code {
    --bg-color: #fff;
    --bg-color-2: #f8f8f8;
    --bg-color-select: #add6ff;
    --color-all: #333;
    --color-comment: #008000;
    --color-var: #0070c1;
    --color-tag: #800000;
    --color-number: #588658;
    --color-attr: #e50000;
    --color-string: #a31515;
    --color-title: #36f9f6;
    --color-class: #267f99;
    --color-function: #795e26;
    --color-keyword: #0000ff;
    --color-property: #001080;
    --color-literal: #0000ff;
}

.dark-mode aq-code {
    --bg-color: #262335;
    --bg-color-2: #443964;
    --bg-color-select: #423f4f;
    --color-all: #fff;
    --color-comment: #848bbd;
    --color-var: #ff7edb;
    --color-tag: #68e7b8;
    --color-number: #2ee2fa;
    --color-attr: #ffd700;
    --color-string: #ff8b39;
    --color-title: #36f9f6;
    --color-class: #fe444f;
    --color-function: #36f9f6;
    --color-keyword: #fede5d;
    --color-property: #2ee2fa;
    --color-literal: #f97e72;
}

aq-code {
    display: block;
    font-family: monospace;
    background-color: var(--bg-color);
    width: 100%;
    padding: 2em 1em;
    font-size: 0.8em;
    white-space: pre-wrap;
    color: var(--color-all);
    position: relative;
    transition: 0.2s;
    overflow: auto;
    box-sizing: border-box;
    margin: 1em 0;
}

aq-code[inline] {
    display: inline;
    white-space: initial;
    padding: 0.1em 0.2em;
    width: fit-content;
}

aq-code::before {
    content: attr(language);
    content: attr(display-language);
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.2em;
    background-color: var(--bg-color-2);
}

aq-code[inline]::before {
    display: none;
}

aq-code ::selection, aq-code::selection {
    background-color: var(--bg-color-select);
    color: inherit;
}

aq-code button.copy {
    position: absolute;
    top: 0.2em;
    right: 0.2em;
    background-color: var(--bg-color-2);
    font-family: 'Material Symbols Outlined';
    border: none;
    color: var(--color-all);
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
    color: var(--color-comment);
}

.hljs-variable,
.hljs-template-variable,
.hljs-selector-id,
.hljs-selector-class,
.hljs-regexp,
.hljs-deletion {
    color: var(--color-var);
}

.hljs-tag,
.hljs-name {
    color: var(--color-tag);
}

.hljs-number,
.hljs-built_in,
.hljs-type,
.hljs-params,
.hljs-meta,
.hljs-link {
    color: var(--color-number);
}

.hljs-literal {
    color: var(--color-literal);
}

.hljs-attribute,
.hljs-attr {
    color: var(--color-attr);
    font-style: italic;
}

.hljs-property {
    color: var(--color-property);
}

.hljs-string,
.hljs-symbol,
.hljs-bullet,
.hljs-addition {
    color: var(--color-string);
}

.hljs-title,
.hljs-section {
    color: var(--color-title);
}

.hljs-title.class_ {
    color: var(--color-class);
}

.hljs-title.function_ {
    color: var(--color-function);
}

.hljs-keyword,
.hljs-selector-tag {
    color: var(--color-keyword)
}

.hljs-emphasis {
    font-style: italic;
}

.hljs-strong {
    font-weight: bold;
}
`
const styleSheet = new CSSStyleSheet()
styleSheet.replaceSync(style)
document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet]

class AqCode extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback(){
        let lang = this.getAttribute('language')
        let content = this.innerHTML
        if(this.getAttribute('src') != null) {
            content = await (await fetch(this.getAttribute('src'))).text()
        }
        if(lang) {
            let highlighted = hljs.highlight(content, {language: lang})
            this.innerHTML = highlighted.value
        }
        else {
            this.innerHTML = hljs.highlightAuto(content).value
        }
        
        if(this.getAttribute('inline') == null){
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
}

window.customElements.define('aq-code', AqCode)