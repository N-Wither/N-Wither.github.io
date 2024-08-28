import { LitElement, html, css } from 'https://esm.sh/lit@3.2.0';

export let headerButtonStyle = css`
:host {
    --header-button-cursor: pointer;
    --header-button-height: var(--header-height);
    --header-button-bg-color-1: var(--accent-color);
    --header-button-bg-color-2: var(--accent-color-dk);
    --header-button-bg-transition-time-1: var(--transition-time-slower);
    --header-button-bg-transition-time-2: var(--transition-time-common);
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
    background-image: linear-gradient(180deg, var(--header-button-bg-color-1), var(--header-button-bg-color-1));
    background-repeat: no-repeat;
    background-position: top;
    background-size: 100% 0%;
    transition: var(--header-button-bg-transition-time-2);
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
    background-image: linear-gradient(180deg, var(--header-button-bg-color-2), var(--header-button-bg-color-2));
    background-repeat: no-repeat;
    background-position: top;
    background-size: 100% 0%;
    transition: var(--header-button-bg-transition-time-1);
    z-index: -1;
}

.base:hover, .base:hover::after, .base:focus-within, .base:focus-within::after {
    background-size: 100% 100%;
}

.base:hover, .base:focus-within {
    transition: var(--header-button-bg-transition-time-1)
}

.base:hover::after, .base:focus-within::after {
    transition: var(--header-button-bg-transition-time-2)
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