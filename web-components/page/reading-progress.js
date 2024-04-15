import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import { toolboxItemStyle } from './toobox-item.style.js';
import '../aqv2/components/tooltip.js'

export class ReadingProgress extends LitElement {
    constructor(){
        super()
        this.progress = 0
    }

    static get styles(){
        return [
            toolboxItemStyle,
            css`
            :host {
                display: block;
                overflow: hidden;
                max-height: 0px;
                transition: var(--transition-time-common);
            }
            `
        ]
    }

    static get properties(){
        return {
            progress: {type: Number}
        }
    }

    render(){
        return html`
        <div class='base'>
            <link rel='stylesheet' href='/assets/css/aquamarinev2/button.css'>
            <aq-tooltip>
                <button class='activator'>
                    <div class='icon'>\uef42</div>
                    <div class='desc'>${this.progress}%</div>
                </button>
                <div slot='tooltip'>Reading progress</div>
            </aq-tooltip>
        </div>
        `
    }

    connectedCallback(){
        super.connectedCallback()

        let observer = new IntersectionObserver(entries => {
            let target = entries[0]
            if(target.intersectionRatio <= 0){
                this.show()
            }
            else {
                this.hide()
            }
        })
        
        observer.observe(document.querySelector('h1'))

        window.addEventListener('scroll', () => {this.trackScroll()})
    }

    show(){
        this.style.maxHeight = 'var(--header-height)'
        this.removeAttribute('tabindex')
    }

    hide(){
        this.style.removeProperty('max-height')
        this.setAttribute('tabindex', 1)
    }

    trackScroll(){
        let value = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100
        if(isNaN(value) == true) value = 100
        this.progress = value.toFixed(0)
    }
}

customElements.define('reading-progress', ReadingProgress)