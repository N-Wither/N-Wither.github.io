/// <reference path="../../../_typings/index.d.ts" />

import { html, css, LitElement } from 'https://esm.sh/lit@3.2.0';

/**
 * @fires visible when the element is visible in the viewport
 */
class AqVisiblilityTrigger extends LitElement {
    static styles = css`
    :host {
        display: block;
        height: 1rem;
    }
    `

    static properties = {
        ratio: { type: Number }
    }

    #observer = new IntersectionObserver(([entry]) => {
        if (entry.intersectionRatio >= this.ratio) {
            this.dispatchEvent(new CustomEvent('visible', { detail: { ratio: entry.intersectionRatio } }))
        }
    })

    constructor() {
        super()
        this.ratio = 0.1
    }

    connectedCallback() {
        super.connectedCallback()
        this.#observer.observe(this)
    }
}

customElements.define('aq-visibility-trigger', AqVisiblilityTrigger)
