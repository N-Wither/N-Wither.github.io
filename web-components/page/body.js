import {LitElement, html, css} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export class PageBody extends LitElement {
    constructor(){
        super()
    }

    static get styles(){
        return css`
        :host{
            display: block;
            margin: 0 min(10rem, 10%);
            min-height: calc(100vh - 20rem);
        }
        `
    }

    render(){
        this.role = 'main'
        return html`
        <slot></slot>
        `
    }
}

customElements.define('page-body', PageBody)