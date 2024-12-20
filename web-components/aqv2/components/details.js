/// <reference path="../../../_typings/index.d.ts" />

import { html, css } from 'https://esm.sh/lit@3.2.0';
import { createLocalizer } from '../lib/localize.js';
import { AqElement } from '../lib/aq-element.js';
import { DomUtils } from '../../../assets/js/squash/dom.js'

export class AqDetails extends AqElement {
    static styles = css`
    :host {
        display: block;

        --summary-header-bg-color: var(--background-color-dk);
        --summary-header-hightlight-color: var(--text-color-contrast);
        --summary-border-color: var(--border-color);
        --summary-border-width: 0.1em;
        --summary-border-style: solid;
        --summary-content-padding: 0.6em;
    }

    .summary {
        display: flex;
        font-weight: bold;
        border: var(--summary-border-style) var(--summary-border-color) var(--summary-border-width);
    }

    .summary:is(:hover, :focus-within) .icon {
        background-color: var(--summary-header-hightlight-color);
    }

    .summary .activator {
        display: flex;
        align-items: center;
        gap: 0.2em;
        cursor: pointer;
        font-family: inherit;
        background-color: var(--summary-header-bg-color);
        border: none;
        transition: var(--transition-time-common);
        color: var(--text-color);
        font-size: 1em;
        width: 100%;
        height: 100%;
        text-align: start;
    }

    .summary .activator:is(:hover,:focus) {
        background-color: var(--accent-color);
        color: var(--summary-header-hightlight-color);
    }

    .icon {
        transition: var(--transition-time-common);
        background-color: var(--text-color);
        width: 1em;
        height: 1em;
        clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
    }

    :host([open]) .summary {
        border-bottom: none;
    }

    :host([open]) .icon {
        transform: rotate(90deg);
    }

    :host slot[name=close] {
        display: none;
    }

    :host([open]) slot[name=close] {
        display: block;
    }

    :host([open]) slot[name=summary] {
        display: none;
    }

    .content-wrapper {
        transition: var(--transition-time-common);
        transition-behavior: allow-discrete;
        border: var(--summary-border-style) var(--summary-border-color) var(--summary-border-width);
        box-sizing: content-box;
    }

    .content {
        margin: var(--summary-content-padding);
    }

    @supports (height: calc-size(auto)) {
        .content-wrapper {
            overflow: hidden;
            display: none;
            height: 0;
        }

        :host([open]) .content-wrapper {
            display: block;
            height: calc-size(auto);

            @starting-style {
                display: block;
                height: 0;
            }
        }
    }

    @supports not (height: calc-size(auto)) {
        .content-wrapper {
            display: none;
            overflow: hidden;
            height: 0;
        }

        :host([open]) .content-wrapper {
            display: block;
            height: auto;

            @starting-style {
                display: block;
                height: 0;
            }
        }
    }
    `

    static lang = {
        default: {
            1: 'Details'
        },
        'zh-cn': {
            1: '详细信息'
        }
    }

    static properties = {
        open: {type: Boolean}
    }

    #localize = createLocalizer(AqDetails.lang)
    /**@type {HTMLDivElement} */
    get #content() { return this.shadowRoot.querySelector('.content-wrapper') }

    render() {
        return html`
        <div class='summary'>
            <button @click=${this.open == true ? this.hide : this.show} class='activator'>
                <div class='icon'></div>
                <slot name='summary'>${this.#localize(1)}</slot>
                <slot name='close'>${this.#localize(1)}</slot>
            </button>
        </div>
        <div class='content-wrapper'>
            <div class='content'>
                <slot></slot>
            </div>
        </div>
        `
    }

    show() {
        if(this.open == true) return;

        this.setAttribute('open', '')

        if(CSS.supports('height: calc-size(auto)') == false) {
            let height = this.#content.scrollHeight
            this.#content.animate([
                {height: '0px'},
                {height: `${height}px`}
            ], {duration: 200, easing: 'ease-out'})
        }

        this.dispatchEvent(new CustomEvent('show'))
    }

    hide() {
        if(CSS.supports('height: calc-size(auto)') == false) {
            if(this.closing == true) return
            this.closing = true
            let height = this.#content.scrollHeight
            this.#content.animate([
                {height: `${height}px`},
                {height: '0px'},
            ], {duration: 200, easing: 'ease-out'}).onfinish = () => {
                this.removeAttribute('open')
                delete this.closing
            }
        }
        else this.removeAttribute('open')

        this.dispatchEvent(new CustomEvent('hide'))
    }

    connectedCallback() {
        super.connectedCallback()

        let summary = this.sl('[slot=summary]')
        let close = this.sl('[slot=close]')
        if(summary != null && close == null) {
            DomUtils.make('span', summary.innerHTML).attr('slot', 'close').insertAfter(summary)
        }
    }
}

customElements.define('aq-details', AqDetails);