import { LitElement, html, css } from 'https://esm.sh/lit@3.2.0';
import { toolboxItemStyle } from './toobox-item.style.js';
import '../aqv2/components/tooltip.js'
import '../aqv2/components/icon.js'
import { createLocalizer } from '../aqv2/lib/localize.js';

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

    static get lang(){
        return {
            'zh-cn': {
                '1': '回到顶部',
            },
            default: {
                1: 'Back to top'
            }
        }
    }

    #localize = createLocalizer(ToTop.lang)

    render(){
        return html`
        <div class='base'>
            <link rel='stylesheet' href='/assets/css/aquamarinev2/button.css'>
            <aq-tooltip>
                <button class='activator' @click=${this.scrollToTop} name=${this.#localize('1')}>
                    <aq-icon class='icon' name='arrow_upward'></aq-icon>
                    <div class='desc'>TOP</div>
                </button>
                <div slot='tooltip'>${this.#localize('1')}</div>
            </aq-tooltip>
        </div>
        `
    }

    scrollToTop(){
        window.scrollTo(0, 0)
        this.blur()
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
        this.style.maxHeight = 'var(--toolbox-width)'
        this.removeAttribute('tabindex')
    }

    hide(){
        this.style.removeProperty('max-height')
        this.setAttribute('tabindex', -1)
        this.blur()
    }
}

customElements.define('to-top', ToTop)