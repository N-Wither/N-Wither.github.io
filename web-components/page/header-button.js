import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';

export let headerButtonStyle = css`
:host {
    --header-button-cursor: pointer;
    --header-button-height: var(--header-height);
}

.button {
    border: none;
    background: none;
    font-family: inherit;
    font-size: 1.4em;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    color: inherit;
    width: var(--header-button-height);
    height: var(--header-button-height);
}

.base {
    min-width: var(--header-button-height);
    height: var(--header-button-height);
    background-image: linear-gradient(180deg, var(--accent-color), var(--accent-color));
    background-repeat: no-repeat;
    background-position: top;
    background-size: 100% 0%;
    transition: var(--transition-time-slower);
    position: relative;
    display: flex;
    cursor: var(--header-button-cursor);
}

.base slot {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
}

.base::after {
    position: absolute;
    content: "";
    display: block;
    inset: 0;
    background-image: linear-gradient(180deg, var(--accent-color-dk), var(--accent-color-dk));
    background-repeat: no-repeat;
    background-position: top;
    background-size: 100% 0%;
    transition: var(--transition-time-common);
    z-index: -1;
}

.base:hover, .base:hover::after, .base:focus-within, .base:focus-within::after {
    background-size: 100% 100%;
}

aq-tooltip {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
}

::selection {
    color: inherit;
    background-color: var(--selection-background);
}
`

export class HeaderButton extends LitElement{
    constructor(){
        super()
    }

    render() {
        return html`
        <div class='base'>
            <slot></slot>
        </div>
        `
    }

    get button(){
        return this.shadowRoot?.querySelector('.button') ?? null
    }

    get base(){
        return this.shadowRoot?.querySelector('.base') ?? null
    }


    static get styles(){
        return [headerButtonStyle]
    }
}

customElements.define('header-button', HeaderButton)