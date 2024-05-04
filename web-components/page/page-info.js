import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import { toolboxItemStyle } from './toobox-item.style.js';
import '../aqv2/components/tooltip.js'
import '../aqv2/components/icon.js'
import { createLocalizer } from '../aqv2/lib/localize.js';

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
            css`
            .info {
                background: var(--background-color);
                color: inherit;
                border: none;
                box-shadow: 0px 4px 8px var(--shadow-color);
                min-width: 12em;
                min-height: 8em;
                padding: 2em 1em;
                max-width: 80vw;
                overflow: auto;
                transition: var(--trasition-time-common);
            }

            .info::backdrop {
                animation: backdrop-animation forwards 0.1s;
            }

            .close {
                background: var(--button-bg);
                color: inherit;
                font-family: inherit;
                transition: var(--transition-time-common);
                position: absolute;
                right: 0;
                top: 0;
                width: 1.4em;
                height: 1.4em;
                font-size: 1.2em;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .close:is(:hover, :focus){
                background: var(--color-danger);
            }

            @keyframes backdrop-animation {
                0% {backdrop-filter: brightness(1) blur(0);}
                100% {backdrop-filter: brightness(80%) blur(4px);}
            }
            @keyframes backdrop-animation-closing {
                0% {backdrop-filter: brightness(80%) blur(4px);}
                100% {backdrop-filter: brightness(1) blur(0);}
            }

            .info.closing::backdrop {
                animation: backdrop-animation-closing forwards 0.1s;
            }
            `
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

    openInfo(){
        let dialog = this.shadowRoot?.querySelector('dialog.info')
        dialog.classList.remove('closing')
        dialog.showModal()
        dialog.animate([
            {transform: 'translateY(30%)', opacity: 0},
            {transform: 'translateY(0%)', opacity: 1}
        ], {
            duration: 100,
            fill: 'forwards',
            ease: 'ease-in'
        })
    }

    closeInfo(){
        let dialog = this.shadowRoot?.querySelector('dialog.info')
        dialog.classList.add('closing')
        dialog.animate([
            {transform: 'translateY(0%)', opacity: 1},
            {transform: 'translateY(30%)', opacity: 0}
        ], {
            duration: 100,
            fill: 'forwards',
            ease: 'ease-in'
        })
        setTimeout(() => {dialog.close()}, 100)
    }
}

customElements.define('page-info', PageInfo)