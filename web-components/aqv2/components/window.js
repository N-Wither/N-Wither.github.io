import css from "/web-components/aqv2/lib/css.js";
import html from "/web-components/aqv2/lib/html.js";

const style = await fetch('/web-components/aqv2/styles/window.css').then(res => res.text())
const globalStyle = await fetch('/web-components/aqv2/styles/window_global.css').then(res => res.text())
const template = html`
<div class='aqwindow__base'>
    <div class='aqwindow__titlebar' draggable='true'>
        <slot name='title' class='aqwindow__name'></slot>
        <div class='aqwindow__control'>
            <div class='control'>
                <button class='minimize' title='Minimize'> - </button>
            </div>
            <div class='control'>
                <button class='maximize' title='Maximize'> o </button>
            </div>
            <div class='control'>
                <button class='close' title='Close'> x </button>
            </div>
        </div>
    </div>
    <div class='aqwindow__body' style='min-width:10em; min-height:4em;'>
        <slot></slot>
    </div>
</div>
`

document.adoptedStyleSheets.push(css(globalStyle))

export default class AqWindow extends HTMLElement {
    constructor(){
        super()
    }

    static style = {
        local: css(style),
        global: css(globalStyle)
    }
    static template = template
    static windows = []
    static observedAttributes = ['float', 'width', 'height']

    #rendered = false
    #maximized = false
    #minimized = false
    #opened = true
    #float = false
    #width = '100%'
    #height = '100%'

    #currentX
    #currentY
    #mouseOffsetX
    #mouseOffsetY

    #base
    #closeBtn
    #maximizeBtn
    #minimizeBtn
    /**@type {HTMLDivElement} */
    #body
    /**@type {HTMLDivElement} */
    #titlebar

