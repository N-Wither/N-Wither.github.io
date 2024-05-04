import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import { toolboxItemStyle } from './toobox-item.style.js';
import '../aqv2/components/tooltip.js'
import '../aqv2/components/icon.js'
import { createLocalizer } from '../aqv2/lib/localize.js';

/**@extends {HTMLElement} */
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

            .table-of-contents {
                position: fixed;
                right: calc(var(--header-height) + 2em);
                top: calc(var(--header-height) + 1em);
                background: var(--background-color);
                box-shadow: 0px 4px 8px var(--shadow-color);
                padding: 1em;
                z-index: 98;
                max-width: 70vw;
                max-height: 50vh;
                overflow: auto;
            }

            .table-of-contents.closed {
                display: none;
            }
            `
        ]
    }

    static get properties(){
        return {
            progress: {type: Number}
        }
    }

    static get lang(){
        return {
            'zh-cn': {
                1: '阅读进度。',
                2: '点击打开/关闭目录。',
            },
            default: {
                1: 'Reading progress.',
                2: 'Click to open/close table of contents.'
            }
        }
    }

    #localize = createLocalizer(ReadingProgress.lang)

    render(){
        let desc = this.#localize('1') + (this.childElementCount > 0 ? this.#localize('2') : '')

        return html`
        <div class='base'>
            <link rel='stylesheet' href='/assets/css/aquamarinev2/button.css'>
            <aq-tooltip>
                <button class='activator' @click=${this.toggleTable} name=${desc}>
                    <aq-icon class='icon' name='toc'></aq-icon>
                    <div class='desc'>${this.progress}%</div>
                </button>
                <div slot='tooltip'>${desc}</div>
            </aq-tooltip>
            <div class='table-of-contents ${this.childElementCount == 0 ? 'closed' : ''}'>
                <slot></slot>
            </div>
        </div>
        `
    }

    connectedCallback(){
        super.connectedCallback()

        if(this.childElementCount == 0){
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
        else {
            this.show()
        }

        window.addEventListener('scroll', () => {this.trackScroll()})
    }

    show(){
        this.style.maxHeight = 'var(--header-height)'
        this.removeAttribute('tabindex')
    }

    hide(){
        this.style.removeProperty('max-height')
        this.setAttribute('tabindex', -1)
        this.blur()
    }

    trackScroll(){
        let value = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100
        if(isNaN(value) == true) value = 100
        if(value > 100) value = 100
        this.progress = value.toFixed(0)
    }

    toggleTable(){
        /**@type {HTMLDivElement} */
        let table = this.shadowRoot?.querySelector('.table-of-contents')
        let keyframes = [
            {transform: 'translateX(20%)', opacity: 0},
            {transform: 'translateX(0%)', opacity: 1}
        ]
        let options = {duration: 100, fill: 'forwards', easing: 'ease-in'}
        if(table.classList.contains('closed')){
            if(this.childElementCount == 0) return;
            table.classList.remove('closed')
            table.animate(keyframes, options)
        }
        else {
            table.animate(keyframes, {...options, direction: 'reverse'})
            setTimeout(() => table.classList.add('closed'), 100)
        }
        this.blur()
    }
}

customElements.define('reading-progress', ReadingProgress)