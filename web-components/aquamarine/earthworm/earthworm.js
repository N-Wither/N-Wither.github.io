const s = await fetch('/web-components/aquamarine/earthworm/earthworm.css').then(r => r.text())
const t = await fetch('/web-components/aquamarine/earthworm/earthworm.html').then(r => r.text())

const ss = new CSSStyleSheet()
ss.replaceSync(s)

export default class AqEarthworm extends HTMLElement {
    constructor(){
        super()
    }

    async connectedCallback(){
        // let p = this.getAttribute('prev-link')
        // let pt = this.getAttribute('prev-text')
        // let c = this.getAttribute('curr-link')
        // let ct = this.getAttribute('curr-text')
        // let n = this.getAttribute('next-link')
        // let nt = this.getAttribute('next-text')
        let sd = this.attachShadow({mode: 'open'})
        sd.innerHTML = t
        // let g = (a1, a2, a3) => a1 ? `<a href="${a1}">${a2 || a3}</a>` : `<span>${a2 || a3}</span>`

        sd.adoptedStyleSheets.push(ss)

        // sd.querySelector('.prev').innerHTML = g(p, pt, 'Previous')
        // sd.querySelector('.curr').innerHTML = g(c, ct, 'Current')
        // sd.querySelector('.next').innerHTML = g(n, nt, 'Next')
    }
}

if(!customElements.get('aq-earthworm')) {
    customElements.define('aq-earthworm', AqEarthworm)
}