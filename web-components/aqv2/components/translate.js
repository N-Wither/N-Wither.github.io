/// <reference path="../../../_typings/index.d.ts" />

import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class AqTranslate extends LitElement {
    render(){
        return html`${this.#translate()}`
    }

    static get properties() {
        return {
            key: { type: String },
            fallback: { type: String },
            mapName: {type: String },
            lang: {type: String }
        }
    }

    static get styles() {
        return css`
        ::selection {
            color: inherit;
            background-color: color-mix(in srgb, var(--accent-color-dk) 60%, transparent 60%);
        }
        `
    }

    constructor(){
        super()
        this.key = 'default'
        this.fallback = this.innerHTML
        this.lang = navigator.language.toLowerCase()
        this.mapName = 'aqLanguageMap'
    }

    #translate(){
        const map = window?.[this.mapName] ?? {}
        if(document.documentElement.lang.toLowerCase() != this.lang) {
            document.documentElement.lang = this.lang
        }
        const span = document.createElement('span')
        const result = map?.[this.lang]?.[this.key] ?? map?.['default']?.[this.key] ?? this.fallback
        span.innerHTML = result
        return span
    }

    reload(){
        this.shadowRoot.innerHTML = `${this.#translate().innerHTML}`
    }
}

customElements.define('aq-translate', AqTranslate);
customElements.define('aq-ts', class extends AqTranslate {}); // A short version for convenience

function getElements(){
    return document.querySelectorAll('aq-translate, aq-ts')
}

export function reloadTranslations(){
    const elements = getElements()
    elements.forEach(element => element.reload())
}

export function resetLanguage(lang){
    const elements = getElements()
    elements.forEach(element => element.lang = lang)
    document.documentElement.lang = lang
}

window.reloadTranslations = reloadTranslations
window.resetLanguage = resetLanguage