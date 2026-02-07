import {LitElement, html, css} from 'https://esm.sh/lit@3.2.0';

/**@deprecated */
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