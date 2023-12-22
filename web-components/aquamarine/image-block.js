const style = await fetch('/web-components/aquamarine/styles/image-block.css').then(res => res.text())
const styleSheet = new CSSStyleSheet()
styleSheet.replaceSync(style)

const template = `
<div class='imgblk__base'>
    <div class='imgblk__img-wrapper'>
    <img class='imgblk__img'>
    </div>
    <div class='imgblk__caption'>
        <slot></slot>
    </div>
</div>
`

export class AqImageBlock extends HTMLElement {
    static observedAttributes = ['src', 'caption', 'width', 'height']

    #inited = false
    
    /**
     * @type {HTMLImageElement}
     */
    #imageElement
    /**
     * @type {HTMLDivElement}
     */
    #captionElement

    constructor(){
        super()
    }

    #init(){
        this.attachShadow({mode: 'open'})
        this.shadowRoot.adoptedStyleSheets.push(styleSheet)
        this.shadowRoot.innerHTML = template
        this.#imageElement = this.shadowRoot.querySelector('.imgblk__img')
        this.#captionElement = this.shadowRoot.querySelector('.imgblk__caption')
        this.src = this.getAttribute('src')
        this.caption = this.getAttribute('caption')
        if(Number(this.getAttribute('width')) > 0) {
            this.width = Number(this.getAttribute('width'))
        }
        if(Number(this.getAttribute('height')) > 0) {
            this.height = Number(this.getAttribute('height'))
        }
        this.#inited = true
    }

    #render(){

    }

    connectedCallback(){
        if(this.#inited == false){
            this.#init()
        }

    }

    attributeChangedCallback(name, oldvalue, newValue){
        if(this.#inited == false) {
            return
        }
        this[name] = newValue
    }

    get src() {
        return this.#imageElement.src
    }
    set src(s) {
        this.#imageElement.src = s
    }

    get caption() {
        return this.#imageElement.alt
    }
    set caption(c) {
        this.#imageElement.alt = c
        if(this.innerHTML == '' || this.innerHTML == this.caption) {
            this.innerHTML = c
        }
    }

    get width() {
        return this.#imageElement.width
    }
    set width(w) {
        this.#imageElement.width = w
        this.#captionElement.style.width = w + 'px'
    }

    get height() {
        return this.#imageElement.height
    }
    set height(h) {
        this.#imageElement.height = h
    }
}

customElements.define('aq-image-block', AqImageBlock)