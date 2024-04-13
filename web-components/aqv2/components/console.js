import css from "/web-components/aqv2/lib/css.js";
import html from "/web-components/aqv2/lib/html.js";

const style = await fetch('/web-components/aqv2/styles/console.css').then(res => res.text())
const globalStyle = await fetch('/web-components/aqv2/styles/console_global.css').then(res => res.text())
const template = `
<div class='aqconsole__base'>
    <div class='aqconsole__out'></div>
    <div class='aqconsole__in'>
        <textarea class='inputfield' type='text'></textarea>
    </div>
</div>
`

document.adoptedStyleSheets.push(css(globalStyle))

export default class AqConsole extends HTMLElement {
    constructor(){
        super()
    }

    static style = {
        local: css(style),
        global: css(globalStyle)
    }
    static template = html(template)
    static observedAttributes = ['lines', 'input']

    #rendered = false

    /**@type {HTMLTextAreaElement} */
    #inputfield
    /**@type {HTMLDivElement} */
    #outputfield

    #lines = 127

    #render(){
        // if(this.#rendered === false){
        //     this.attachShadow({mode: 'open'})
        // }
        // this.shadowRoot.appendChild(AqConsole.template.cloneNode(true))
        // this.shadowRoot.adoptedStyleSheets.push(AqConsole.style.local)
        this.innerHTML = ''
        this.appendChild(AqConsole.template.cloneNode(true))
        this.#rendered = true
        this.#inputfield = this/*.shadowRoot*/.querySelector('.inputfield')
        this.#outputfield = this/*.shadowRoot*/.querySelector('.aqconsole__out')
        this.#inputfield.addEventListener('keydown', (e) => {
            if(e.key === 'Enter' && e.shiftKey === false){
                let value
                try {
                    value = Function('return ' + this.#inputfield.value)()
                } catch (error) {
                    this.log(error)
                }
                this.log(value)
                this.#inputfield.value = ''
            }
        })
    }

    #createDiv(){
        return document.createElement('div')
    }

    #addElement(el){
        this.#outputfield.appendChild(el)
        while(this.#outputfield.childElementCount > this.#lines){
            let first = this.#outputfield.firstChild
            this.#outputfield.removeChild(first)
        }
        this.scrollTo(0, this.scrollHeight)
    }

    #text(html = false, type = 'info', ...data){
        let string = data.join(' ')
        let div = this.#createDiv()
        div.classList.add('aqconsole__entry', type)
        if(html === true){
            div.innerHTML = string
        }
        else {
            div.innerText = string
        }
        this.#addElement(div)
    }

    connectedCallback(){
        if(this.#rendered === false){
            this.#render()
        }
    }

    attributeChangedCallback(attr, oldValue, newValue){
        switch(attr){
            case 'lines': {
                if(oldValue === newValue) return
                this.lines = Number(newValue)
            }
        }
    }

    log(...data){
        this.#text(false, 'info', ...data)
    }

    warn(...data){
        this.#text(false, 'warn', ...data)
    }

    error(...data){
        this.#text(false, 'error', ...data)
    }

    html(h){
        this.#text(true, 'html', h)
    }

    clear(){
        this.#outputfield.innerHTML = ''
    }

    table(data){
        let head = []
        let body = []
        let table = document.createElement('table')
        let thead = document.createElement('thead')
        let tbody = document.createElement('tbody')
        let tr = document.createElement('tr')
        let th = document.createElement('th')
        let td = document.createElement('td')
        table.appendChild(thead)
        table.appendChild(tbody)
        
        if(data == undefined){
            return
        }
        else if(Array.isArray(data) === false){
            if(typeof data === 'object'){
                head = Object.keys(data)
                data = [data]
            }
            else {
                this.log(data)
                return
            }
        }
        else {
            data.forEach((o, i) => {
                let keys = Object.keys(o)
                let values = Object.values(o)
                keys.forEach(k => {
                    if(head.includes(k) === false){
                        head.push(k)
                    }
                })
                body[i] = values
            })
        }

        thead.appendChild(tr.cloneNode(true))
        head.forEach(k => {
            let h = th.cloneNode(true)
            h.innerHTML = k
            let r = thead.querySelector('tr')
            r.appendChild(h)
        })
        data.forEach((obj, i) => {
            let r = tr.cloneNode(true)
            r.classList.add('row-' + i)
            tbody.appendChild(r)
            head.forEach(key => {
                let d = td.cloneNode(true)
                d.innerHTML = obj[key]
                r.appendChild(d)
            })
        })

        table.classList.add('aqconsole__entry')
        this.#addElement(table)
    }

    get lines(){
        return this.#lines
    }
    set lines(v){
        if(isNaN(Number(v)) === false){
            this.#lines = Number(v)
        }
        this.setAttribute('lines', Number(v))
    }
}

customElements.define('aq-console', AqConsole)