    #pin(){
        this.style.zIndex = 1000
        AqWindow.windows.forEach(w => {
            if(w !== this) w.style.removeProperty('z-index')
        })
    }

    #render(){
        if(this.#rendered === false){
            this.attachShadow({mode: 'open'})
        }
        // this.shadowRoot.innerHTML = AqWindow.template.innerHTML
        if(this.style.left === '') this.style.left = '0px'
        if(this.style.top === '') this.style.top = '0px'
        this.shadowRoot.appendChild(AqWindow.template.cloneNode(true))
        this.shadowRoot.adoptedStyleSheets.push(AqWindow.style.local)
        this.#rendered = true
        if(AqWindow.windows.includes(this) === false){
            AqWindow.windows.push(this)
        }

        this.#base = this.shadowRoot.querySelector('.aqwindow__base')
        this.#closeBtn = this.shadowRoot.querySelector('.control .close')
        this.#maximizeBtn = this.shadowRoot.querySelector('.control .maximize')
        this.#minimizeBtn = this.shadowRoot.querySelector('.control .minimize')
        this.#body = this.shadowRoot.querySelector('.aqwindow__body')
        this.#titlebar = this.shadowRoot.querySelector('.aqwindow__titlebar')
        this.#currentX = this.offsetLeft
        this.#currentY = this.offsetTop

        this.width = this.#width
        this.height = this.#height

        this.#closeBtn.addEventListener('click', () => {
            this.close()
        })
        this.#maximizeBtn.addEventListener('click', () => {
            this.maximize()
        })
        this.#minimizeBtn.addEventListener('click', () => {
            this.minimize()
        })
        this.#titlebar.addEventListener('dragstart', (e) => {
            this.#currentX = this.offsetLeft
            this.#currentY = this.offsetTop
            this.#mouseOffsetX = e.offsetX
            this.#mouseOffsetY = e.offsetY
            this.#maximized = false
            this.#pin()
        })
        this.#titlebar.addEventListener('dragend', (e) => {
            if(this.float === true){
                this.style.left = e.clientX - this.#mouseOffsetX + 'px'
                this.style.top = e.clientY - this.#mouseOffsetY + 'px'
            }
            else if(this.offsetParent !== null){
                let rect = this.offsetParent.getBoundingClientRect()
                let x = e.clientX - this.#mouseOffsetX - rect.x
                let y = e.clientY - this.#mouseOffsetY - rect.y
                let maxX = rect.width - this.offsetWidth
                let maxY = rect.height - this.offsetHeight
                if(x > maxX) x = maxX
                if(x < 0) x = 0
                if(y > maxY) y = maxY
                if(y < 0) y = 0
                this.style.left = x + 'px'
                this.style.top = y + 'px'
            }
            this.#currentX = this.offsetLeft
            this.#currentY = this.offsetTop
        })
        this.#body.addEventListener('resize', (e) => {
            console.log('resize');
        })
        this.addEventListener('click', () => {
            this.#pin()
        })
    }

    close(){
        this.style.display = 'none'
        this.#opened = false
    }

    open(){
        this.style.display = 'block'
        this.#opened = true
    }

    maximize(){
        if(this.#maximized === false){
            if(this.offsetParent !== null){
                this.#body.style.minWidth = this.offsetParent.clientWidth + 'px'
                this.#body.style.minHeight = this.offsetParent.clientHeight + 'px'
            }
            else {
                this.#body.style.minWidth = document.documentElement.offsetWidth + 'px'
                this.#body.style.minHeight = window.innerHeight + 'px'
            }
            this.#currentX = this.offsetLeft
            this.#currentY = this.offsetTop
            this.style.left = 0
            this.style.top = 0
            this.#maximized = true

            if(this.#minimized === true){
                this.minimize()
            }
        }
        else {
            this.style.left = this.#currentX + 'px'
            this.style.top = this.#currentY + 'px'
            this.#body.style.minWidth = '10em'
            this.#body.style.minHeight = '4em'
            this.#body.style.maxWidth = this.width
            this.#body.style.maxHeight = this.height
            this.#maximized = false
        }
    }

    minimize(){
        if(this.#minimized === false){
            this.#body.style.display = 'none'
            this.#minimized = true

            if(this.#maximized === true){
                this.maximize()
            }
        }
        else {
            this.#body.style.removeProperty('display')
            this.#minimized = false
        }
    }

    connectedCallback(){
        if(this.#rendered === false){
            this.#render()
        }
    }

    attributeChangedCallback(name, oldValue, newValue){
        switch(name){
            case 'float': {
                if(newValue === 'false' || newValue === null){
                    this.float = false
                }
                else if(newValue === 'true' || newValue === ''){
                    this.float = true
                }
                else break
                break
            }
            case 'width': {
                if(oldValue === newValue) return;
                this.width = newValue
                break
            }
            case 'height': {
                if(oldValue === newValue) return;
                this.height = newValue
                break
            }
        }
    }

    get minimized(){
        return this.#minimized
    }
    set minimized(v){
        if(this.#minimized === v) return
        else this.minimize()
    }

    get maximized(){
        return this.#maximized
    }
    set maximized(v){
        if(this.#maximized === v) return
        else this.maximize()
    }

    get opened(){
        return this.#opened
    }
    set opened(v){
        if(this.#opened === v) return
        else if(this.#opened === false && v === true) this.open()
        else this.close()
    }

    get float(){
        return this.#float
    }
    set float(v){
        if(v === true){
            if(this.getAttribute('float') === null){
                this.setAttribute('float', '')
            }
            this.#float = true
        }
        else if(v === false){
            if(this.getAttribute('float') !== null){
                this.removeAttribute('float')
            }
            this.style.removeProperty('left')
            this.style.removeProperty('top')
            this.#float = false
        }
    }

    get width(){
        return this.#width
    }
    set width(v){
        if(this.#body) this.#body.style.maxWidth = v;
        this.#width = v
        this.setAttribute('width', v)
    }

    get height(){
        return this.#height
    }
    set height(v){
        if(this.#body) this.#body.style.maxHeight = v;
        this.#height = v
        this.setAttribute('height', v)
    }
}

customElements.define('aq-window', AqWindow)