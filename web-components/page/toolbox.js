import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class ToolBox extends LitElement {
    constructor(){
        super()
    }

    render(){
        this.role = 'toolbar'
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
            top: calc(var(--toolbox-width) + 1em);
            right: 0.8em;
            z-index: 999;
            transition: var(--transition-time-common);
            background: var(--background-color);
            box-shadow: 0px 4px 8px var(--shadow-color);
            width: var(--toolbox-width);
        }
        `
    }
}

customElements.define('tool-box', ToolBox)