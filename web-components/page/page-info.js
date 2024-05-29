import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import { toolboxItemStyle } from './toobox-item.style.js';
import '../aqv2/components/tooltip.js'
import '../aqv2/components/icon.js'
import { createLocalizer } from '../aqv2/lib/localize.js';
import { dialogStyles } from './styles/dialog.js';

export class PageInfo extends LitElement {
    constructor(){
        super()
    }

    render(){
        return html`
        <div class='base'>
            <link rel='stylesheet' href='/assets/css/aquamarinev2/button.css'>
            <aq-tooltip>
                <button class='activator' @click=${this.openInfo} name=${this.#localize('1')}>
                    <aq-icon class='icon' name='info'></aq-icon>
                    <div class='desc'>INFO</div>
                </button>
                <div slot='tooltip'>${this.#localize('1')}</div>
            </aq-tooltip>
            <dialog class='info'>
                <button @click=${this.closeInfo} class='close' title=${this.#localize('2')}>
                    <aq-icon name='close'></aq-icon>
                </button>
                <slot></slot>
            </dialog>
        </div>
        `
    }

    static get styles(){
        return [
            toolboxItemStyle,
            dialogStyles
        ]
    }

    static get lang(){
        return {
            'zh-cn': {
                '1': '关于此页面',
                '2': '关闭对话框'
            },
            default: {
                1: 'About this page',
                2: 'Close this dialog'
            }
        }
    }

    #localize = createLocalizer(PageInfo.lang)

    /**@returns {HTMLDialogElement} */
    get #dialog() {
        return this.shadowRoot?.querySelector('dialog.info')
    }

    openInfo(){
        this.#dialog.classList.remove('closing')
        this.#dialog.showModal()
        this.#dialog.animate([
            {transform: 'translateY(30%)', opacity: 0},
            {transform: 'translateY(0%)', opacity: 1}
        ], {
            duration: 100,
            fill: 'forwards',
            ease: 'ease-out'
        })
    }

    closeInfo(){
        this.#dialog.classList.add('closing')
        this.#dialog.animate([
            {transform: 'translateY(0%)', opacity: 1},
            {transform: 'translateY(30%)', opacity: 0}
        ], {
            duration: 100,
            fill: 'forwards',
            ease: 'ease-out'
        }).onfinish = () => { this.#dialog.close() }
    }
}

customElements.define('page-info', PageInfo)