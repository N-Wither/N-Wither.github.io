import {LitElement, html} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import { style } from './header.style.js';
import './nav-menu.js'
import './darkmode-button.js'

export class PageHeader extends LitElement {
    constructor(){
        super()
    }

    static get styles(){
        return style
    }

    render(){
        return html`
        <div class='page-header base'>
            <nav-menu></nav-menu>
            <slot name='category'></slot>
            <div class='button-area'>
                <slot name='button'></slot>
                <darkmode-button slot='button'></darkmode-button>
            </div>
        </div>
        `
    }
}

customElements.define('page-header', PageHeader)