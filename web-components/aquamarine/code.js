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
    --color-regexp: #911f3f;
}

:is(.dark-mode, .theme-dark) aq-code {
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
    --color-regexp: #f97e72;
}

aq-code {
    --aq-code-fs: 0.8em;
    display: block;
    font-family: monospace;
    background-color: var(--bg-color);
    width: 100%;
    padding: 2em 1em 1em 1em;
    font-size: var(--aq-code-fs);
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

aq-code .code__area span {
    line-height: var(--aq-code-fs);
}

.code__base {
    display: flex;
}
.code__lines {
    color: var(--text-color-secondary);
    user-select: none;
}
.code__area {
    padding-left: 0.8em;
}

.hljs-comment,
.hljs-quote {
    color: var(--color-comment);
}

.hljs-variable,
.hljs-template-variable,
.hljs-selector-id,
.hljs-selector-class,
.hljs-deletion {
    color: var(--color-var);
}

.hljs-regexp {
    color: var(--color-regexp);
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
document.adoptedStyleSheets.push(styleSheet)

const template = 
`
<div class='code__base'>
    <div class='code__lines'></div>
    <div class='code__area'></div>
</div>
`

class AqCode extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback(){
        let lang = this.getAttribute('language')
        if(this.getAttribute('display-language') == null){
            this.setAttribute('display-language', lang)
        }
        let content = this.innerHTML
        let codeArea = this
        if(this.getAttribute('inline') == null){
            this.innerHTML = template
            codeArea = this.querySelector('.code__area')
            codeArea.innerHTML = content
            content = content.replace('\n', '')
            let lineNumber = content.match(/\n/ig).length
            for(let i = 0; i < lineNumber; i ++) {
                this.querySelector('.code__lines').innerHTML += `${i+1}\n`
            }
        }

        if(this.getAttribute('src') != null) {
            content = (await fetch(this.getAttribute('src'))).text()
        }

        codeArea.innerHTML = content
        codeArea.classList.add(`lang-${lang}`)
        if(lang){
            hljs.highlightElement(codeArea)
        }
        
        if(this.getAttribute('inline') == null){
            let copyButton = document.createElement('button')
            copyButton.classList.add('copy')
            copyButton.type = 'button'
            copyButton.title = 'Copy to Clipboard'
            this.appendChild(copyButton)
            copyButton.addEventListener('click', () => {
                if(navigator.clipboard){
                    navigator.clipboard.writeText(codeArea.innerText.trim())
                }
                else {
                    let input = document.createElement('input')
                    input.setAttribute('value', codeArea.innerText.trim())
                    document.body.appendChild(input)
                    input.select()
                    document.execCommand('copy')
                    document.body.removeChild(input)
                }
            })
        }

    }
}

window.customElements.define('aq-code', AqCode)