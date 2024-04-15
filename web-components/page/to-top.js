import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import { toolboxItemStyle } from './toobox-item.style.js';
import '../aqv2/components/tooltip.js'

export class ToTop extends LitElement {
    constructor(){
        super()
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

    render(){
        return html`
        <div class='base'>
            <link rel='stylesheet' href='/assets/css/aquamarinev2/button.css'>
            <aq-tooltip>
                <button class='activator' @click=${this.scrollToTop}>
                    <div class='icon'>\ue25a</div>
                    <div class='desc'>TOP</div>
                </button>
                <div slot='tooltip'>Back to top</div>
            </aq-tooltip>
        </div>
        `
    }

    scrollToTop(){
        window.scrollTo(0, 0)
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
    }

    show(){
        this.style.maxHeight = 'var(--header-height)'
        this.removeAttribute('tabindex')
    }

    hide(){
        this.style.removeProperty('max-height')
        this.setAttribute('tabindex', 1)
    }
}

customElements.define('to-top', ToTop)