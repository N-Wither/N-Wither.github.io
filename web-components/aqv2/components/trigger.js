/// <reference path="../../../_typings/index.d.ts" />

import { LitElement, html } from 'https://esm.sh/lit@3.2.0';

/**
 * When this element is viewed by the user, it triggers an event.
 * @fires trigger
 */
class AqTrigger extends LitElement {
    render() {
        return html`<slot></slot>`
    }

    connectedCallback() {
        super.connectedCallback()
        let ob = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.dispatchEvent(new CustomEvent('trigger', { bubbles: true, composed: true }))
                    if(this.ontrigger != undefined && typeof this.ontrigger == 'function') {
                        this.ontrigger(this)
                    }
                    if(this.ontrigger == undefined && this.getAttribute('ontrigger') != null) {
                        this.ontrigger = Function(this.getAttribute('ontrigger'))
                        this.ontrigger(this)
                    }
                }
            })
        })
        ob.observe(this)
    }
}

customElements.define('aq-trigger', AqTrigger);