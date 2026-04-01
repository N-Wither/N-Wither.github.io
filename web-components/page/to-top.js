import { LitElement, html, css } from 'https://esm.sh/lit@3.2.0';
import { toolboxItemStyle } from './toobox-item.style.js';
import '../aqv2/components/tooltip.js'
import '../aqv2/components/icon.js'
import { createLocalizer } from '../aqv2/lib/localize.js';

export class ToTop extends LitElement {
    constructor(){
        super()
    }

    static get properties() {
        return {
            showprogress: { type: Boolean },
            watch: {type: String}
        }
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

            button.activator {
                position: relative;
            }

            #prog {
                position: absolute;
                bottom: 0;
                width: 100%;
                border-radius: 0;
                height: 0.2rem;
            }

            ::-webkit-progress-bar {
                background-color: transparent;
            }

            ::-webkit-progress-value {
                background-color: var(--accent-color);
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

    /** @type {HTMLProgressElement} */
    get #prog() {
        return this.shadowRoot.querySelector('#prog')
    }

    /** @type {Element | Window} */
    get #target() {
        return document.querySelector(this.watch) ?? window
    }

    render(){
        return html`
        <div class='base'>
            <link rel='stylesheet' href='/assets/css/aquamarinev2/button.css'>
            <aq-tooltip>
                <button class='activator' @click=${this.scrollToTop} name=${this.#localize('1')}>
                    <aq-icon class='icon' name='arrow_upward'></aq-icon>
                    <div class='desc'>TOP</div>
                    ${ this.showprogress ? html`<progress id="prog" max="100"></progress>` : ''}
                </button>
                <div slot='tooltip'>${this.#localize('1')}</div>
            </aq-tooltip>
        </div>
        `
    }

    scrollToTop(){
        this.#target.scrollTo(0, 0)
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

        this.#target.addEventListener('scroll', () => { this._trackScroll() })
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

    _trackScroll(){
        if (!this.#prog) return
        const target = this.#target
        let value = 0
        if (target == window) {
            value = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100
        } else if (target instanceof Element) {
            const scrollTop = target.scrollTop
            const scrollHeight = target.scrollHeight
            const clientHeight = target.clientHeight
            const scrollableHeight = scrollHeight - clientHeight
            if (scrollHeight < 0) {
                value = 0
            } else {
                value = (scrollTop / scrollableHeight) * 100
            }
        }
        if(isNaN(value) == true) value = 100
        if(value > 100) value = 100
        this.#prog.value = value.toFixed(1)
    }
}

customElements.define('to-top', ToTop)