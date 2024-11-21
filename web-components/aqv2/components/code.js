/// <reference path="../../../_typings/index.d.ts" />

import { html, css } from 'https://esm.sh/lit@3.2.0';
import dedent from 'https://esm.sh/ts-dedent@2.2.0';
import { codeToHtml } from 'https://esm.sh/shiki@1.12.0';
// import { codeToHtml } from 'https://cdn.jsdelivr.net/npm/shiki@1.4.0/+esm';
import { AqElement } from '../lib/aq-element.js';
import { createLocalizer } from '../lib/localize.js';
import './icon.js'
import './tooltip.js'

export class AqCodeblock extends AqElement {
    constructor() {
        super();
        this.language = 'text'
        this.inline = false
        this.src = null
    }

    static get properties() {
        return {
            language: {},
            inline: {type: Boolean},
            src: {}
        };
    }

    static lang = {
        'zh-cn': {
            1: '复制到剪贴板'
        },
        default: {
            1: 'Copy to clipboard'
        }
    }

    static get styles() {
        return css`
            :host {
                --aq-code-bg: #fafbfc;
                display: block;
                width: 100%;
                font-family: monospace;
                font-size: 0.8em;
                background-color: var(--aq-code-bg);
                margin: 0.2em 0;
            }
            :host * {
                transition: all var(--transition-time-common);
            }
            :host([inline]) {
                display: inline;
            }
            :host([inline]) :is(.lang, .copy) {
                display: none;
            }
            :host([inline]) :is(.base, .code, pre) {
                display: inline;
            }
            :host([inline]) .code .line::before {
                display: none;
            }
            :host([data-theme=dark]){
                --aq-code-bg: #262335;
            }
            :host([data-theme=dark]) .shiki, :host([data-theme=dark]) .shiki span{
                color: var(--shiki-dark) !important;
                background-color: var(--shiki-dark-bg) !important;
                font-style: var(--shiki-dark-font-style) !important;
                font-weight: var(--shiki-dark-font-weight) !important;
                text-decoration: var(--shiki-dark-text-decoration) !important;
            }
            ::selection {
                color: inherit;
                background-color: color-mix(in srgb, var(--accent-color-dk) 60%, transparent 60%);
            }
            .code {
                margin-top: 1.6em;
            }
            .base {
                display: flex;
                position: relative;
                padding-bottom: 0.2em;
            }
            .code {
                white-space: pre;
                width: 100%;
            }
            .code pre {
                margin: 0;
                overflow: auto;
            }
            .code .line {
                position: relative;
                padding-left: 0.2em;
            }
            .code .line::before {
                content: attr(data-line);
                display: inline-flex;
                justify-content: center;
                width: 2.8em;
            }
            .lang {
                position: absolute;
                left: 0.2em;
                top: 0;
            }
            .copy {
                position: absolute;
                right: 0;
                top: 0;
            }
            aq-icon {
                --icon-font-size: 16px !important;
                font-size: 1em;
            }
            button {
                background-color: var(--aq-code-bg);
                border: none;
                color: inherit;
                padding: 0.2em;
            }
            button:is(:hover, :focus){
                color: var(--accent-color);
            }
        `;
    }

    /**@type {string} */
    #sourceText;
    // #channel = new BroadcastChannel('aquamarine-page-theme')
    #localize = createLocalizer(AqCodeblock.lang)

    render() {
        this.#sourceText = dedent(this.innerHTML);
        this.innerHTML = '';
        let theme = localStorage.getItem('theme-mode') ?? 'light'
        this.dataset.theme = theme

        // this.#channel.addEventListener('message', e => {
        //     this.dataset.theme = e.data.theme
        // })

        this.#formatAsync(this.inline)
        return html`
        <div class="base">
            <div class="lang">${this.language}</div>
            <div class="code"></div>
            <div class="copy">
                <aq-tooltip>
                    <button @click=${this.copy}>
                        <aq-icon name='content_copy'></aq-icon>
                    </button>
                    <div slot='tooltip'>${this.#localize(1)}</div>
                </aq-tooltip>
            </div>
        </div>
        `;
    }

    async #formatAsync(inline) {
        let html
        let shikiCfg = {
            lang: this.language,
            themes: {
                light: 'snazzy-light',
                dark: 'synthwave-84'
            }
        }
        if(this.src != null){
            this.#sourceText = await fetch(this.src).then(r => r.text())
            html = await codeToHtml(this.#sourceText, shikiCfg);
        }
        else {
            html = await codeToHtml(this.#sourceText, shikiCfg);
        }
        this.shadowRoot.querySelector('.code').innerHTML = html
        if(inline == false){
            let lines = this.shadowRoot.querySelector('.code').querySelectorAll('.line')
            lines.forEach((line, index) => {
                line.dataset.line = index + 1
            })
        }
        return html
    }

    copy(){
        if(navigator.clipboard){
            navigator.clipboard.writeText(this.#sourceText)
        }
        else {
            let input = document.createElement('input')
            input.setAttribute('value', this.#sourceText)
            document.body.appendChild(input)
            input.select()
            document.execCommand('copy')
            document.body.removeChild(input)
        }
    }
}

customElements.define('aq-code', AqCodeblock)

document.addEventListener('theme-change', e => {
    AqCodeblock.connectedInstances.forEach(el => {
        el.dataset.theme = e.detail.theme
    })
})
