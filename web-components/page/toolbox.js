import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class ToolBox extends LitElement {
    constructor(){
        super()
    }

    render(){
        return html`
        <div class='base'>
            <slot></slot>
        </div>
        `
    }

    static get styles(){
        return css`
        :host {
            display: block;
            position: fixed;
            top: calc(var(--header-height) + 1.2em);
            right: 0.8em;
        }

        .base {
            background: var(--background-color);
            box-shadow: 0px 4px 8px var(--shadow-color);
            width: var(--header-height);
        }
        `
    }
}

customElements.define('tool-box', ToolBox)