import {LitElement, html} from 'https://esm.sh/lit@3.2.0';
import { style } from './header.style.js';
import './nav-menu.js'
import { navigateItems } from './nav-menu.js';
import './darkmode-button.js'
import './header-button.js'
import '../aqv2/components/icon.js'

export class PageHeader extends LitElement {
    constructor(){
        super()
    }

    static get styles(){
        return style
    }

    render(){
        let isFixedTheme = document.documentElement.hasAttribute('data-theme-fixed')
        return html`
        <div class='page-header base' part='base'>
            <nav-menu part='nav-menu'></nav-menu>
            <slot name='category' part='category' class='category'></slot>
            <div class='nav-widescreen' part='nav-widescreen'>
                ${navigateItems.map(item => html`
                <header-button>
                    <a class = "item" href = "${item.url}">
                        <aq-icon name="${item.icon}" size='small'></aq-icon>
                        <div class = "text">${item.text}</div>
                    </a>
                </header-button>
                `)}
            </div>
            <div class='button-area' part='buttons'>
                <slot name='button'></slot>
                ${isFixedTheme? '' : html`<darkmode-button></darkmode-button>`}
            </div>
        </div>
        `
    }
}

customElements.define('page-header', PageHeader)