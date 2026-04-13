import { DomUtils } from '/assets/js/squash/dom.js'
import { html, css, LitElement } from 'https://esm.sh/lit@3.2.0';

class WordCounter extends LitElement {
    static properties = {
        locale: { type: String },
        target: { type: String },
        prefix: { type: String }
    }

    static styles = css`
    :host {
        display: inline;
    }`

    constructor() {
        super()
        this.locale = navigator.language || 'en-US'
        this.target = ''
        this.prefix = ''
    }

    /**
     * 
     * @param {string} text 
     * @param {string} locale 
     */
    static countWords(text, locale) {
        if (locale.toUpperCase().match(/^(ZH|JA|KO)/)) {
            return DomUtils.countWordsCJK(text, locale)
        } else {
            return DomUtils.countWordsLatin(text, locale)
        }
    }

    connectedCallback() {
        super.connectedCallback()
        const targetElement = document.querySelector(this.target)
        if (!targetElement) {
            console.warn(`WordCounter: target element "${this.target}" not found.`)
            return
        }
        const text = new Text(this.prefix + WordCounter.countWords(targetElement.textContent, this.locale).toString())
        this.shadowRoot.appendChild(text)
    }
}

customElements.define('word-counter', WordCounter)
