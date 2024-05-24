/// <reference path="../../../_typings/index.d.ts" />

import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class AqTab extends LitElement {
    static get styles() {
        return css`
        :host {
            display: flex;
            flex-direction: column;
        }
        .label {
            display: flex;
            flex-wrap: wrap;
            background-color: var(--border-color);
            gap: 0.1em;
        }
        .panel {
            display: block;
            border: 0.1em solid var(--border-color);
            padding: 0.4em;
        }
        `
    }

    render() {
        return html`
        <slot name="label" class='label' @click=${this.open}></slot>
        <slot name="panel" class='panel'></slot>
        `
    }

    /**@param {MouseEvent} e  */
    open(e){
        /**@type {AqTabLabel} */
        let label = e.target;
        if(label.hasAttribute('active') == true) return;
        let panel = this.querySelector(`aq-tab-panel[value="${label.value}"]`)
        let allLabels = this.querySelectorAll('aq-tab-label')
        let allPanels = this.querySelectorAll('aq-tab-panel')

        allLabels.forEach(l => l.removeAttribute('active'))
        allPanels.forEach(p => p.close())

        label.open()
        panel.open()

        this.dispatchEvent(new CustomEvent('tab-change', {detail: {value: label.value}}))
    }
}
export class AqTabLabel extends LitElement {
    static get properties() {
        return {
            value: {type: String},
            active: {type: Boolean}
        }
    }

    static get styles() {
        return css`
        :host {
            display: block;
            flex-grow: 1;
            background-color: var(--background-color-dk);
            position: relative;
        }
        .activator {
            background-color: transparent;
            width: 100%;
            height: 100%;
            font-family: inherit;
            color: var(--text-color);
            border: none;
            cursor: pointer;
            padding: 0.8em;
            background-image: linear-gradient(to top, var(--accent-color), var(--accent-color));
            background-size: 100% 0;
            background-repeat: no-repeat;
            background-position: bottom;
            transition: background-size 0.2s ease-in-out;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .activator:is(:hover, :focus) {
            background-size: 100% 100%;
        }
        :host([active]) .activator {
            background-size: 100% 100%;
        }
        :host::after {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            transform: translateX(-50%);
            left: 50%;
            top: 100%;
            z-index: 1;
            border-style: solid;
            border-color: var(--accent-color) transparent transparent transparent;
            border-width: 0;
            transition: 0.2s;
        }
        :host([active])::after {
            border-width: 0.575em;
        }
        `
    }

    render() {
        this.setAttribute('slot', 'label')
        return html`
        <button class='activator'><slot></slot></button>
        `
    }

    open() {
        this.setAttribute('active', '')
    }
}
export class AqTabPanel extends LitElement {
    static get properties() {
        return {
            value: {type: String},
            active: {type: Boolean}
        }
    }

    static get styles() {
        return css`
        :host {
            display: none;
            overflow: hidden;
            box-sizing: content-box !important;
        }
        :host([active]) {
            display: block;
        }
        `
    }

    render() {
        this.setAttribute('slot', 'panel')
        return html`<slot></slot>`
    }

    open() {
        if(this.hasAttribute('active') == true) return;
        this.setAttribute('active', '')
        let height = this.scrollHeight
        this.animate([
            {maxHeight: 0}, {maxHeight: height + 'px'} 
        ], {duration: 200, easing: 'ease-in-out'})
    }

    close() {
        if(this.hasAttribute('active') == false) return;
        let height = this.scrollHeight
        this.animate([
            {maxHeight: height + 'px'}, {maxHeight: 0} 
        ], {duration: 200, easing: 'ease-in-out'}).onfinish = () => {
            this.removeAttribute('active')
        }
    }
}

customElements.define('aq-tab', AqTab);
customElements.define('aq-tab-label', AqTabLabel);
customElements.define('aq-tab-panel', AqTabPanel);